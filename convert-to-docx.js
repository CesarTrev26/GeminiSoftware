const fs = require('fs');
const HTMLtoDOCX = require('html-to-docx');

async function convertHTMLtoDocx() {
  try {
    // Leer el archivo HTML
    const htmlContent = fs.readFileSync(
      'c:\\Users\\CESAR TREVIÑO\\OneDrive - GRUPO NEST, S.C\\Documentos\\GeminiSoftware\\Cuestionario-Cotizacion-GeminiSoftware.html',
      'utf-8'
    );

    console.log('Convirtiendo HTML a DOCX con estilos preservados...');

    // Convertir HTML a DOCX
    const docxBuffer = await HTMLtoDOCX(htmlContent, null, {
      table: { row: { cantSplit: true } },
      footer: true,
      pageNumber: true,
      font: 'Montserrat',
      fontSize: 22,
      complexScriptFontSize: 22,
      header: false,
      title: 'Cuestionario de Cotización - Gemini Software',
      subject: 'Cuestionario de Cotización Web',
      creator: 'Gemini Software',
      keywords: ['cuestionario', 'cotización', 'gemini', 'software'],
      description: 'Cuestionario para cotizar proyectos web',
      orientation: 'portrait',
      margins: {
        top: 1440, // 1 inch = 1440 twips
        right: 1440,
        bottom: 1440,
        left: 1440,
        header: 720,
        footer: 720,
        gutter: 0
      }
    });

    // Guardar el archivo DOCX
    fs.writeFileSync(
      'c:\\Users\\CESAR TREVIÑO\\OneDrive - GRUPO NEST, S.C\\Documentos\\GeminiSoftware\\Cuestionario-Cotizacion-GeminiSoftware.docx',
      docxBuffer
    );

    console.log('✅ Documento Word creado exitosamente con estilos preservados!');
    console.log('📄 Archivo: Cuestionario-Cotizacion-GeminiSoftware.docx');
  } catch (error) {
    console.error('❌ Error al convertir:', error.message);
    process.exit(1);
  }
}

convertHTMLtoDocx();
