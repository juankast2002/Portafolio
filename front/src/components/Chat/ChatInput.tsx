import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const quickPrompts = [
    'Experiencia',
    'Proyectos',
    'Sobre mí',
    'Descargar CV'
  ];

  return (
    <div className="w-full bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 p-3 md:p-4 pb-4 md:pb-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => onSendMessage(prompt)}
              disabled={isLoading}
              className="whitespace-nowrap px-4 py-2 bg-gray-800 text-gray-300 border border-gray-700 rounded-full text-sm hover:bg-azulM hover:text-white transition-colors duration-200 disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Escribe un mensaje..."
            className="w-full bg-gray-800 text-gray-100 border border-gray-700 rounded-2xl py-4 pl-6 pr-12 focus:outline-none focus:border-yellow-500 transition-colors shadow-lg disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-4 text-gray-400 hover:text-yellow-500 disabled:opacity-50 disabled:hover:text-gray-400 transition-colors"
          >
            <FaPaperPlane size={20} />
          </button>
        </form>
        <p className="text-center text-xs text-gray-500 mt-3">
          IA impulsada por Gemini. Puede cometer errores.
        </p>
      </div>
    </div>
  );
};
