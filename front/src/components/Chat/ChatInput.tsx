import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaEllipsisV } from 'react-icons/fa';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        <form onSubmit={handleSubmit} className="flex gap-2 items-end">
          {/* Botón de Menú Desplegable */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setShowOptions(!showOptions)}
              className="h-[58px] w-[58px] bg-gray-800 text-gray-400 border border-gray-700 rounded-2xl hover:text-yellow-500 hover:border-yellow-500 transition-colors shadow-lg flex items-center justify-center focus:outline-none"
            >
              <FaEllipsisV size={22} />
            </button>
            
            {showOptions && (
              <div className="absolute bottom-full left-0 mb-3 bg-gray-800 border border-gray-700 rounded-2xl p-2 shadow-2xl flex flex-col gap-1 w-48 z-50 animate-fade-in">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => {
                      onSendMessage(prompt);
                      setShowOptions(false);
                    }}
                    disabled={isLoading}
                    className="w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-yellow-500 rounded-xl text-sm transition-colors disabled:opacity-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Campo de Texto */}
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              placeholder="Escribe un mensaje..."
              className="w-full bg-gray-800 text-gray-100 border border-gray-700 rounded-2xl py-4 pl-6 pr-14 focus:outline-none focus:border-yellow-500 transition-colors shadow-lg disabled:opacity-50 h-[58px]"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-500 disabled:opacity-50 disabled:hover:text-gray-400 transition-colors focus:outline-none"
            >
              <FaPaperPlane size={20} />
            </button>
          </div>
        </form>
        <p className="text-center text-xs text-gray-500 mt-3">
          IA impulsada por Gemini. Puede cometer errores.
        </p>
      </div>
    </div>
  );
};
