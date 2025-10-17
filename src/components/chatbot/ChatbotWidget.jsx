import React, { useState } from 'react';

const ChatbotWidget = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    // Llama a API de Grok o similar para respuesta
    const response = 'Respuesta de IA: Analizando imagen...'; // Placeholder
    setMessages([...messages, { user: input, bot: response }]);
    setInput('');
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg w-80">
      <div className="h-64 overflow-y-auto mb-2">
        {messages.map((msg, idx) => (
          <div key={idx}>
            <p className="text-right"><strong>Tú:</strong> {msg.user}</p>
            <p><strong>IA:</strong> {msg.bot}</p>
          </div>
        ))}
      </div>
      <div className="flex">
        <input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 px-2 py-1 border" />
        <Button onClick={handleSend}>Enviar</Button>
      </div>
    </div>
  );
};

export default ChatbotWidget;