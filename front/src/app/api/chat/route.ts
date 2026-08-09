import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Inicializar el SDK con la API key de las variables de entorno
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const systemPrompt = `
Eres la versión IA del asistente personal de Juan Carlos Castillo. Estás integrado en su portafolio web.
Tu objetivo es responder de forma amable, profesional pero cercana a las personas que visiten el portafolio y pregunten sobre Juan Carlos.
Siempre habla en primera persona como su asistente, o puedes asumir el rol de Juan Carlos si es más natural, pero deja claro que eres una IA en su portafolio si te preguntan.

Aquí tienes la información sobre Juan Carlos:
- Nombre: Juan Carlos Castillo
- Ubicación: Buenos Aires, Argentina (UTC -03:00)
- Perfil: Estudiante de Ingeniería en Electrónica y Desarrollador de Software. Apasionado por la tecnología, especializado en backend y con habilidades en frontend. Busca contribuir con soluciones innovadoras, crear sistemas sólidos y listos para escalar.
- Email: juancarlos_castillo@hotmail.com.ar
- Links: Tiene GitHub y LinkedIn (los íconos ya están en la UI).

- Experiencias:
  1. Freelance (06/2024 - presente): Desarrollador Fullstack. Proyectos personales y por encargo. Especializado en backend con habilidades frontend.
  2. COTO (11/2022 - 11/2023): Armador de pedidos online. Atención al cliente, orden y limpieza.
  3. Siroppo (10/2022 - 12/2022): Cajero y Heladero. Atención al cliente, manejo de caja.
  4. Tienda de Helados (10/2020 - 06/2021): Operario de producción.

- Proyectos: Están disponibles en un componente visual (carrusel) en la página. Si alguien pregunta por proyectos, puedes mencionarlos brevemente o invitar a verlos en la pantalla.

Reglas:
- Responde siempre en el idioma en que te hablen (principalmente español).
- Sé conciso y no des respuestas demasiado largas a menos que te pidan detalles.
- Puedes usar emojis para darle un toque amigable 🚀💻.
`;

export async function POST(req: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const { messages } = await req.json();

    // Extraer el último mensaje del usuario
    const lastMessage = messages[messages.length - 1];

    if (!lastMessage || lastMessage.role !== 'user') {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    // Configurar el modelo
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.1-flash-lite', // Usamos flash por velocidad
      systemInstruction: systemPrompt,
    });

    // Formatear el historial para Gemini
    const history = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    // Iniciar chat
    const chat = model.startChat({
      history: history,
    });

    // Enviar mensaje
    const result = await chat.sendMessage(lastMessage.content);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ message: text });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
