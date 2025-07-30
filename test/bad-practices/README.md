# 🧪 Archivos de Prueba - Malas Prácticas Java

Esta carpeta contiene archivos Java con malas prácticas y anti-patrones específicamente diseñados para probar el sistema de revisión de IA.

## 📁 Archivos de Prueba

### 1. `BadCodeExample.java`
**Anti-patrones generales y malas prácticas:**
- ❌ Variables globales públicas
- ❌ Singleton mal implementado (no thread-safe)
- ❌ God Object (demasiadas responsabilidades)
- ❌ Métodos extremadamente largos
- ❌ Métodos con demasiados parámetros
- ❌ Métodos que retornan null
- ❌ Excepciones genéricas
- ❌ Efectos secundarios ocultos
- ❌ Métodos con nombres confusos
- ❌ Código duplicado
- ❌ Clases anémicas

### 2. `SolidViolations.java`
**Violaciones específicas de principios SOLID:**
- ❌ **SRP (Single Responsibility)**: Clases que hacen demasiadas cosas
- ❌ **OCP (Open/Closed)**: Código no extensible, requiere modificación
- ❌ **LSP (Liskov Substitution)**: Subclases que no pueden sustituir a la base
- ❌ **ISP (Interface Segregation)**: Interfaces que fuerzan métodos innecesarios
- ❌ **DIP (Dependency Inversion)**: Dependencias de implementaciones concretas

### 3. `CodeSmells.java`
**Code smells específicos:**
- ❌ **Long Method**: Métodos extremadamente largos
- ❌ **Large Class**: Clases con demasiadas responsabilidades
- ❌ **Duplicate Code**: Código repetido en múltiples lugares
- ❌ **Primitive Obsession**: Uso excesivo de tipos primitivos
- ❌ **Data Clumps**: Grupos de datos que siempre van juntos
- ❌ **Switch Statements**: Uso excesivo de switch statements

## 🚀 Cómo Probar el Sistema

### 1. Probar con un archivo específico

```bash
# Agregar un archivo de prueba al staging
git add test/bad-practices/BadCodeExample.java

# Hacer commit
git commit -m "Add bad code example for testing"

# Intentar hacer push (debería ser bloqueado)
git push
```

### 2. Probar con múltiples archivos

```bash
# Agregar todos los archivos de prueba
git add test/bad-practices/

# Hacer commit
git commit -m "Add multiple bad practice examples"

# Intentar hacer push (debería ser bloqueado)
git push
```

### 3. Probar manualmente

```bash
# Probar revisión manual
npm run test-review
```

## 📊 Resultados Esperados

### Para `BadCodeExample.java`:
- **Score**: 2-4/10
- **Status**: BLOCKED
- **Issues**: Múltiples problemas críticos
- **Categorías**: SOLID_VIOLATION, ANTI_PATTERN, QUALITY

### Para `SolidViolations.java`:
- **Score**: 1-3/10
- **Status**: BLOCKED
- **Issues**: Violaciones graves de SOLID
- **Categorías**: SOLID_VIOLATION, ARCHITECTURE

### Para `CodeSmells.java`:
- **Score**: 2-4/10
- **Status**: BLOCKED
- **Issues**: Múltiples code smells
- **Categorías**: QUALITY, CODE_SMELL

## 🔍 Qué Buscar en la Revisión

### Problemas Críticos:
- ✅ **God Objects**: Clases con demasiadas responsabilidades
- ✅ **Long Methods**: Métodos extremadamente largos
- ✅ **SOLID Violations**: Violaciones de principios SOLID
- ✅ **Anti-patterns**: Patrones de diseño incorrectos
- ✅ **Code Smells**: Olores de código evidentes

### Sugerencias Esperadas:
- 🔧 **Refactoring**: Extraer métodos y clases
- 🔧 **SOLID**: Aplicar principios SOLID
- 🔧 **Design Patterns**: Usar patrones apropiados
- 🔧 **Clean Code**: Mejorar legibilidad y mantenibilidad

## 🎯 Casos de Prueba

### Caso 1: Violación de SRP
```java
// En BadCodeExample.java - método processEverything()
// Hace validación, procesamiento, persistencia, cache, email, logging, etc.
```

### Caso 2: Violación de OCP
```java
// En SolidViolations.java - PaymentProcessor
// Usa if-else en lugar de polimorfismo
```

### Caso 3: Long Method
```java
// En CodeSmells.java - método processUserData()
// Más de 100 líneas con múltiples responsabilidades
```

### Caso 4: God Class
```java
// En CodeSmells.java - clase GodClass
// Más de 50 atributos y múltiples responsabilidades
```

## 📝 Notas de Prueba

- **Propósito**: Estos archivos están diseñados específicamente para fallar la revisión de IA
- **No usar en producción**: Contienen malas prácticas intencionales
- **Aprender de los errores**: Usar las sugerencias de IA para mejorar el código
- **Iterativo**: Mejorar el código basándose en el feedback de IA

## 🔄 Workflow de Prueba

1. **Agregar archivo de prueba** al staging
2. **Hacer commit** con mensaje descriptivo
3. **Intentar push** - debería ser bloqueado
4. **Revisar feedback** de IA
5. **Mejorar código** según sugerencias
6. **Probar nuevamente** hasta que pase la revisión

## 💡 Consejos

- **Empezar con un archivo**: Probar con un archivo a la vez
- **Revisar logs**: Ver `.ai-review.log` para detalles
- **Aprender**: Usar el feedback para mejorar habilidades
- **Iterar**: Mejorar gradualmente el código

---

**¡Estos archivos están diseñados para fallar!** El objetivo es que el sistema de IA detecte las malas prácticas y proporcione sugerencias de mejora. 