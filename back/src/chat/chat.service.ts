import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI, FunctionDeclaration, Tool } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(private configService: ConfigService) {}

  async generateResponse(messages, modelName: string = 'gemini-3.1-flash-lite', clientApiKey?: string): Promise<{ text: string, isCustomComponent?: string | null }> {
    try {
      this.logger.log(`Sending messages to Gemini using model: ${modelName}`);

      const finalApiKey = clientApiKey || this.configService.get<string>('GEMINI_API_KEY') || '';
      if (!finalApiKey) {
        throw new Error('API Key no provista. Ingresa una API Key válida en el chat.');
      }
      const genAI = new GoogleGenerativeAI(finalApiKey);

      const systemPrompt = `
Eres la versión IA del asistente personal de Juan Carlos Castillo. Estás integrado en su portafolio web.
Tu objetivo es responder de forma amable, profesional pero cercana a las personas que visiten el portafolio.
Siempre habla en primera persona como su asistente, o asume el rol de Juan Carlos si te resulta más natural.

Información básica:
- Nombre: Juan Carlos Castillo
- Ubicación: Buenos Aires, Argentina
- Email: juancarlos_castillo@hotmail.com.ar

MUY IMPORTANTE - FUNCIONES DISPONIBLES (Tools):
Para responder con precisión, **debes usar las funciones proporcionadas** cuando te pregunten sobre:
1. Su experiencia laboral, trabajos anteriores o trayectoria -> UTILIZA LA FUNCIÓN "mostrar_experiencia".
2. Sus proyectos, portafolio, trabajos realizados o ejemplos -> UTILIZA LA FUNCIÓN "mostrar_proyectos".
3. Quién es él, su perfil, qué tecnologías maneja o "sobre mí" -> UTILIZA LA FUNCIÓN "mostrar_sobre_mi".
4. Descargar, obtener o ver su Curriculum Vitae (CV) -> UTILIZA LA FUNCIÓN "descargar_cv".

Reglas:
- No inventes información. Si te preguntan algo de lo anterior, llama a la función correspondiente, espera la respuesta y luego formula tu mensaje basándote en ella.
- Responde siempre en el idioma en que te hablen.
- Sé conciso y no des respuestas demasiado largas. Usa emojis 🚀💻.
`;

      const mostrarExperienciaDeclaration: FunctionDeclaration = {
        name: 'mostrar_experiencia',
        description: 'Llamar a esta función cuando el usuario pida ver la experiencia laboral de Juan Carlos.',
      };

      const mostrarProyectosDeclaration: FunctionDeclaration = {
        name: 'mostrar_proyectos',
        description: 'Llamar a esta función cuando el usuario pida ver los proyectos, el portafolio o los trabajos de Juan Carlos.',
      };

      const mostrarSobreMiDeclaration: FunctionDeclaration = {
        name: 'mostrar_sobre_mi',
        description: 'Llamar a esta función cuando el usuario pida saber más sobre Juan Carlos (sobre mí, quién es).',
      };

      const descargarCVDeclaration: FunctionDeclaration = {
        name: 'descargar_cv',
        description: 'Llamar a esta función cuando el usuario pida descargar el Curriculum Vitae (CV) o currículum.',
      };

      const tools: Tool[] = [{
        functionDeclarations: [
          mostrarExperienciaDeclaration,
          mostrarProyectosDeclaration,
          mostrarSobreMiDeclaration,
          descargarCVDeclaration
        ],
      }];

      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: systemPrompt,
        tools: tools,
      });

      const lastMessage = messages[messages.length - 1];

      // El SDK de Gemini requiere que el historial comience con el rol 'user'.
      // Filtramos los mensajes iniciales del modelo (como el saludo).
      let historyMessages = messages.slice(0, -1);
      while (historyMessages.length > 0 && historyMessages[0].role !== 'user') {
        historyMessages.shift();
      }

      const history = historyMessages.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }));

      const chat = model.startChat({
        history: history,
      });

      let result = await chat.sendMessage(lastMessage.content);
      let response = await result.response;

      let isCustomComponent: string | null = null;

      const functionCalls = response.functionCalls();
      if (functionCalls && functionCalls.length > 0) {
        const call = functionCalls[0];
        console.log('call.name: ', call.name);

        let functionResult = {};

        if (call.name === 'mostrar_proyectos') {
          isCustomComponent = 'proyectos';
          functionResult = { status: "success", message: "Carrusel de proyectos renderizado en pantalla exitosamente. Aclarar que son proyectos viejos ya obsoletos , en proceso o no terminados." };
        } else if (call.name === 'descargar_cv') {
          isCustomComponent = 'cv';
          functionResult = { status: "success", message: "Botón de descarga de CV mostrado exitosamente." };
        } else if (call.name === 'mostrar_experiencia') {
          functionResult = {
            experiencia: "1. Freelance Fullstack (06/2024 - presente)\n2. COTO (11/2022 - 11/2023) Armador de pedidos\n3. Siroppo (10/2022 - 12/2022) Cajero\n4. Tienda de Helados (10/2020 - 06/2021) Operario"
          };
        } else if (call.name === 'mostrar_sobre_mi') {
          functionResult = {
            sobre_mi: "Juan Carlos Castillo, Estudiante de Ing. en Electrónica y Desarrollador de Software en Buenos Aires, Argentina. Apasionado por la tecnología, enfocado en backend y frontend."
          };
        }

        // Devolvemos el resultado de la función a Gemini para que construya la respuesta natural
        result = await chat.sendMessage([{
          functionResponse: {
            name: call.name,
            response: functionResult
          }
        }]);

        response = await result.response;
      }

      const responseText = response.text();

      return { text: responseText, isCustomComponent };
    } catch (error) {
      this.logger.error(`Error communicating with Gemini: ${error.message}`);
      throw error;
    }
  }
}
