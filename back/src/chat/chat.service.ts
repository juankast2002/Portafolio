import { Injectable, Logger } from '@nestjs/common';
import {
  GoogleGenerativeAI,
  FunctionDeclaration,
  Tool,
} from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { PROFILE_DATA } from './data/profile.data';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(private configService: ConfigService) {}

  async generateResponse(
    messages,
    modelName: string = 'gemini-3.1-flash-lite',
    clientApiKey?: string,
  ): Promise<{ text: string; isCustomComponent?: string | null }> {
    try {
      this.logger.log(`Sending messages to Gemini using model: ${modelName}`);

      const finalApiKey =
        clientApiKey || this.configService.get<string>('GEMINI_API_KEY') || '';
      if (!finalApiKey) {
        throw new Error(
          'API Key no provista. Ingresa una API Key válida en el chat.',
        );
      }
      const genAI = new GoogleGenerativeAI(finalApiKey);

      const systemPrompt = `
Eres la versión IA del asistente personal de Juan Carlos Castillo en su portafolio web.
Tu personalidad es:
- Cálida, educada, humilde y profesional.
- Conversacional y natural: habla como una persona real en una charla distendida, no como un folleto publicitario ni un bot rígido.
- Puedes responder como su asistente ("Juan Carlos es...") o asumir su rol en primera persona si el usuario te habla directamente ("¡Hola! Soy Juan Carlos...").

INFORMACIÓN DE REFERENCIA (Úsala solo cuando sea relevante para responder puntualmente):
- Nombre: ${PROFILE_DATA.personal.nombre}
- Título: ${PROFILE_DATA.personal.titulo}
- Ubicación: ${PROFILE_DATA.personal.ubicacion}
- Email: ${PROFILE_DATA.personal.email}
- LinkedIn: ${PROFILE_DATA.personal.linkedin}
- GitHub: ${PROFILE_DATA.personal.github}

Resumen profesional:
${PROFILE_DATA.sobre_mi}

Experiencia laboral:
- Hypermotors (12/2024 - Presente): Backend Developer (E-commerce internacional sobre AWS. Motor de búsqueda con índice invertido, pricing dinámico, integración de Gemini con embeddings, Redis, colas, Ledger contable).
- Coto (12/2022 - 11/2023): Empleado corporativo (disciplina operativa y atención).

Proyectos destacados:
- Marketplace de Turismo (5tart Travel): NestJS, PostgreSQL, TypeORM, WebSockets, Mercado Pago.
- Sistema de Gestión Gastronómica (Las Divas de Romi): Catálogo online, carrito de compras, impresión de comandas.
- Asistente Conversacional: NestJS, Google Gemini con Tools y Frontend Next.js.

Stack principal:
TypeScript, Node.js, NestJS, PostgreSQL, Prisma, AWS (Cognito, S3, CloudWatch), Redis, WebSockets, Google Gemini AI.

FUNCIONES DISPONIBLES (Tools):
Para activar componentes visuales o entregar datos precisos, invoca las siguientes herramientas:
1. Preguntas sobre su trayectoria o trabajo actual -> invoca "mostrar_experiencia".
2. Preguntas sobre sus proyectos o si pide verlos -> invoca "mostrar_proyectos" (despliega el carrusel en pantalla).
3. Preguntas de quién es, sobre mí o presentación general -> invoca "mostrar_sobre_mi".
4. Solicitud para descargar u obtener su CV -> invoca "descargar_cv" (despliega el botón de descarga).

REGLAS DE ORO PARA LA CONVERSACIÓN:
1. RESPONDE PUNTUALMENTE A LO QUE TE PREGUNTAN (CERO "INFO-DUMPING"):
   - No vuelques todo el CV ni agregues categorías que nadie pidió.
   - Si te preguntan "¿Qué tecnologías manejas?", menciona de forma concisa y amena su stack principal (TypeScript, Node.js, NestJS, PostgreSQL, AWS y Redis) y ofrece con amabilidad profundizar si le interesa algún área en particular.
   - Si saludan ("Hola", "Buenas"), saluda con calidez y educación, presentándote brevemente y preguntando en qué puedes ayudar. Nunca sueltes todo el perfil en un saludo.
   - Si preguntan sobre su experiencia, resume de forma clara su rol actual en Hypermotors sin abrumar con tecnicismos innecesarios a menos que te pregunten cómo implementó algo en específico.

2. TONO Y FORMATO:
   - Sé siempre educado, cercano, humilde y agradecido por el interés en el perfil de Juan Carlos.
   - Respuestas breves y ágiles (generalmente 2 o 3 párrafos cortos o unas pocas viñetas bien elegidas).
   - Usa Markdown limpio: negritas para destacar lo más relevante y viñetas (*) solo si ayuda a ordenar la lectura.
   - Cierra con una frase o pregunta amable que invite a continuar la charla de manera natural.
`;

      const mostrarExperienciaDeclaration: FunctionDeclaration = {
        name: 'mostrar_experiencia',
        description:
          'Llamar a esta función cuando el usuario pida ver la experiencia laboral de Juan Carlos.',
      };

      const mostrarProyectosDeclaration: FunctionDeclaration = {
        name: 'mostrar_proyectos',
        description:
          'Llamar a esta función cuando el usuario pida ver los proyectos, el portafolio o los trabajos de Juan Carlos.',
      };

      const mostrarSobreMiDeclaration: FunctionDeclaration = {
        name: 'mostrar_sobre_mi',
        description:
          'Llamar a esta función cuando el usuario pida saber más sobre Juan Carlos (sobre mí, quién es).',
      };

      const descargarCVDeclaration: FunctionDeclaration = {
        name: 'descargar_cv',
        description:
          'Llamar a esta función cuando el usuario pida descargar el Curriculum Vitae (CV) o currículum.',
      };

      const tools: Tool[] = [
        {
          functionDeclarations: [
            mostrarExperienciaDeclaration,
            mostrarProyectosDeclaration,
            mostrarSobreMiDeclaration,
            descargarCVDeclaration,
          ],
        },
      ];

      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: systemPrompt,
        tools: tools,
      });

      const lastMessage = messages[messages.length - 1];

      // El SDK de Gemini requiere que el historial comience con el rol 'user'.
      // Filtramos los mensajes iniciales del modelo (como el saludo).
      const historyMessages = messages.slice(0, -1);
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
          functionResult = {
            status: 'success',
            message:
              'Carrusel de proyectos renderizado en pantalla (5tart Travel y Las Divas de Romi). Invita al usuario a consultarte sobre cualquiera de ellos o sobre sus soluciones backend en Hypermotors.',
          };
        } else if (call.name === 'descargar_cv') {
          isCustomComponent = 'cv';
          functionResult = {
            status: 'success',
            message:
              'Botón de descarga de CV mostrado en pantalla exitosamente. Invita amablemente al usuario a descargarlo.',
          };
        } else if (call.name === 'mostrar_experiencia') {
          functionResult = {
            actual:
              'Backend Developer en Hypermotors (Diciembre 2024 - Actualidad): Desarrolla soluciones de alta concurrencia en AWS con NestJS, TypeScript, PostgreSQL y Redis. Entre sus hitos destacan un motor de búsqueda propio con índice invertido, motor de pricing dinámico e integración de Gemini AI.',
            anterior:
              'Experiencia previa en Coto (Diciembre 2022 - Noviembre 2023) en operaciones y atención al cliente.',
          };
        } else if (call.name === 'mostrar_sobre_mi') {
          functionResult = {
            resumen:
              'Juan Carlos Castillo es Desarrollador Backend radicado en Buenos Aires, especializado en el ecosistema TypeScript / Node.js con NestJS, PostgreSQL y AWS. Trabaja actualmente en Hypermotors enfocado en optimización de sistemas, procesamiento asíncrono y arquitectura escalable.',
            contacto: {
              email: PROFILE_DATA.personal.email,
              linkedin: PROFILE_DATA.personal.linkedin,
              github: PROFILE_DATA.personal.github,
            },
          };
        }

        // Devolvemos el resultado de la función a Gemini para que construya la respuesta natural
        result = await chat.sendMessage([
          {
            functionResponse: {
              name: call.name,
              response: functionResult,
            },
          },
        ]);

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
