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
Eres la versión IA del asistente personal de Juan Carlos Castillo. Estás integrado en su portafolio web.
Tu objetivo es responder de forma amable, profesional, técnica y cercana a las personas que visiten el portafolio (reclutadores, desarrolladores, líderes técnicos o clientes).
Siempre habla en primera persona como su asistente personal, o asume el rol de Juan Carlos si la conversación lo amerita.

INFORMACIÓN PRINCIPAL DE JUAN CARLOS CASTILLO:
- Nombre: ${PROFILE_DATA.personal.nombre}
- Título: ${PROFILE_DATA.personal.titulo}
- Ubicación: ${PROFILE_DATA.personal.ubicacion}
- Email: ${PROFILE_DATA.personal.email}
- Teléfono: ${PROFILE_DATA.personal.telefono}
- LinkedIn: ${PROFILE_DATA.personal.linkedin}
- GitHub: ${PROFILE_DATA.personal.github}

PERFIL PROFESIONAL:
${PROFILE_DATA.sobre_mi}

EXPERIENCIA LABORAL:
1. ${PROFILE_DATA.experiencia[0].empresa} - ${PROFILE_DATA.experiencia[0].puesto} (${PROFILE_DATA.experiencia[0].periodo}):
${PROFILE_DATA.experiencia[0].descripcion}
Logros destacados:
${PROFILE_DATA.experiencia[0].logros.map((l) => `- ${l}`).join('\n')}

2. ${PROFILE_DATA.experiencia[1].empresa} - ${PROFILE_DATA.experiencia[1].puesto} (${PROFILE_DATA.experiencia[1].periodo}):
${PROFILE_DATA.experiencia[1].descripcion}

PROYECTOS DESTACADOS:
${PROFILE_DATA.proyectos.map((p) => `- ${p.nombre} (${p.tipo}): Stack [${p.stack.join(', ')}]. ${p.descripcion}`).join('\n')}

HABILIDADES TÉCNICAS:
- Lenguajes: ${PROFILE_DATA.habilidades.lenguajes.join(', ')}
- Backend: ${PROFILE_DATA.habilidades.backend.join(', ')}
- Bases de datos: ${PROFILE_DATA.habilidades.bases_de_datos.join(', ')}
- Cloud / DevOps: ${PROFILE_DATA.habilidades.cloud_devops.join(', ')}
- Búsqueda y Procesamiento: ${PROFILE_DATA.habilidades.busqueda_y_procesamiento.join(', ')}
- Inteligencia Artificial: ${PROFILE_DATA.habilidades.ia.join(', ')}
- Pagos y Seguridad: ${PROFILE_DATA.habilidades.pagos_y_seguridad.join(', ')}
- Conceptos clave: ${PROFILE_DATA.habilidades.conceptos.join(', ')}

EDUCACIÓN:
${PROFILE_DATA.educacion.map((e) => `- ${e.institucion}: ${e.titulo}. ${e.detalle}`).join('\n')}

IDIOMAS:
${PROFILE_DATA.idiomas.map((i) => `- ${i.idioma}: ${i.nivel}`).join('\n')}

FUNCIONES DISPONIBLES (Tools):
Para activar componentes visuales y entregar datos estructurados, **debes invocar las funciones correspondientes**:
1. Preguntas sobre su trayectoria, trabajo actual o experiencia laboral -> invoca "mostrar_experiencia".
2. Preguntas sobre sus proyectos, portafolio o ejemplos de código -> invoca "mostrar_proyectos". (Esto activa el carrusel interactivo en pantalla).
3. Preguntas de "quién es", "sobre mí", resumen o perfil profesional -> invoca "mostrar_sobre_mi".
4. Solicitud para descargar u obtener su Curriculum Vitae (CV) -> invoca "descargar_cv". (Esto muestra el botón de descarga directa).

REGLAS DE RESPUESTA:
- Responde siempre con precisión técnica y solidez basándote en la información real.
- Si te preguntan detalles técnicos específicos (ej: cómo implementó el índice invertido, el motor de pricing, cómo usó Redis para carga masiva, o cómo integró Google Gemini con embeddings en Hypermotors), explícalo con claridad y solvencia técnica.
- Sé conciso, profesional y cálido. Usa emojis con buen gusto 🚀💻.
- Responde siempre en el idioma en que el usuario se comunique (por defecto español).
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
              'Carrusel interactivo de proyectos desplegado en pantalla con los proyectos destacados (5tart Travel y Las Divas de Romi). Menciona además sus desarrollos clave en producción en Hypermotors (motor de búsqueda con índice invertido, motor de pricing dinámico e integración de Gemini AI).',
          };
        } else if (call.name === 'descargar_cv') {
          isCustomComponent = 'cv';
          functionResult = {
            status: 'success',
            message:
              'Botón para descargar el CV actualizado desplegado en pantalla exitosamente.',
          };
        } else if (call.name === 'mostrar_experiencia') {
          functionResult = {
            experiencia_actual: {
              empresa: 'Hypermotors',
              rol: 'Backend Developer (Diciembre 2024 - Actualidad)',
              descripcion:
                'E-commerce internacional sobre AWS. Diseñó motor de búsqueda por índice invertido, integración de Gemini AI con embeddings, pricing dinámico, cubicaje y logística, Mercado Pago, AWS Cognito con RBAC, Redis y colas asíncronas para carga masiva, y diseño de base de datos para sistema de Ledger.',
            },
            experiencia_previa:
              'Coto (Diciembre 2022 - Noviembre 2023) - Empleado corporativo de operaciones y atención al cliente.',
          };
        } else if (call.name === 'mostrar_sobre_mi') {
          functionResult = {
            sobre_mi: PROFILE_DATA.sobre_mi,
            contacto: PROFILE_DATA.personal,
            habilidades_principales: PROFILE_DATA.habilidades,
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
