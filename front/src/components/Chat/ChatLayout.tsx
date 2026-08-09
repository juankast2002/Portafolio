'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, MessageType } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { CoverParticles } from '@/components/CoverParticles/cover-particles';
import { Fjalla_One } from 'next/font/google';

const FjallaOne = Fjalla_One({ subsets: ['latin'], weight: '400' });

export const ChatLayout: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: '1',
      role: 'model',
      content: '¡Hola! Soy la IA asistente de Juan Carlos Castillo 👋. \\n\\nEstoy aquí para ayudarte a conocer más sobre su perfil, experiencia y proyectos. ¿En qué te puedo ayudar hoy? Puedes usar los botones rápidos o preguntarme lo que quieras.',
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Crear mensaje del usuario
    const userMessage: MessageType = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Verificar si es un comando especial (proyectos o CV) para agregar el componente visual
      // El backend ahora devuelve isCustomComponent a través de function calling de Gemini
      // así que no necesitamos calcularlo aquí.

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3002';

      // Enviar historial de mensajes al backend de NestJS (Gemini)
      const newMessages = [...messages, userMessage];
      const response = await fetch(`${backendUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages.map(msg => ({ role: msg.role, content: msg.content }))
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      // Si el backend devolvió un error
      if (data.error || !data.message) {
        throw new Error(data.error || 'No message received from backend');
      }

      // Agregar respuesta del bot
      const botMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: data.message,
        isCustomComponent: data.isCustomComponent || null,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Mensaje de error amigable
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'model',
          content: 'Ups, parece que tuve un problema conectándome a mi cerebro (Gemini). Por favor, intenta de nuevo en unos momentos o contáctame directamente al correo.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col h-screen w-full bg-gray-900 overflow-hidden">
      {/* Fondo de Partículas Original */}
      <div className="absolute inset-0 z-0">
        <CoverParticles />
      </div>

      {/* Header flotante */}
      <header className="absolute top-0 left-0 w-full z-20 flex justify-between items-center p-6 bg-gradient-to-b from-gray-900 to-transparent pointer-events-none">
        <h1 className={`${FjallaOne.className} text-white text-3xl md:text-5xl drop-shadow-xl`}>
          CASTILLO <span className="text-yellow-500">JUAN CARLOS</span>
        </h1>
      </header>

      {/* Contenedor principal del chat */}
      <main className="relative z-10 flex-1 flex flex-col pt-20 md:pt-24 overflow-y-auto">
        <div className="flex-1 w-full pb-4">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isLoading && (
            <div className="py-6 relative z-10">
              <div className="max-w-4xl mx-auto flex gap-6 px-4">
                <div className="w-8 h-8 rounded-full bg-azulM flex items-center justify-center text-white border border-yellow-500 animate-pulse" />
                <div className="flex-1 min-w-0">
                  <div className="flex space-x-2 items-center h-8">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input */}
      <div className="relative z-20">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};
