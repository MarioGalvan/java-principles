module.exports = {
  // Configuración de modelos de IA (prioridad)
  aiModels: [
    {
      name: 'openai',
      apiKey: process.env.OPENAI_API_KEY,
      endpoint: 'https://api.openai.com/v1/chat/completions',
      model: 'gpt-4',
      enabled: true
    },
    {
      name: 'deepseek',
      apiKey: process.env.DEEPSEEK_API_KEY,
      endpoint: 'https://api.deepseek.com/v1/chat/completions',
      model: 'deepseek-chat',
      enabled: true
    },
    {
      name: 'claude',
      apiKey: process.env.CLAUDE_API_KEY,
      endpoint: 'https://api.anthropic.com/v1/messages',
      model: 'claude-3-sonnet-20240229',
      enabled: true
    }
  ],

  // Configuración de revisión
  review: {
    // Archivos a revisar
    filePatterns: ['*.java'],
    
    // Tamaño máximo del diff (bytes)
    maxDiffSize: 50000,
    
    // Bloquear push en problemas críticos
    blockOnCritical: true,
    
    // Score mínimo para aprobar (1-10)
    minScore: 6,
    
    // Categorías de problemas que bloquean el push
    blockingCategories: ['CRITICAL', 'SOLID_VIOLATION'],
    
    // Timeout para llamadas a IA (ms)
    timeout: 30000
  },

  // Configuración de logging
  logging: {
    // Archivo de log
    logFile: '.ai-review.log',
    
    // Nivel de verbosidad
    verbose: process.env.VERBOSE === 'true',
    
    // Incluir diffs en el log
    includeDiffs: false,
    
    // Rotación de logs (días)
    maxLogAge: 30
  },

  // Configuración de prompts personalizados
  prompts: {
    // Prompt base para revisión
    basePrompt: `Eres un experto senior en arquitectura de software, principios SOLID, y desarrollo Java.
    
Analiza el siguiente código Java y evalúa:
- Principios SOLID
- Patrones de diseño
- Code smells y anti-patrones
- Calidad y mantenibilidad

Responde en formato JSON con score, status, issues y recommendations.`,

    // Prompt específico para problemas críticos
    criticalPrompt: `Enfócate en problemas críticos que podrían causar:
- Violaciones graves de SOLID
- Anti-patrones peligrosos
- Problemas de seguridad
- Problemas de rendimiento críticos`
  },

  // Configuración de notificaciones
  notifications: {
    // Mostrar notificaciones del sistema
    systemNotifications: false,
    
    // Enviar notificaciones por email (requiere configuración SMTP)
    emailNotifications: false,
    
    // Webhook para notificaciones (Slack, Discord, etc.)
    webhookUrl: process.env.WEBHOOK_URL
  },

  // Configuración de desarrollo
  development: {
    // Modo debug
    debug: process.env.DEBUG === 'true',
    
    // Simular llamadas a IA (para testing)
    mockAI: process.env.MOCK_AI === 'true',
    
    // Archivo de configuración de mock
    mockResponseFile: '.ai-review.mock.json'
  }
}; 