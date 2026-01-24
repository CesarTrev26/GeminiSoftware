require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    console.log('\n🔍 Listando modelos disponibles de Google Gemini...\n');
    
    // Fetch available models
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${process.env.GEMINI_API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.models) {
      console.log(`✅ ${data.models.length} modelos encontrados:\n`);
      
      data.models.forEach((model, index) => {
        console.log(`${index + 1}. ${model.name}`);
        console.log(`   Display Name: ${model.displayName}`);
        console.log(`   Description: ${model.description}`);
        console.log(`   Generation Methods: ${model.supportedGenerationMethods?.join(', ')}`);
        console.log('');
      });
      
      // Buscar modelos flash
      const flashModels = data.models.filter(m => m.name.includes('flash'));
      if (flashModels.length > 0) {
        console.log('\n⚡ Modelos Flash disponibles (recomendados):');
        flashModels.forEach(m => console.log(`   - ${m.name}`));
      }
    } else {
      console.error('❌ No se encontraron modelos:', data);
    }
  } catch (error) {
    console.error('❌ Error al listar modelos:', error.message);
  }
}

listModels();
