// Cargar variables de entorno desde .env
require('dotenv').config();

const { execSync } = require('child_process');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuración
const CONFIG = {
  // Modelos de IA disponibles (prioridad)
  AI_MODELS: [
    {
      name: 'openai',
      apiKey: process.env.OPENAI_API_KEY,
      endpoint: 'https://api.openai.com/v1/chat/completions',
      model: 'gpt-3.5-turbo',
      headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' }
    },
    {
      name: 'deepseek',
      apiKey: process.env.DEEPSEEK_API_KEY,
      endpoint: 'https://api.deepseek.com/v1/chat/completions',
      model: 'deepseek-chat',
      headers: { 'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`, 'Content-Type': 'application/json' }
    },
    {
      name: 'claude',
      apiKey: process.env.CLAUDE_API_KEY,
      endpoint: 'https://api.anthropic.com/v1/messages',
      model: 'claude-3-sonnet-20240229',
      headers: { 'Authorization': `Bearer ${process.env.CLAUDE_API_KEY}`, 'Content-Type': 'application/json', 'anthropic-version': '2023-06-01' }
    }
  ],
  LOG_FILE: '.ai-review.log',
  MAX_DIFF_SIZE: 50000, // 50KB
  BLOCK_ON_CRITICAL: true,
  VERBOSE: process.env.VERBOSE === 'true',
  TEST_MODE: process.env.TEST_MODE === 'true' || process.env.NODE_ENV === 'test'
};

// Colores para output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  const timestamp = new Date().toISOString();
  const coloredMessage = `${colors[color]}${message}${colors.reset}`;
  console.log(`[${timestamp}] ${coloredMessage}`);
  
  // Guardar en log file
  const logEntry = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(CONFIG.LOG_FILE, logEntry);
}

function getJavaDiff() {
  try {
    log('Obteniendo diff de archivos Java...', 'blue');
    
    // Obtener solo archivos Java modificados y staged
    const diff = execSync('git diff --cached --diff-filter=ACMRTUXB -- "*.java"', {
      encoding: 'utf8'
    });
    
    if (!diff.trim()) {
      log('No hay cambios en archivos Java para analizar.', 'yellow');
      return null;
    }
    
    // Verificar tamaño del diff
    if (diff.length > CONFIG.MAX_DIFF_SIZE) {
      log(`⚠️  Diff muy grande (${diff.length} bytes). Considera hacer commits más pequeños.`, 'yellow');
    }
    
    return diff.trim();
  } catch (error) {
    log(`Error obteniendo diff: ${error.message}`, 'red');
    process.exit(1);
  }
}

function getStagedJavaFiles() {
  try {
    const files = execSync('git diff --cached --name-only --diff-filter=ACMRTUXB -- "*.java"', {
      encoding: 'utf8'
    });
    return files.trim().split('\n').filter(f => f);
  } catch (error) {
    log(`Error obteniendo archivos staged: ${error.message}`, 'red');
    return [];
  }
}

function createPrompt(diff, files) {
  return `Eres un experto senior en arquitectura de software, principios SOLID, y desarrollo Java.

ANÁLISIS DE CÓDIGO JAVA

Archivos modificados: ${files.join(', ')}

Analiza el siguiente código Java (formato diff) y evalúa:

🔍 **PRINCIPIOS SOLID:**
- Single Responsibility: ¿Cada clase tiene una sola razón para cambiar?
- Open/Closed: ¿El código está abierto para extensión, cerrado para modificación?
- Liskov Substitution: ¿Las subclases pueden sustituir a sus clases base?
- Interface Segregation: ¿Las interfaces son específicas y no forzadas?
- Dependency Inversion: ¿Depende de abstracciones, no de concreciones?

🏗️ **ARQUITECTURA Y DISEÑO:**
- Patrones de diseño apropiados
- Separación de responsabilidades
- Acoplamiento y cohesión
- Estructura de paquetes

🧹 **CALIDAD DE CÓDIGO:**
- Code smells (métodos largos, clases grandes, etc.)
- Legibilidad y mantenibilidad
- Convenciones de nomenclatura
- Complejidad ciclomática

⚠️ **ANTI-PATRONES JAVA:**
- Singleton mal implementado
- Anémico domain model
- God objects
- Primitive obsession
- Feature envy

📝 **RESPUESTA REQUERIDA:**
Responde en formato JSON:
{
  "score": 1-10,
  "status": "APPROVED|BLOCKED|WARNING",
  "issues": [
    {
      "severity": "CRITICAL|WARNING|INFO",
      "category": "SOLID|ARCHITECTURE|QUALITY|ANTI_PATTERN",
      "message": "Descripción del problema",
      "suggestion": "Sugerencia de mejora",
      "line": "Línea aproximada si aplica"
    }
  ],
  "summary": "Resumen ejecutivo",
  "recommendations": ["Lista de recomendaciones específicas"]
}

Si el código es excelente, responde con status "APPROVED" y score 9-10.

CÓDIGO A ANALIZAR:
\`\`\`diff
${diff}
\`\`\``;
}

// Función para modo de prueba sin API key
function mockAIResponse(diff, files) {
  log('🧪 Ejecutando en modo de prueba (sin API key)...', 'yellow');
  
  // Análisis básico basado en patrones en el código
  const hasBadPatterns = diff.includes('public static') || 
                         diff.includes('getInstance()') ||
                         diff.includes('processEverything') ||
                         diff.includes('complexMethod') ||
                         diff.includes('return null') ||
                         diff.includes('catch (Exception') ||
                         diff.includes('God Object') ||
                         diff.includes('Anti-patrón');
  
  const hasLongMethod = diff.split('\n').length > 50;
  const hasManyParameters = diff.includes('String param1, String param2, String param3');
  const hasGlobalVariables = diff.includes('public static String') || diff.includes('public static int');
  
  let score = 8; // Score base
  let status = 'APPROVED';
  let issues = [];
  
  if (hasBadPatterns) {
    score = 3;
    status = 'BLOCKED';
    issues.push({
      severity: 'CRITICAL',
      category: 'ANTI_PATTERN',
      message: 'Se detectaron múltiples anti-patrones en el código',
      suggestion: 'Refactorizar el código para eliminar anti-patrones',
      line: 'Múltiples líneas'
    });
  }
  
  if (hasLongMethod) {
    score = Math.min(score, 4);
    status = score < 6 ? 'BLOCKED' : 'WARNING';
    issues.push({
      severity: 'WARNING',
      category: 'QUALITY',
      message: 'Método muy largo detectado',
      suggestion: 'Extraer métodos más pequeños siguiendo el principio de responsabilidad única',
      line: 'Método processEverything'
    });
  }
  
  if (hasManyParameters) {
    score = Math.min(score, 5);
    status = score < 6 ? 'BLOCKED' : 'WARNING';
    issues.push({
      severity: 'WARNING',
      category: 'QUALITY',
      message: 'Método con demasiados parámetros',
      suggestion: 'Usar objetos para agrupar parámetros relacionados',
      line: 'Método complexMethod'
    });
  }
  
  if (hasGlobalVariables) {
    score = Math.min(score, 6);
    status = score < 6 ? 'BLOCKED' : 'WARNING';
    issues.push({
      severity: 'WARNING',
      category: 'QUALITY',
      message: 'Variables globales públicas detectadas',
      suggestion: 'Encapsular variables en clases apropiadas',
      line: 'Variables GLOBAL_VARIABLE y COUNTER'
    });
  }
  
  return {
    score,
    status,
    issues,
    summary: `Análisis en modo de prueba: ${issues.length} problemas encontrados`,
    recommendations: [
      'Refactorizar métodos largos en métodos más pequeños',
      'Eliminar variables globales públicas',
      'Aplicar principios SOLID',
      'Usar objetos para agrupar parámetros relacionados',
      'Implementar patrones de diseño apropiados'
    ]
  };
}

async function callAI(diff, files, modelConfig) {
  const prompt = createPrompt(diff, files);
  
  try {
    log(`Enviando análisis a ${modelConfig.name} (${modelConfig.model})...`, 'cyan');
    
    let requestBody;
    
    if (modelConfig.name === 'claude') {
      // Formato específico para Claude
      requestBody = {
        model: modelConfig.model,
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }]
      };
    } else if (modelConfig.name === 'claude') {
      // Formato específico para Claude
      requestBody = {
        model: modelConfig.model,
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }]
      };
    } else {
      // Formato para OpenAI/DeepSeek
      requestBody = {
        model: modelConfig.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        max_tokens: 4000
      };
    }
    
    const response = await axios.post(modelConfig.endpoint, requestBody, {
      headers: modelConfig.headers,
      timeout: 30000
    });
    
    let content;
    if (modelConfig.name === 'claude') {
      content = response.data.content[0].text;
    } else {
      content = response.data.choices[0].message.content;
    }
    
    return content;
  } catch (error) {
    log(`Error con ${modelConfig.name}: ${error.message}`, 'red');
    if (error.response) {
      log(`Detalles del error: ${JSON.stringify(error.response.data)}`, 'red');
    }
    throw error;
  }
}

function parseAIResponse(response) {
  try {
    // Intentar extraer JSON de la respuesta
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // Fallback: análisis manual de la respuesta
    const isApproved = response.toLowerCase().includes('approved') || 
                      response.toLowerCase().includes('sin observaciones') ||
                      response.toLowerCase().includes('código limpio');
    
    return {
      score: isApproved ? 8 : 5,
      status: isApproved ? 'APPROVED' : 'WARNING',
      issues: [],
      summary: response.substring(0, 200) + '...',
      recommendations: []
    };
  } catch (error) {
    log(`Error parseando respuesta de IA: ${error.message}`, 'red');
    return {
      score: 5,
      status: 'WARNING',
      issues: [],
      summary: 'Error parseando respuesta de IA',
      recommendations: ['Revisar manualmente el código']
    };
  }
}

function displayResults(analysis, files) {
  console.log('\n' + '='.repeat(80));
  console.log(`${colors.bold}${colors.cyan}🤖 REVISIÓN DE IA - RESULTADOS${colors.reset}`);
  console.log('='.repeat(80));
  
  console.log(`📁 Archivos analizados: ${files.join(', ')}`);
  console.log(`📊 Score: ${analysis.score}/10`);
  console.log(`📋 Status: ${analysis.status}`);
  console.log(`📝 Resumen: ${analysis.summary}`);
  
  if (analysis.issues && analysis.issues.length > 0) {
    console.log('\n🚨 PROBLEMAS ENCONTRADOS:');
    analysis.issues.forEach((issue, index) => {
      const color = issue.severity === 'CRITICAL' ? 'red' : 
                   issue.severity === 'WARNING' ? 'yellow' : 'blue';
      console.log(`${index + 1}. [${issue.severity}] ${issue.category}`);
      console.log(`   ${colors[color]}${issue.message}${colors.reset}`);
      if (issue.suggestion) {
        console.log(`   💡 Sugerencia: ${issue.suggestion}`);
      }
      if (issue.line) {
        console.log(`   📍 Línea: ${issue.line}`);
      }
      console.log('');
    });
  }
  
  if (analysis.recommendations && analysis.recommendations.length > 0) {
    console.log('💡 RECOMENDACIONES:');
    analysis.recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });
  }
  
  console.log('='.repeat(80));
}

function shouldBlockPush(analysis) {
  if (!CONFIG.BLOCK_ON_CRITICAL) return false;
  
  return analysis.status === 'BLOCKED' || 
         (analysis.score < 6) ||
         (analysis.issues && analysis.issues.some(issue => issue.severity === 'CRITICAL'));
}

async function main() {
  log('🚀 Iniciando revisión de código con IA...', 'green');
  
  // Verificar configuración
  const availableModels = CONFIG.AI_MODELS.filter(model => model.apiKey);
  
  // Si no hay API keys disponibles o estamos en modo de prueba, usar mock
  if ((availableModels.length === 0 || CONFIG.TEST_MODE) && CONFIG.TEST_MODE) {
    const diff = getJavaDiff();
    if (!diff) {
      log('✅ No hay cambios Java para revisar. Push permitido.', 'green');
      process.exit(0);
    }
    
    const files = getStagedJavaFiles();
    log(`📋 Archivos Java modificados: ${files.length}`, 'blue');
    
    const analysis = mockAIResponse(diff, files);
    displayResults(analysis, files);
    
    if (shouldBlockPush(analysis)) {
      log('🚫 PUSH BLOQUEADO: Se encontraron problemas críticos en el código.', 'red');
      log('💡 Revisa las sugerencias arriba y mejora el código antes de hacer push.', 'yellow');
      process.exit(1);
    } else {
      log('✅ PUSH PERMITIDO: Código aprobado por IA.', 'green');
      process.exit(0);
    }
  }
  
  if (availableModels.length === 0) {
    log('❌ Error: No hay API keys configuradas. Configura CURSOR_API_KEY, OPENAI_API_KEY, DEEPSEEK_API_KEY, o CLAUDE_API_KEY', 'red');
    log('💡 Para probar sin API key, ejecuta: TEST_MODE=true npm run test-review', 'yellow');
    log('💡 Para usar Cursor API, configura CURSOR_API_KEY en tu archivo .env', 'yellow');
    process.exit(1);
  }
  
  // Obtener diff y archivos
  const diff = getJavaDiff();
  if (!diff) {
    log('✅ No hay cambios Java para revisar. Push permitido.', 'green');
    process.exit(0);
  }
  
  const files = getStagedJavaFiles();
  log(`📋 Archivos Java modificados: ${files.length}`, 'blue');
  
  // Intentar con diferentes modelos de IA
  let analysis = null;
  let lastError = null;
  
  for (const modelConfig of availableModels) {
    try {
      const response = await callAI(diff, files, modelConfig);
      analysis = parseAIResponse(response);
      break;
    } catch (error) {
      lastError = error;
      log(`⚠️  Falló ${modelConfig.name}, intentando siguiente...`, 'yellow');
      continue;
    }
  }
  
  if (!analysis) {
    log(`❌ Error: Todos los modelos de IA fallaron. Último error: ${lastError?.message}`, 'red');
    log('💡 Sugerencia: Verifica tu conexión a internet y las API keys', 'yellow');
    process.exit(1);
  }
  
  // Mostrar resultados
  displayResults(analysis, files);
  
  // Decidir si bloquear el push
  if (shouldBlockPush(analysis)) {
    log('🚫 PUSH BLOQUEADO: Se encontraron problemas críticos en el código.', 'red');
    log('💡 Revisa las sugerencias arriba y mejora el código antes de hacer push.', 'yellow');
    process.exit(1);
  } else {
    log('✅ PUSH PERMITIDO: Código aprobado por IA.', 'green');
    process.exit(0);
  }
}

// Manejo de errores global
process.on('unhandledRejection', (reason, promise) => {
  log(`Error no manejado: ${reason}`, 'red');
  process.exit(1);
});

// Ejecutar
if (require.main === module) {
  main().catch(error => {
    log(`Error fatal: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { main, CONFIG }; 