// src/utils/crypto.js
import { API_URL } from './env';

class CryptoManager {
  constructor() {
    this.sessionId = null;
    this.aesKey = null;
    this.nonce = 0;
    this.handshakePromise = null;
  }

  /**
   * Convierte un ArrayBuffer a string Base64
   */
  arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  /**
   * Convierte un string Base64 a ArrayBuffer
   */
  base64ToArrayBuffer(base64) {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  /**
   * Guarda la sesión actual en sessionStorage
   */
  saveSession(aesKeyHash) {
    if (!this.sessionId) return;
    
    const sessionData = {
      sessionId: this.sessionId,
      nonce: this.nonce,
      // Si pasamos el hash crudo, lo guardamos. Si no, intentamos no tocar la key si ya está guardada.
      // Para simplificar, siempre guardaremos el hash cuando se crea la sesión.
      // En actualizaciones de nonce, solo actualizamos nonce.
    };

    if (aesKeyHash) {
      sessionData.aesKey = this.arrayBufferToBase64(aesKeyHash);
    } else {
      // Mantener key existente si no se provee una nueva
      const existing = JSON.parse(sessionStorage.getItem('crypto_session') || '{}');
      sessionData.aesKey = existing.aesKey;
    }

    sessionStorage.setItem('crypto_session', JSON.stringify(sessionData));
  }

  /**
   * Carga la sesión desde sessionStorage
   */
  async loadSession() {
    try {
      const stored = sessionStorage.getItem('crypto_session');
      if (!stored) return false;

      const { sessionId, nonce, aesKey } = JSON.parse(stored);
      if (!sessionId || !aesKey) return false;

      // Importar clave AES
      const aesKeyHash = this.base64ToArrayBuffer(aesKey);
      this.aesKey = await window.crypto.subtle.importKey(
        'raw',
        aesKeyHash,
        { name: 'AES-GCM' },
        false,
        ['encrypt', 'decrypt']
      );

      this.sessionId = sessionId;
      this.nonce = nonce || 0;
      console.log('💾 Sesión crypto restaurada:', this.sessionId);
      return true;
    } catch (e) {
      console.error('Error restaurando sesión crypto:', e);
      this.reset();
      return false;
    }
  }

  async ensureSession() {
    if (this.sessionId && this.aesKey) return;
    
    // Intentar cargar sesión guardada
    const loaded = await this.loadSession();
    if (loaded) return;

    // Si no hay guardada, hacer handshake
    await this.performHandshake();
  }

  /**
   * Realiza el handshake con el servidor para establecer la sesión segura
   */
  async performHandshake() {
    // Si ya hay un handshake en proceso, devolver esa promesa
    if (this.handshakePromise) {
      return this.handshakePromise;
    }

    this.handshakePromise = (async () => {
      try {
        console.log('🔐 Iniciando handshake crypto...');
        
        // 1. Generar par de claves ECDH (P-256)
        const keyPair = await window.crypto.subtle.generateKey(
          {
            name: 'ECDH',
            namedCurve: 'P-256',
          },
          true,
          ['deriveKey', 'deriveBits']
        );

        // 2. Exportar clave pública para enviar al servidor
        const publicKeyRaw = await window.crypto.subtle.exportKey('raw', keyPair.publicKey);
        const clientPublicKey = this.arrayBufferToBase64(publicKeyRaw);

        // 3. Enviar clave pública al servidor
        const response = await fetch(`${API_URL}/crypto/handshake`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clientPublicKey }),
        });

        if (!response.ok) {
          throw new Error(`Handshake failed: ${response.status}`);
        }

        const data = await response.json();
        
        // 4. Procesar respuesta
        this.sessionId = data.sessionId;
        
        let serverKeyBuffer;
        try {
          serverKeyBuffer = this.base64ToArrayBuffer(data.serverPublicKey);
        } catch (e) {
          throw new Error('Error decodificando clave del servidor');
        }

        // Importar clave del servidor
        const serverPublicKey = await window.crypto.subtle.importKey(
          'raw',
          serverKeyBuffer,
          { name: 'ECDH', namedCurve: 'P-256' },
          false,
          []
        );

        // 5. Derivar Bits (Shared Secret)
        const sharedSecretBits = await window.crypto.subtle.deriveBits(
          {
            name: 'ECDH',
            public: serverPublicKey,
          },
          keyPair.privateKey,
          256
        );

        // 6. Hashear el secreto para obtener la clave AES (SHA-256)
        const aesKeyHash = await window.crypto.subtle.digest('SHA-256', sharedSecretBits);

        // 7. Importar como clave AES-GCM
        this.aesKey = await window.crypto.subtle.importKey(
          'raw',
          aesKeyHash,
          { name: 'AES-GCM' },
          false,
          ['encrypt', 'decrypt']
        );

        this.nonce = 0; // Resetear nonce
        
        // 8. Guardar sesión
        this.saveSession(aesKeyHash);
        
        console.log('✅ Handshake exitoso. SessionID:', this.sessionId);
        
      } catch (error) {
        console.error('❌ Error en handshake:', error);
        this.reset();
        throw error;
      } finally {
        this.handshakePromise = null;
      }
    })();

    return this.handshakePromise;
  }

  /**
   * Encripta un objeto JSON
   */
  async encrypt(data) {
    await this.ensureSession();

    try {
      const plainText = JSON.stringify(data);
      const encoder = new TextEncoder();
      const encodedData = encoder.encode(plainText);

      // Generar IV (12 bytes)
      const iv = window.crypto.getRandomValues(new Uint8Array(12));

      // Incrementar nonce
      this.nonce++;
      this.saveSession(); // Actualizar nonce en storage

      // Encriptar
      const cipherBuffer = await window.crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv,
          tagLength: 128, // 16 bytes tag (estándar)
        },
        this.aesKey,
        encodedData
      );

      const cipherArray = new Uint8Array(cipherBuffer);
      const tagLength = 16;
      const cipherTextLength = cipherArray.length - tagLength;
      
      const cipherTextBytes = cipherArray.slice(0, cipherTextLength);
      const tagBytes = cipherArray.slice(cipherTextLength);

      return {
        sessionId: this.sessionId,
        nonce: this.nonce,
        cipherText: this.arrayBufferToBase64(cipherTextBytes.buffer),
        iv: this.arrayBufferToBase64(iv.buffer),
        tag: this.arrayBufferToBase64(tagBytes.buffer),
      };

    } catch (error) {
      console.error('Error encriptando:', error);
      // Si falla encriptación por falta de sesión, intentar handshake y reintentar
      this.reset();
      throw error;
    }
  }

  /**
   * Desencripta la respuesta del servidor
   */
  async decrypt(encryptedData) {
    if (!this.aesKey) {
      throw new Error('No hay clave de sesión para desencriptar');
    }

    const { cipherText, iv, tag, nextNonce } = encryptedData;

    try {
      const ivBytes = this.base64ToArrayBuffer(iv);
      const tagBytes = this.base64ToArrayBuffer(tag);
      const cipherBytes = this.base64ToArrayBuffer(cipherText);

      // Reconstruir buffer para Web Crypto (CipherText + Tag)
      const encryptedBuffer = new Uint8Array(cipherBytes.byteLength + tagBytes.byteLength);
      encryptedBuffer.set(new Uint8Array(cipherBytes), 0);
      encryptedBuffer.set(new Uint8Array(tagBytes), cipherBytes.byteLength);

      const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: new Uint8Array(ivBytes),
          tagLength: 128,
        },
        this.aesKey,
        encryptedBuffer
      );

      const decoder = new TextDecoder();
      const plainText = decoder.decode(decryptedBuffer);
      
      // Actualizar nonce si el servidor lo sugiere
      if (typeof nextNonce === 'number') {
        this.nonce = nextNonce - 1; // Ajustamos para que el próximo incremento coincida
        this.saveSession(); // Guardar nuevo nonce
      }

      return JSON.parse(plainText);

    } catch (error) {
      console.error('Error desencriptando:', error);
      throw new Error('Fallo al desencriptar respuesta');
    }
  }
  
  reset() {
    this.sessionId = null;
    this.aesKey = null;
    this.nonce = 0;
    sessionStorage.removeItem('crypto_session');
  }
}

export const cryptoManager = new CryptoManager();
