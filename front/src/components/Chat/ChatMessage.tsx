import React from 'react';
import { FaRobot, FaUser } from 'react-icons/fa';
import { Carrusel } from '@/components/Carrusel/Carrusel';
import Link from 'next/link';

export type MessageType = {
  id: string;
  role: 'user' | 'model';
  content: string;
  isCustomComponent?: 'proyectos' | 'cv' | null;
};

interface ChatMessageProps {
  message: MessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.role === 'model';

  return (
    <div className="py-4 md:py-6 relative z-10 hover:bg-white/[0.02] transition-colors duration-300">
      <div className="max-w-4xl mx-auto flex gap-3 md:gap-6 px-4 md:px-6">
        {/* Avatar */}
        <div className="flex-shrink-0 mt-1">
          {isBot ? (
            <div className="w-8 h-8 rounded-full bg-azulM flex items-center justify-center text-white border border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]">
              <FaRobot size={18} />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-gray-200">
              <FaUser size={16} />
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          <div className="prose prose-invert max-w-none text-gray-200 leading-relaxed">
            {(message.content || '').split('\\n').map((line, i) => (
              <p key={i} className="mb-4 last:mb-0">
                {line}
              </p>
            ))}
          </div>

          {/* Renderizado de componentes personalizados si es necesario */}
          {message.isCustomComponent === 'proyectos' && (
            <div className="mt-6">
              <Carrusel />
            </div>
          )}

          {message.isCustomComponent === 'cv' && (
            <div className="mt-6">
              <Link href="././cv_22052024 (4).pdf" download>
                <div className="inline-flex items-center text-gray-900 px-6 py-3 bg-yellow-500 border-2 border-yellow-500 rounded-xl transition duration-200 transform hover:scale-105 shadow-xl font-bold">
                  Descargar CV
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
