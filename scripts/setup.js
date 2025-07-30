#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkPrerequisites() {
  log('🔍 Verificando prerrequisitos...', 'blue');
  
  // Verificar Node.js
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    log(`✅ Node.js: ${nodeVersion}`, 'green');
  } catch (error) {
    log('❌ Node.js no está instalado', 'red');
    log('💡 Instala Node.js desde https://nodejs.org/', 'yellow');
    process.exit(1);
  }
  
  // Verificar Git
  try {
    const gitVersion = execSync('git --version', { encoding: 'utf8' }).trim();
    log(`✅ Git: ${gitVersion}`, 'green');
  } catch (error) {
    log('❌ Git no está instalado', 'red');
    log('💡 Instala Git desde https://git-scm.com/', 'yellow');
    process.exit(1);
  }
  
  // Verificar si es un repositorio Git
  try {
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
    log('✅ Repositorio Git inicializado', 'green');
  } catch (error) {
    log('❌ No es un repositorio Git', 'red');
    log('💡 Ejecuta: git init', 'yellow');
    process.exit(1);
  }
}

function installDependencies() {
  log('\n📦 Instalando dependencias...', 'blue');
  
  try {
    // Instalar npm dependencies
    execSync('npm install', { stdio: 'inherit' });
    log('✅ Dependencias instaladas', 'green');
    
    // Instalar Husky
    execSync('npx husky install', { stdio: 'inherit' });
    log('✅ Husky configurado', 'green');
    
  } catch (error) {
    log('❌ Error instalando dependencias', 'red');
    log(`💡 Error: ${error.message}`, 'yellow');
    process.exit(1);
  }
}

function setupHooks() {
  log('\n🔗 Configurando Git hooks...', 'blue');
  
  try {
    // Crear hook de pre-push si no existe
    const hookPath = '.husky/pre-push';
    if (!fs.existsSync(hookPath)) {
      execSync('npx husky add .husky/pre-push "node scripts/ia-review-diff.js"', { stdio: 'inherit' });
      log('✅ Hook pre-push creado', 'green');
    } else {
      log('✅ Hook pre-push ya existe', 'green');
    }
    
    // Hacer ejecutable el hook
    execSync(`chmod +x ${hookPath}`, { stdio: 'ignore' });
    
  } catch (error) {
    log('❌ Error configurando hooks', 'red');
    log(`💡 Error: ${error.message}`, 'yellow');
    process.exit(1);
  }
}

function createEnvTemplate() {
  log('\n🔐 Creando template de variables de entorno...', 'blue');
  
  const envTemplate = `# API Keys para modelos de IA
# Configura al menos una de estas variables

# OpenAI (recomendado)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Alternativas
DEEPSEEK_API_KEY=sk-your-deepseek-api-key-here
CLAUDE_API_KEY=sk-your-claude-api-key-here

# Configuración opcional
VERBOSE=false
DEBUG=false
`;

  if (!fs.existsSync('.env')) {
    fs.writeFileSync('.env', envTemplate);
    log('✅ Archivo .env creado', 'green');
    log('💡 Edita .env y agrega tus API keys', 'yellow');
  } else {
    log('✅ Archivo .env ya existe', 'green');
  }
}

function createGitignore() {
  log('\n📝 Actualizando .gitignore...', 'blue');
  
  const gitignoreEntries = `
# AI Review logs
.ai-review.log
.ai-review.mock.json

# Environment variables
.env

# Node modules
node_modules/

# IDE files
.vscode/
.idea/
*.iml
`;

  let gitignoreContent = '';
  if (fs.existsSync('.gitignore')) {
    gitignoreContent = fs.readFileSync('.gitignore', 'utf8');
  }
  
  if (!gitignoreContent.includes('.ai-review.log')) {
    fs.appendFileSync('.gitignore', gitignoreEntries);
    log('✅ .gitignore actualizado', 'green');
  } else {
    log('✅ .gitignore ya está configurado', 'green');
  }
}

function testSetup() {
  log('\n🧪 Probando configuración...', 'blue');
  
  try {
    // Verificar que el script existe
    if (!fs.existsSync('scripts/ia-review-diff.js')) {
      throw new Error('Script de revisión no encontrado');
    }
    
    // Verificar que el hook existe
    if (!fs.existsSync('.husky/pre-push')) {
      throw new Error('Hook pre-push no encontrado');
    }
    
    log('✅ Configuración básica correcta', 'green');
    
    // Probar con mock si no hay API keys
    const hasApiKey = process.env.OPENAI_API_KEY || process.env.DEEPSEEK_API_KEY || process.env.CLAUDE_API_KEY;
    
    if (!hasApiKey) {
      log('⚠️  No hay API keys configuradas', 'yellow');
      log('💡 Configura las variables de entorno en .env', 'yellow');
      log('💡 O ejecuta: npm run test-review (con API key)', 'yellow');
    } else {
      log('✅ API keys detectadas', 'green');
    }
    
  } catch (error) {
    log('❌ Error en la configuración', 'red');
    log(`💡 Error: ${error.message}`, 'yellow');
    process.exit(1);
  }
}

function showNextSteps() {
  log('\n🎉 ¡Instalación completada!', 'green');
  log('\n📋 Próximos pasos:', 'cyan');
  log('1. Edita el archivo .env y agrega tu API key', 'yellow');
  log('2. Prueba el sistema: npm run test-review', 'yellow');
  log('3. Haz un commit y push para ver el sistema en acción', 'yellow');
  
  log('\n📚 Recursos útiles:', 'cyan');
  log('• README.md - Documentación completa', 'yellow');
  log('• .ai-review.config.js - Configuración avanzada', 'yellow');
  log('• scripts/ia-review-diff.js - Script principal', 'yellow');
  
  log('\n🔧 Comandos útiles:', 'cyan');
  log('• npm run test-review - Probar revisión manual', 'yellow');
  log('• tail -f .ai-review.log - Ver logs en tiempo real', 'yellow');
  log('• node scripts/ai-code-annotator.js --help - Anotar código IA', 'yellow');
}

function main() {
  log(`${colors.bold}🤖 AI Code Review Setup${colors.reset}`, 'cyan');
  log('Configurando sistema de revisión automática de código Java...', 'blue');
  
  try {
    checkPrerequisites();
    installDependencies();
    setupHooks();
    createEnvTemplate();
    createGitignore();
    testSetup();
    showNextSteps();
    
  } catch (error) {
    log(`❌ Error durante la instalación: ${error.message}`, 'red');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  checkPrerequisites,
  installDependencies,
  setupHooks,
  createEnvTemplate,
  createGitignore,
  testSetup
}; 