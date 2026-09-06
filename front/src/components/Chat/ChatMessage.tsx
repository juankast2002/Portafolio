import React from 'react';
import { FaRobot, FaUser } from 'react-icons/fa';
import { Carrusel } from '@/components/Carrusel/Carrusel';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
  // Normalizar los saltos de línea (tanto reales como literales \n)
  const normalizedContent = (message.content || '').replace(/\\n/g, '\n');

  return (
    <div className="py-3 md:py-4 relative z-10 hover:bg-white/[0.02] transition-colors duration-200">
      <div className="max-w-4xl mx-auto flex gap-3 md:gap-5 px-4 md:px-6">
        {/* Avatar */}
        <div className="flex-shrink-0 mt-1">
          {isBot ? (
            <div className="w-8 h-8 rounded-full bg-azulM flex items-center justify-center text-white border border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]">
              <FaRobot size={17} />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 border border-gray-600">
              <FaUser size={15} />
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          {isBot ? (
            <div className="text-gray-200 leading-relaxed space-y-2">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-xl font-bold text-yellow-400 mt-4 mb-2">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-lg font-bold text-yellow-400 mt-3 mb-2">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-base sm:text-lg font-semibold text-yellow-400 mt-3 mb-1.5 flex items-center gap-2 border-b border-gray-700/60 pb-1">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-2.5 leading-relaxed text-gray-200 last:mb-0">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside space-y-1 my-2 pl-1 text-gray-200">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside space-y-1 my-2 pl-1 text-gray-200">{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-gray-200 leading-relaxed">{children}</li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-white">{children}</strong>
                  ),
                  code: ({ children }) => (
                    <code className="bg-gray-800 text-yellow-400 px-1.5 py-0.5 rounded text-xs sm:text-sm font-mono border border-gray-700">
                      {children}
                    </code>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-yellow-400 underline hover:text-yellow-300 transition-colors"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {normalizedContent}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">
              {normalizedContent}
            </p>
          )}

          {/* Renderizado de componentes personalizados si es necesario */}
          {message.isCustomComponent === 'proyectos' && (
            <div className="mt-6">
              <Carrusel />
            </div>
          )}

          {message.isCustomComponent === 'cv' && (
            <div className="mt-6">
              <Link href="/Castillo-Juan-Carlos-CV-actual-05_09_2026.docx" download="Castillo-Juan-Carlos-CV.docx">
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
