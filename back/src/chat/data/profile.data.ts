export const PROFILE_DATA = {
  personal: {
    nombre: 'Juan Carlos Castillo',
    titulo:
      'Backend Developer | TypeScript · Node.js · NestJS · PostgreSQL · AWS',
    ubicacion: 'Moreno, Buenos Aires, Argentina',
    email: 'juancarlos_castillo@hotmail.com.ar',
    telefono: '+54 9 11 3265-5034',
    linkedin: 'https://linkedin.com/in/juan-carlos-castillo-985ab02b0',
    github: 'https://github.com/juankast2002',
  },

  sobre_mi: `Backend Developer con experiencia profesional diseñando y construyendo sistemas de producción con TypeScript, Node.js, NestJS, PostgreSQL y Prisma sobre infraestructura AWS, dentro de una plataforma internacional de e-commerce que opera en múltiples mercados y marketplaces.
Experiencia end-to-end en integración de pasarelas de pago (Mercado Pago), autenticación federada (AWS Cognito), procesamiento asíncrono con colas y Redis, comunicación en tiempo real vía WebSockets, y motores propios de cálculo de precios y logística.
Historial comprobado diseñando desde cero soluciones de alto impacto, incluyendo un motor de búsqueda basado en índice invertido y una integración de Inteligencia Artificial con Google Gemini para interpretación de datos y automatización de procesos de negocio.
Orientado a la resolución de problemas complejos, la eficiencia de sistemas y el trabajo colaborativo en equipos ágiles de Backend y Frontend.`,

  experiencia: [
    {
      empresa: 'Hypermotors',
      puesto: 'Backend Developer',
      periodo: 'Diciembre 2024 - Actualidad',
      descripcion:
        'Plataforma internacional de e-commerce/marketplace de repuestos de motos, lanchas y otros productos, operando sobre múltiples mercados y canales de venta. Equipo de 4 desarrolladores (2 Backend, 2 Frontend) sobre infraestructura AWS.',
      logros: [
        'Diseñó y desarrolló desde cero un motor de búsqueda propio basado en índice invertido, tokenizando y normalizando atributos de productos para reemplazar búsquedas costosas por consultas de alta velocidad.',
        'Lideró la integración de Google Gemini (IA) en la plataforma, implementando embeddings de atributos de productos y flujos donde el modelo interpreta consultas, ejecuta búsquedas y determina acciones a realizar sobre servicios externos.',
        'Construyó un motor de pricing dinámico que calcula precios considerando país, impuestos y reglas de negocio, recalculando automáticamente publicaciones activas y simulaciones ante cambios impositivos.',
        'Desarrolló el sistema de carrito de compras y cálculo logístico (cubicaje, peso y tarifarios por país), integrado directamente en el flujo de compra.',
        'Integró Mercado Pago como pasarela de pagos y autenticación federada (Google, Apple) mediante AWS Cognito, implementando autorización basada en roles (RBAC) y Guards.',
        'Desarrolló integraciones con APIs externas y Webhooks, procesando eventos en tiempo real vía WebSockets y utilizando Redis y sistemas de colas para procesamiento asíncrono.',
        'Implementó Redis en el proceso de carga masiva de publicaciones, separando responsabilidades entre las distintas estructuras de datos y ejecutando el procesamiento en segundo plano sin bloquear el flujo principal.',
        'Diseñó nuevas estructuras de base de datos para un sistema de Ledger, sentando la base para futuros procesos de liquidación de vendedores y administradores.',
        'Operó y monitoreó servicios sobre AWS (CloudWatch, Cognito, S3) dando soporte a operaciones de venta internacionales.',
      ],
    },
    {
      empresa: 'Coto',
      puesto: 'Empleado de operaciones y atención',
      periodo: 'Diciembre 2022 - Noviembre 2023',
      descripcion:
        'Primera experiencia laboral formal en un entorno corporativo de gran escala, desarrollando disciplina operativa, trabajo bajo procedimientos establecidos y atención al cliente, sentando las bases para la posterior transición al desarrollo de software.',
      logros: [],
    },
  ],

  proyectos: [
    {
      nombre: 'Marketplace de Turismo (5tart Travel)',
      tipo: 'Proyecto Final en Soy Henry (Destacado de la cursada, equipo de 5 personas)',
      stack: [
        'TypeScript',
        'NestJS',
        'PostgreSQL',
        'TypeORM',
        'WebSockets',
        'Swagger',
        'Mercado Pago',
      ],
      descripcion:
        'Backend completo para marketplace de agencias de viajes y hospedajes. Modelo de datos relacional con TypeORM, pasarela Mercado Pago, chat privado en tiempo real entre compradores y vendedores vía WebSockets, Guards y Swagger.',
    },
    {
      nombre: 'Sistema de Gestión Gastronómica (Las Divas de Romi)',
      tipo: 'Proyecto personal en producción',
      stack: ['TypeScript', 'Next.js', 'Node.js', 'PostgreSQL'],
      descripcion:
        'Sistema completo de ventas y gestión para local comercial y gastronómico, con catálogo online, carrito con cálculo automático de totales, registro de métodos de pago y generación de etiquetas de comandas/impresión por pedido.',
    },
    {
      nombre: 'Asistente Conversacional con IA (Portafolio Web)',
      tipo: 'Proyecto personal interactivo',
      stack: [
        'TypeScript',
        'NestJS',
        'Next.js',
        'Google Gemini AI',
        'TailwindCSS',
      ],
      descripcion:
        'Chatbot conversacional inteligente integrado en el portafolio con arquitectura desacoplada, utilizando Gemini con Function Calling (Tools) para disparar componentes dinámicos e interactivos en el frontend.',
    },
  ],

  habilidades: {
    lenguajes: ['TypeScript', 'JavaScript', 'SQL'],
    backend: ['Node.js', 'NestJS', 'APIs REST', 'WebSockets', 'Webhooks'],
    bases_de_datos: ['PostgreSQL', 'Prisma', 'TypeORM'],
    cloud_devops: ['AWS (Cognito, S3, CloudWatch)', 'Git', 'GitHub'],
    busqueda_y_procesamiento: [
      'Índice Invertido',
      'Elasticsearch',
      'Redis',
      'Sistemas de Colas / Background Jobs',
    ],
    ia: [
      'Google Gemini',
      'Embeddings',
      'Function Calling',
      'Modelos Generativos',
    ],
    pagos_y_seguridad: [
      'Mercado Pago',
      'AWS Cognito',
      'RBAC (Role Based Access Control)',
      'JWT',
      'Guards',
    ],
    conceptos: [
      'Arquitectura de Backend',
      'Integración de APIs y Webhooks',
      'Procesamiento Asíncrono',
      'Tiempo Real (WebSockets)',
      'Sistemas de Pricing & E-commerce',
      'Optimización de Búsqueda',
    ],
  },

  educacion: [
    {
      institucion: 'Soy Henry',
      titulo: 'Desarrollo Full Stack (Egresado)',
      detalle:
        'Formación intensiva en desarrollo de software Full Stack; proyecto final reconocido entre los destacados de la cursada.',
    },
  ],

  idiomas: [
    { idioma: 'Español', nivel: 'Nativo' },
    { idioma: 'Inglés', nivel: 'Básico (técnico)' },
  ],
};
