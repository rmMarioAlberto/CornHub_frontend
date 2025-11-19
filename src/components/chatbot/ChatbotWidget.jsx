// src/components/chatbot/ChatbotWidget.jsx
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Leaf, User } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { API_URL } from '../../utils/env';

const ChatbotWidget = ({ selectedParcela }) => {
  const { auth } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && selectedParcela?.id_parcela) {
      loadChatHistory();
    }
  }, [isOpen, selectedParcela?.id_parcela]);

  const loadChatHistory = async () => {
    if (!auth?.accessToken || !selectedParcela?.id_parcela) return;
    try {
      const res = await fetch(`${API_URL}/chat/getChat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.accessToken}`,
        },
        body: JSON.stringify({ idParcela: selectedParcela.id_parcela }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.data || []);
      }
    } catch (err) {
      console.warn('Error cargando historial del chat');
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || !selectedParcela?.id_parcela) return;

    const userMessage = { role: 'user', message: inputValue.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const res = await fetch(`${API_URL}/chat/chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.accessToken}`,
        },
        body: JSON.stringify({
          idParcela: selectedParcela.id_parcela,
          message: inputValue.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMessage = {
          role: 'assistant',
          message: data.message || 'No pude procesar tu solicitud.',
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', message: 'Lo siento, no puedo responder en este momento.' },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', message: 'Error de conexión. Verifica tu internet.' },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKeyPress) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Burbuja flotante */}
      {selectedParcela && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 z-50 bg-verde-brillante hover:bg-verde-brillante/90 text-white rounded-full p-5 shadow-2xl border-4 border-white ring-4 ring-verde-brillante/30 transition-all duration-300 hover:scale-110 hover:ring-verde-brillante/50"
          aria-label="Abrir chat con KORI"
        >
          <MessageCircle className="w-10 h-10 drop-shadow-lg" />
        </button>
      )}

      {/* Modal del Chat */}
      {isOpen && selectedParcela && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4 md:p-8">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg h-[90vh] md:h-[620px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-right duration-300">
            {/* Header */}
            <div className="bg-verde-profundo text-white p-5 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-4">
                <div className="relative inline-block">
                  <div className="w-14 h-14 bg-verde-lima-claro/30 rounded-full flex items-center justify-center">
                    <Leaf className="w-9 h-9 text-verde-brillante" />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-verde-brillante rounded-full border-4 border-verde-profundo"></span>
                </div>
                <div>
                  <h3 className="font-bold text-xl text-white">KORI</h3>
                  <p className="text-sm text-verde-lima-claro">Asistente agrícola • En línea</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 rounded-full p-2 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Área de mensajes */}
            <div className="flex-1 overflow-y-auto p-6 bg-gris-suave">
              {messages.length === 0 && !isTyping && (
                <div className="text-center text-negro-texto/70 mt-20">
                  <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-verde-lima-claro/30 flex items-center justify-center shadow-lg">
                    <Leaf className="w-14 h-14 text-verde-brillante" />
                  </div>
                  <p className="text-xl font-medium text-negro-texto">
                    ¡Hola! Soy <span className="text-verde-brillante font-bold">KORI</span>
                  </p>
                  <p className="text-base mt-2">
                    Pregúntame cualquier cosa sobre tu parcela{' '}
                    <span className="text-verde-brillante font-semibold">
                      {selectedParcela.nombre}
                    </span>
                  </p>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-4 items-end mb-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                        msg.role === 'user' ? 'bg-verde-profundo' : 'bg-verde-lima-claro'
                      }`}
                    >
                      {msg.role === 'user' ? (
                        <User className="w-6 h-6 text-white" />
                      ) : (
                        <Leaf className="w-6 h-6 text-verde-brillante" />
                      )}
                    </div>
                  </div>

                  {/* Burbuja */}
                  <div
                    className={`px-5 py-3 rounded-3xl shadow-lg max-w-[75%] ${
                      msg.role === 'user'
                        ? 'bg-verde-brillante text-white'
                        : 'bg-white text-negro-texto border border-verde-lima-claro/50'
                    }`}
                  >
                    <p className="text-base leading-6 whitespace-pre-wrap">{msg.message}</p>
                  </div>
                </div>
              ))}

              {/* Indicador de escritura */}
              {isTyping && (
                <div className="flex gap-4 items-end mb-6">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-verde-lima-claro flex items-center justify-center shadow-md">
                      <Leaf className="w-6 h-6 text-verde-brillante" />
                    </div>
                  </div>
                  <div className="px-5 py-4 rounded-3xl bg-white shadow-md border border-verde-lima-claro/50">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-verde-brillante rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                      <div className="w-3 h-3 bg-verde-brillante rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-3 h-3 bg-verde-brillante rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-5 border-t bg-white">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe un mensaje..."
                  className="input-field flex-1 text-base placeholder:text-negro-texto/50 focus:border-verde-brillante focus:ring-4 focus:ring-verde-brillante/20 rounded-xl"
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-verde-brillante hover:bg-verde-brillante/90 disabled:opacity-60 text-white p-4 rounded-xl shadow-lg transition shrink-0"
                >
                  <Send className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;