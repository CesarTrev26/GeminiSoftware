const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableCell, TableRow, WidthType, BorderStyle, AlignmentType, HeadingLevel, convertInchesToTwip } = require('docx');

// Colores de marca Gemini
const COLORS = {
  cyan: '00D3FF',
  blue: '003799',
  darkBlue: '01183D',
  gray: '666666',
  lightGray: 'F8F9FA',
  white: 'FFFFFF'
};

// Función para crear el encabezado del documento
function createHeader() {
  return [
    new Paragraph({
      text: 'GEMINI SOFTWARE',
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      style: 'title'
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'Cuestionario de Cotización Web',
          bold: true,
          size: 32,
          color: COLORS.blue
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 50 }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'contacto@geminisoftware.mx | www.geminisoftware.mx',
          size: 20,
          color: COLORS.gray
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      border: {
        bottom: {
          color: COLORS.cyan,
          space: 1,
          style: BorderStyle.SINGLE,
          size: 20
        }
      }
    })
  ];
}

// Función para crear encabezado de sección
function createSectionHeader(number, title) {
  return new Paragraph({
    children: [
      new TextRun({
        text: `${number}. ${title}`,
        bold: true,
        size: 28,
        color: COLORS.white
      })
    ],
    shading: {
      type: 'clear',
      color: COLORS.blue,
      fill: COLORS.blue
    },
    spacing: { before: 300, after: 200 },
    indent: { left: 200 }
  });
}

// Función para crear pregunta
function createQuestion(number, text, hint) {
  const paragraphs = [
    new Paragraph({
      children: [
        new TextRun({
          text: `${number}. ${text}`,
          bold: true,
          size: 24,
          color: COLORS.blue
        })
      ],
      spacing: { before: 200, after: 100 },
      indent: { left: 200 }
    })
  ];

  if (hint) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: hint,
            italics: true,
            size: 20,
            color: COLORS.gray
          })
        ],
        spacing: { after: 100 },
        indent: { left: 200 }
      })
    );
  }

  return paragraphs;
}

// Función para crear línea de respuesta
function createAnswerLine() {
  return new Paragraph({
    text: '_'.repeat(80),
    spacing: { after: 200 },
    indent: { left: 200 }
  });
}

// Función para crear caja de respuesta
function createAnswerBox() {
  return new Paragraph({
    text: '\n\n\n',
    spacing: { after: 200 },
    indent: { left: 200 },
    border: {
      top: { color: COLORS.cyan, space: 1, style: BorderStyle.SINGLE, size: 6 },
      bottom: { color: COLORS.cyan, space: 1, style: BorderStyle.SINGLE, size: 6 },
      left: { color: COLORS.cyan, space: 1, style: BorderStyle.SINGLE, size: 6 },
      right: { color: COLORS.cyan, space: 1, style: BorderStyle.SINGLE, size: 6 }
    }
  });
}

// Función para crear opciones
function createOptions(options) {
  return options.map(option => 
    new Paragraph({
      children: [
        new TextRun({ text: '☐  ', size: 24 }),
        new TextRun({ text: option, size: 22 })
      ],
      spacing: { after: 100 },
      indent: { left: 400 }
    })
  );
}

// Crear documento
const doc = new Document({
  sections: [{
    properties: {
      page: {
        margin: {
          top: convertInchesToTwip(0.8),
          right: convertInchesToTwip(0.8),
          bottom: convertInchesToTwip(0.8),
          left: convertInchesToTwip(0.8)
        }
      }
    },
    children: [
      ...createHeader(),

      // SECCIÓN 1: INFORMACIÓN GENERAL
      createSectionHeader('1', 'Información General'),
      ...createQuestion('1', 'Nombre de tu marca o empresa:', '(respuesta corta)'),
      createAnswerLine(),
      ...createQuestion('2', '¿A qué se dedica tu negocio?', '(respuesta larga / descripción breve)'),
      createAnswerBox(),
      ...createQuestion('3', '¿Cuál es el objetivo principal de tu sitio web?', '(elige una opción)'),
      ...createOptions([
        'Dar presencia a mi marca',
        'Vender productos en línea',
        'Conseguir más clientes / contactos',
        'Mostrar servicios o portafolio',
        'Otro: ___________________________'
      ]),

      // SECCIÓN 2: PLATAFORMA
      createSectionHeader('2', 'Plataforma'),
      ...createQuestion('4', '¿En qué plataforma te gustaría tu sitio web?', '(no pasa nada si no estás seguro)'),
      ...createOptions([
        'Shopify',
        'WordPress',
        'No lo sé, quiero que me recomienden'
      ]),
      ...createQuestion('5', '¿Por qué? (opcional)', '(respuesta corta)'),
      createAnswerLine(),

      // SECCIÓN 3: DISEÑO Y MARCA
      createSectionHeader('3', 'Diseño y Marca'),
      ...createQuestion('6', '¿Ya cuentas con un diseño del sitio?', null),
      ...createOptions([
        'Sí, ya tengo el diseño (Figma / imágenes / mockups)',
        'Tengo una idea, pero no diseño final',
        'No, necesito que lo diseñen desde cero'
      ]),
      ...createQuestion('7', '¿Cuentas con identidad visual?', '(puedes marcar varias)'),
      ...createOptions([
        'Logo',
        'Colores de marca',
        'Tipografías',
        'Manual de marca',
        'Aún no tengo nada'
      ]),
      ...createQuestion('8', 'Comparte sitios web que te gusten o te inspiren', '(links, opcional)'),
      createAnswerBox(),

      // SECCIÓN 4: CONTENIDO Y PÁGINAS
      createSectionHeader('4', 'Contenido y Páginas'),
      ...createQuestion('9', 'Aproximadamente, ¿cuántas secciones o páginas tendrá tu sitio?', null),
      ...createOptions([
        '1 – 5',
        '6 – 10',
        '11 – 20',
        'Más de 20'
      ]),
      ...createQuestion('10', '¿Qué páginas te gustaría incluir?', '(marca las que apliquen)'),
      ...createOptions([
        'Inicio',
        'Nosotros',
        'Servicios',
        'Productos',
        'Blog',
        'Contacto',
        'Preguntas frecuentes',
        'Políticas / legales',
        'Otras: _________________________________________________'
      ]),

      // SECCIÓN 5: FUNCIONES DEL SITIO
      createSectionHeader('5', 'Funciones del Sitio'),
      ...createQuestion('11', '¿Qué funciones te gustaría que tenga tu página?', '(elige solo las que realmente usarías)'),
      ...createOptions([
        'Formulario de contacto',
        'Botón de WhatsApp',
        'Blog administrable',
        'Animaciones o efectos visuales',
        'Optimización para Google (SEO básico)',
        'Integración con redes sociales',
        'Estadísticas (Google Analytics / Pixel)',
        'Multi-idioma',
        'Otro: _________________________________________________'
      ]),

      // SECCIÓN 6: TIENDA EN LÍNEA
      createSectionHeader('6', 'Tienda en Línea (solo si aplica)'),
      ...createQuestion('12', '¿Venderás productos en tu sitio?', null),
      ...createOptions(['Sí', 'No']),
      ...createQuestion('13', '¿Cuántos productos aproximadamente?', null),
      ...createOptions([
        '1 – 10',
        '11 – 50',
        '51 – 200',
        'Más de 200'
      ]),
      ...createQuestion('14', 'Funciones de tienda que te interesan:', null),
      ...createOptions([
        'Pagos con tarjeta',
        'Pagos en efectivo / transferencia',
        'Envíos automáticos',
        'Códigos de descuento',
        'Sistema de recompensas o puntos',
        'Cuentas de usuario',
        'Suscripciones',
        'Wishlist'
      ]),

      // SECCIÓN 7: CONTENIDO
      createSectionHeader('7', 'Contenido'),
      ...createQuestion('15', '¿Quién proporcionará los textos e imágenes?', null),
      ...createOptions([
        'Yo como cliente',
        'Necesito apoyo en redacción',
        'Quiero que Gemini se encargue de todo'
      ]),

      // SECCIÓN 8: ENTREGA Y SOPORTE
      createSectionHeader('8', 'Entrega y Soporte'),
      ...createQuestion('16', '¿Te gustaría recibir capacitación para administrar tu sitio?', null),
      ...createOptions(['Sí', 'No']),
      ...createQuestion('17', '¿Te interesa soporte después de publicar el sitio?', null),
      ...createOptions([
        '7 días',
        '30 días',
        'Mantenimiento mensual'
      ]),

      // SECCIÓN 9: TIEMPOS Y PRESUPUESTO
      createSectionHeader('9', 'Tiempos y Presupuesto'),
      ...createQuestion('18', '¿Cuándo te gustaría lanzar tu sitio?', '(fecha aproximada)'),
      createAnswerLine(),
      ...createQuestion('19', 'Presupuesto estimado para tu proyecto', '(esto nos ayuda a proponerte la mejor solución)'),
      ...createOptions([
        '$15,000 – $30,000 MXN',
        '$30,000 – $50,000 MXN',
        '$50,000 – $80,000 MXN',
        '$80,000+ MXN'
      ]),

      // SECCIÓN 10: MENSAJE FINAL
      createSectionHeader('10', 'Mensaje Final'),
      ...createQuestion('20', '¿Hay algo más que te gustaría contarnos sobre tu proyecto?', '(respuesta abierta)'),
      createAnswerBox(),

      // MENSAJE DE AGRADECIMIENTO
      new Paragraph({
        text: '\n',
        spacing: { before: 400 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: '¡Gracias por tu interés en trabajar con nosotros!',
            bold: true,
            size: 28,
            color: COLORS.blue
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
        shading: {
          type: 'clear',
          color: 'E8F4F8',
          fill: 'E8F4F8'
        },
        border: {
          top: { color: COLORS.cyan, space: 1, style: BorderStyle.SINGLE, size: 12 },
          bottom: { color: COLORS.cyan, space: 1, style: BorderStyle.SINGLE, size: 12 },
          left: { color: COLORS.cyan, space: 1, style: BorderStyle.SINGLE, size: 12 },
          right: { color: COLORS.cyan, space: 1, style: BorderStyle.SINGLE, size: 12 }
        }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: 'Revisaremos tu información y nos pondremos en contacto contigo a la brevedad con una propuesta personalizada.',
            size: 22,
            color: COLORS.darkBlue
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        shading: {
          type: 'clear',
          color: 'E8F4F8',
          fill: 'E8F4F8'
        },
        border: {
          bottom: { color: COLORS.cyan, space: 1, style: BorderStyle.SINGLE, size: 12 },
          left: { color: COLORS.cyan, space: 1, style: BorderStyle.SINGLE, size: 12 },
          right: { color: COLORS.cyan, space: 1, style: BorderStyle.SINGLE, size: 12 }
        }
      }),

      // FOOTER
      new Paragraph({
        text: '\n',
        spacing: { before: 400 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: 'GEMINI SOFTWARE',
            bold: true,
            size: 26,
            color: COLORS.blue
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
        border: {
          top: { color: COLORS.cyan, space: 1, style: BorderStyle.SINGLE, size: 12 }
        }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: 'Desarrollo de Software y Sitios Web Profesionales',
            size: 20,
            color: COLORS.gray
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: 'contacto@geminisoftware.mx | www.geminisoftware.mx',
            size: 20,
            color: COLORS.gray
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 50 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: 'Documento generado en Enero 2026',
            size: 18,
            color: COLORS.gray,
            italics: true
          })
        ],
        alignment: AlignmentType.CENTER
      })
    ]
  }]
});

// Guardar el documento
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(
    'c:\\Users\\CESAR TREVIÑO\\OneDrive - GRUPO NEST, S.C\\Documentos\\GeminiSoftware\\Cuestionario-Cotizacion-GeminiSoftware.docx',
    buffer
  );
  console.log('✅ Documento Word creado exitosamente con estilos completos!');
  console.log('📄 Archivo: Cuestionario-Cotizacion-GeminiSoftware.docx');
  console.log('🎨 Incluye: Colores corporativos, formato profesional y diseño Gemini');
});
