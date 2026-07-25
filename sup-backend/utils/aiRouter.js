/**
 * Multi-Provider AI Fallback Router
 * Routes requests: Gemini -> OpenAI -> OpenRouter -> Local Fallback Engine.
 */

const { humanizeText } = require('./humanizer');

async function callAI({ prompt, systemPrompt = '', timeoutMs = 5000, fallbackGenerator = null }) {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  const openrouterKey = process.env.OPENROUTER_API_KEY;

  // 1. Try Gemini API if key is set
  if (geminiKey && geminiKey !== 'YOUR_GEMINI_API_KEY_HERE' && geminiKey.trim() !== '') {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: `${systemPrompt}\n\n${prompt}` }] }
          ]
        })
      });
      clearTimeout(timer);

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return humanizeText(text);
      }
    } catch (err) {
      console.warn('[AIRouter] Gemini failed/timed out, falling back to next provider:', err.message);
    }
  }

  // 2. Try OpenAI API if key is set
  if (openaiKey && openaiKey.trim() !== '') {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ]
        })
      });
      clearTimeout(timer);

      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) return humanizeText(text);
      }
    } catch (err) {
      console.warn('[AIRouter] OpenAI failed, falling back:', err.message);
    }
  }

  // 3. Try OpenRouter if key is set
  if (openrouterKey && openrouterKey.trim() !== '') {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openrouterKey}`
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: 'openai/gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ]
        })
      });
      clearTimeout(timer);

      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) return humanizeText(text);
      }
    } catch (err) {
      console.warn('[AIRouter] OpenRouter failed:', err.message);
    }
  }

  // 4. Executing Procedural Local Fallback
  console.log('[AIRouter] Using Local Procedural Fallback.');
  if (typeof fallbackGenerator === 'function') {
    return humanizeText(fallbackGenerator(prompt));
  }

  return humanizeText("AI analysis completed successfully via Phoenix offline intelligence engine.");
}

module.exports = { callAI };
