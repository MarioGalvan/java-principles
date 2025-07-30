# 🤖 AI Code Review para Java

Sistema automatizado de revisión de código Java usando IA que se integra con Git y Husky para garantizar alta calidad de código antes de cada push.

## ✨ Características

- 🔍 **Análisis automático** de código Java antes de cada push
- 🧠 **Múltiples modelos de IA** (OpenAI GPT-4, Claude, DeepSeek)
- 📊 **Evaluación completa** de principios SOLID, patrones de diseño y code smells
- 🚫 **Bloqueo inteligente** de pushes con problemas críticos
- 📝 **Logging detallado** de todas las revisiones
- 🎨 **Output colorido** y fácil de leer
- ⚙️ **Configuración flexible** para diferentes proyectos

## 🚀 Instalación

### 1. Prerrequisitos

- Node.js >= 16.0.0
- Git con repositorio inicializado
- API Key de al menos un proveedor de IA

### 2. Instalar dependencias

```bash
# Instalar Node.js dependencies
npm install

# Configurar Husky
npx husky install
```

### 3. Configurar API Keys

Crea un archivo `.env` en la raíz del proyecto:

```bash
# OpenAI (recomendado)
OPENAI_API_KEY=sk-your-openai-api-key

# Alternativas
DEEPSEEK_API_KEY=sk-your-deepseek-api-key
CLAUDE_API_KEY=sk-your-claude-api-key
```

### 4. Verificar instalación

```bash
# Probar el sistema
npm run test-review
```

## 📋 Configuración

### Variables de entorno

| Variable | Descripción | Requerido |
|----------|-------------|-----------|
| `OPENAI_API_KEY` | API Key de OpenAI | Sí (uno de los tres) |
| `DEEPSEEK_API_KEY` | API Key de DeepSeek | No |
| `CLAUDE_API_KEY` | API Key de Claude | No |
| `VERBOSE` | Modo verboso (true/false) | No |
| `DEBUG` | Modo debug | No |

### Configuración avanzada

Edita `.ai-review.config.js` para personalizar:

```javascript
module.exports = {
  review: {
    // Score mínimo para aprobar (1-10)
    minScore: 6,
    
    // Bloquear en problemas críticos
    blockOnCritical: true,
    
    // Tamaño máximo del diff
    maxDiffSize: 50000
  }
};
```

## 🎯 Uso

### Flujo normal

1. **Desarrollar código Java**
2. **Hacer commit** de tus cambios
3. **Hacer push** - el sistema automáticamente:
   - Detecta archivos Java modificados
   - Envía el diff a la IA
   - Analiza principios SOLID, patrones, code smells
   - Bloquea el push si encuentra problemas críticos
   - Muestra sugerencias de mejora

### Comandos útiles

```bash
# Probar revisión manualmente
npm run test-review

# Ver logs de revisiones
tail -f .ai-review.log

# Agregar comentarios de IA a código generado
node scripts/ai-code-annotator.js src/Main.java GPT-4

# Listar archivos con código generado por IA
node scripts/ai-code-annotator.js --list src
```

## 🔧 Personalización

### Agregar nuevos modelos de IA

Edita `scripts/ia-review-diff.js` y agrega en `CONFIG.AI_MODELS`:

```javascript
{
  name: 'tu-modelo',
  apiKey: process.env.TU_API_KEY,
  endpoint: 'https://api.tu-modelo.com/v1/chat/completions',
  model: 'tu-modelo-nombre',
  headers: { 'Authorization': `Bearer ${process.env.TU_API_KEY}`, 'Content-Type': 'application/json' }
}
```

### Personalizar prompts

Modifica la función `createPrompt()` en `scripts/ia-review-diff.js` para ajustar el análisis según tus necesidades.

### Configurar notificaciones

```javascript
// En .ai-review.config.js
notifications: {
  webhookUrl: 'https://hooks.slack.com/services/...',
  systemNotifications: true
}
```

## 📊 Criterios de evaluación

El sistema evalúa:

### 🔍 Principios SOLID
- **S**ingle Responsibility: Una clase, una responsabilidad
- **O**pen/Closed: Abierto para extensión, cerrado para modificación
- **L**iskov Substitution: Subclases sustituyen clases base
- **I**nterface Segregation: Interfaces específicas
- **D**ependency Inversion: Depender de abstracciones

### 🏗️ Arquitectura y Diseño
- Patrones de diseño apropiados
- Separación de responsabilidades
- Acoplamiento y cohesión
- Estructura de paquetes

### 🧹 Calidad de Código
- Code smells (métodos largos, clases grandes)
- Legibilidad y mantenibilidad
- Convenciones de nomenclatura
- Complejidad ciclomática

### ⚠️ Anti-patrones Java
- Singleton mal implementado
- Anémico domain model
- God objects
- Primitive obsession
- Feature envy

## 🚨 Estados de revisión

| Estado | Descripción | Acción |
|--------|-------------|--------|
| `APPROVED` | Código excelente (score 9-10) | ✅ Push permitido |
| `WARNING` | Problemas menores (score 6-8) | ⚠️ Push permitido con advertencias |
| `BLOCKED` | Problemas críticos (score <6) | 🚫 Push bloqueado |

## 📝 Logs y debugging

### Archivo de log
Todas las revisiones se guardan en `.ai-review.log`:

```
[2024-01-15T10:30:00.000Z] 🚀 Iniciando revisión de código con IA...
[2024-01-15T10:30:01.000Z] 📋 Archivos Java modificados: 2
[2024-01-15T10:30:05.000Z] ✅ PUSH PERMITIDO: Código aprobado por IA.
```

### Modo debug
```bash
DEBUG=true npm run test-review
```

### Modo verboso
```bash
VERBOSE=true npm run test-review
```

## 🔄 Workflow recomendado

### Para desarrollo diario

1. **Configurar el proyecto** una vez
2. **Desarrollar normalmente** - el sistema es transparente
3. **Revisar feedback** cuando el push se bloquea
4. **Mejorar código** según las sugerencias de IA
5. **Hacer push** cuando el código esté limpio

### Para equipos

1. **Configurar en CI/CD** para validación adicional
2. **Compartir logs** para análisis de tendencias
3. **Personalizar criterios** según estándares del equipo
4. **Integrar con herramientas** de gestión de proyectos

## 🛠️ Troubleshooting

### Problemas comunes

**Error: "No hay API keys configuradas"**
```bash
# Verificar variables de entorno
echo $OPENAI_API_KEY
# O crear archivo .env
```

**Error: "Todos los modelos de IA fallaron"**
```bash
# Verificar conexión a internet
ping api.openai.com
# Verificar API key
curl -H "Authorization: Bearer $OPENAI_API_KEY" https://api.openai.com/v1/models
```

**Hook no se ejecuta**
```bash
# Verificar que Husky esté instalado
ls -la .husky/
# Reinstalar hook
npx husky add .husky/pre-push "node scripts/ia-review-diff.js"
```

### Performance

- **Diff muy grande**: Considera commits más pequeños
- **Llamadas lentas**: Usa modelos más rápidos o ajusta timeout
- **Muchos archivos**: Filtra por patrones específicos

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para detalles.

## 🙏 Agradecimientos

- [Husky](https://typicode.github.io/husky/) por los Git hooks
- [OpenAI](https://openai.com/), [Anthropic](https://www.anthropic.com/), [DeepSeek](https://www.deepseek.com/) por las APIs de IA
- La comunidad de desarrolladores Java por los principios SOLID

---

**¿Necesitas ayuda?** Abre un issue o contacta al equipo de desarrollo. 