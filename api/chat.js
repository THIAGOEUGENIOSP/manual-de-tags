export const config = { runtime: 'edge' };

const SYSTEM_PROMPT = `Você é o assistente oficial do "Guia Completo Front-End — Manual das TAGs", um site de referência em português sobre HTML, CSS e JavaScript.

Seu papel é ajudar desenvolvedores (especialmente iniciantes) a entender e usar corretamente tags HTML, propriedades CSS e métodos JavaScript.

Diretrizes:
- Responda sempre em português brasileiro
- Seja direto, claro e didático
- Forneça exemplos de código quando relevante (use blocos de código com linguagem especificada)
- Se a pergunta for sobre uma tag HTML específica, explique: o que é, quando usar, atributos principais e um exemplo prático
- Se for sobre CSS, explique a propriedade, valores aceitos e exemplo
- Se for sobre JS, explique o método/conceito com exemplo prático
- Para dúvidas fora do escopo de HTML/CSS/JS, gentilmente redirecione para o tema do guia
- Mantenha respostas concisas mas completas — sem enrolação`;

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key não configurada' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Body inválido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { messages } = body;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: 'Mensagens inválidas' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Sanitize: apenas roles válidas, máx 20 mensagens, máx 1000 chars cada
  const safeMessages = messages
    .filter(m => ['user', 'assistant'].includes(m.role) && typeof m.content === 'string')
    .slice(-20)
    .map(m => ({ role: m.role, content: m.content.slice(0, 1000) }));

  const groqBody = {
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...safeMessages],
    max_tokens: 1024,
    temperature: 0.7,
  };

  let groqRes;
  try {
    groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(groqBody),
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Erro ao conectar com Groq' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!groqRes.ok) {
    const errText = await groqRes.text();
    return new Response(JSON.stringify({ error: 'Erro da Groq API', detail: errText }), {
      status: groqRes.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const data = await groqRes.json();
  const reply = data?.choices?.[0]?.message?.content ?? '';

  return new Response(JSON.stringify({ reply }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
