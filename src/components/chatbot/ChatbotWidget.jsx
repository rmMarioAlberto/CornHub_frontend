// src/components/chatbot/ChatbotWidget.jsx
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Leaf } from 'lucide-react';
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
        body: JSON.stringify({ idParcel: selectedParcela.id_parcela }),
      });

      if (res.ok) {
        const data = await res.json();

        // La respuesta real tiene: data.data.messages (array de objetos con "content")
        const rawMessages = data?.data?.messages || [];

        // Normalizamos al formato esperado por el componente: { role, message }
        const normalizedMessages = rawMessages.map(msg => ({
          role: msg.role,
          message: msg.content || '',
        }));

        setMessages(normalizedMessages);
      }
    } catch (err) {
      console.warn('Error cargando historial del chat', err);
      setMessages([]);
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || !selectedParcela?.id_parcela) return;

    const userMessage = { role: 'user', message: inputValue.trim() };
    setMessages(prev => [...prev, userMessage]);
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
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', message: 'Lo siento, no puedo responder en este momento.' },
        ]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', message: 'Error de conexión. Verifica tu internet.' },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Botón flotante */}
      {selectedParcela && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-[#6DA544] hover:bg-[#2E5C3F] text-white rounded-full p-6 shadow-2xl border-4 border-white ring-4 ring-[#6DA544]/30 transition-all duration-300 hover:scale-110 hover:ring-[#6DA544]/50"
          aria-label="Abrir chat con KORI"
        >
          <MessageCircle className="w-10 h-10 drop-shadow-lg" />
        </button>
      )}

      {/* Modal del Chat */}
      {isOpen && selectedParcela && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4 md:p-2">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md h-[90vh] md:h-[680px] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-[#6DA544] text-white p-6 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl">
                  <Leaf className="w-9 h-9 text-[#6DA544]" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-white">KORI</h3>
                  <p className="text-sm text-[#C3D18D] font-medium">Asistente agrícola • En línea</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 rounded-full p-3 transition"
              >
                <X className="w-7 h-7" />
              </button>
            </div>

            {/* Área de mensajes */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#F5F5F5]">
              {messages.length === 0 && !isTyping && (
                <div className="text-center mt-12">
                  <Leaf className="w-20 h-20 mx-auto mb-6 text-[#6DA544] opacity-90" />
                  <p className="text-lg font-semibold text-[#1A1A1A]">
                    ¡Hola! Soy <span className="text-[#6DA544]">KORI</span>
                  </p>
                  <p className="text-base mt-3 text-[#1A1A1A]/80">
                    Pregúntame sobre tu parcela{' '}
                    <span className="font-bold text-[#6DA544]">{selectedParcela.nombre}</span>
                  </p>
                </div>
              )}

              {Array.isArray(messages) && messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[82%] px-5 py-4 rounded-3xl shadow-lg font-medium text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#6DA544] text-white'
                        : 'bg-[#A8CDBD] text-[#1A1A1A] border border-[#6DA544]/20'
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#A8CDBD] px-5 py-4 rounded-3xl shadow-lg border border-[#6DA544]/20">
                    <div className="flex space-x-2">
                      <div className="w-2.5 h-2.5 bg-[#6DA544] rounded-full animate-bounce" />
                      <div className="w-2.5 h-2.5 bg-[#6DA544] rounded-full animate-bounce [animation-delay:0.15s]" />
                      <div className="w-2.5 h-2.5 bg-[#6DA544] rounded-full animate-bounce [animation-delay:0.3s]" />
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
                  placeholder="Escribe tu pregunta aquí..."
                  className="flex-1 px-5 py-4 border-2 border-[#C3D18D] rounded-2xl text-[#1A1A1A] placeholder:text-[#1A1A1A]/50 focus:outline-none focus:border-[#6DA544] focus:ring-4 focus:ring-[#6DA544]/20 transition-all font-medium"
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-[#6DA544] hover:bg-[#2E5C3F] disabled:bg-[#6DA544]/60 text-white p-4 rounded-2xl shadow-xl transition-all duration-200 disabled:cursor-not-allowed"
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