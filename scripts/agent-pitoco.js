const { execSync } = require('child_process');
const axios = require('axios');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MODEL = "gpt-4"; 

if (!OPENAI_API_KEY) {
  console.error("Error: Falta la variable de entorno OPENAI_API_KEY");
  process.exit(1);
}

function getJavaDiff() {
  try {
    const diff = execSync('git diff --cached --diff-filter=ACMRTUXB -- "*.java"', {
      encoding: 'utf8'
    });
    return diff.trim();
  } catch (error) {
    console.error("No se pudo obtener el diff:", error.message);
    process.exit(1);
  }
}

async function analizarConIA(diff) {
  const prompt = `
Eres un experto en arquitectura de software y desarrollo Java.

Analiza el siguiente fragmento de código Java (en formato diff). Evalúa:

1. Si se respetan los principios SOLID.
2. Si se aplican patrones de diseño correctamente.
3. Si hay problemas de arquitectura o estructura.
4. Si hay code smells, funciones largas, clases con muchas responsabilidades.
5. Si el código es limpio, legible y mantenible.

Responde con una lista de observaciones claras. Usa línea aproximada si es posible. Si todo está bien, responde: “Sin observaciones críticas”.

Código:
\`\`\`diff
${diff}
\`\`\`
`;

  const response = await axios.post('https://api.openai.com/v1/chat/completions', {
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2,
  }, {
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  return response.data.choices[0].message.content;
}

(async () => {
  const diff = getJavaDiff();

  if (!diff) {
    console.log("No hay cambios en archivos Java para analizar.");
    process.exit(0);
  }

  console.log("Analizando código modificado con IA...");

  try {
    const resultado = await analizarConIA(diff);
    console.log("\n=== Revisión IA ===");
    console.log(resultado);

    if (!resultado.toLowerCase().includes("sin observaciones críticas")) {
      console.log("\nPush bloqueado: Se encontraron observaciones en el código. Revisa antes de continuar.");
      process.exit(1);
    }

    console.log("\nCódigo limpio. Push permitido.");
  } catch (error) {
    console.error("Error durante la llamada a la IA:", error.message);
    process.exit(1);
  }
})();
