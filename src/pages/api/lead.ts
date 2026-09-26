export const prerender = false;

interface LeadData {
  name?: string;
  phone?: string;
  message?: string;
  preset?: string;
}

const LEAD_EMAIL = 'nt@itr-rf.ru'; // TODO: подставить реальный email брата
const LEAD_TELEGRAM_BOT_TOKEN = '';       // TODO: подставить токен Telegram-бота (опционально)
const LEAD_TELEGRAM_CHAT_ID = '';         // TODO: подставить chat_id (опционально)

function sanitize(input: string | undefined, maxLen = 1000): string {
  if (!input) return '';
  return input.trim().slice(0, maxLen);
}

async function sendTelegram(text: string): Promise<boolean> {
  if (!LEAD_TELEGRAM_BOT_TOKEN || !LEAD_TELEGRAM_CHAT_ID) return false;
  try {
    const url = `https://api.telegram.org/bot${LEAD_TELEGRAM_BOT_TOKEN}/sendMessage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: LEAD_TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'Markdown',
      }),
    });
    return res.ok;
  } catch (e) {
    console.error('Telegram send error:', e);
    return false;
  }
}

export async function POST({ request }: { request: Request }) {
  let form: LeadData = {};

  const contentType = request.headers.get('content-type') ?? '';

  try {
    if (contentType.includes('application/json')) {
      form = await request.json();
    } else {
      const formData = await request.formData();
      form = Object.fromEntries(formData.entries()) as LeadData;
    }
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: 'invalid payload' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const name = sanitize(form.name, 100);
  const phone = sanitize(form.phone, 30);
  const message = sanitize(form.message, 2000);
  const preset = sanitize(form.preset, 200);

  // Validate
  if (!name || !phone) {
    return new Response(JSON.stringify({ ok: false, error: 'name and phone are required' }), {
      status: 422,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Phone format check (RU)
  const phoneDigits = phone.replace(/\D/g, '');
  if (phoneDigits.length < 10 || phoneDigits.length > 15) {
    return new Response(JSON.stringify({ ok: false, error: 'invalid phone' }), {
      status: 422,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });
  const referrer = request.headers.get('referer') ?? '';
  const userAgent = request.headers.get('user-agent') ?? '';

  // Build message text
  const lines = [
    '🔔 *Новая заявка с сайта ИТР Монтаж*',
    '',
    `*Имя:* ${name}`,
    `*Телефон:* ${phone}`,
  ];
  if (message) lines.push(`*Комментарий:* ${message}`);
  if (preset) lines.push(`*Интересует:* ${preset}`);
  lines.push('');
  lines.push(`*Время:* ${timestamp}`);
  if (referrer) lines.push(`*Страница:* ${referrer}`);

  const text = lines.join('\n');

  // Try Telegram first (instant notification)
  const tgOk = await sendTelegram(text);

  // TODO: Здесь можно добавить отправку на email через SMTP-сервис
  // (Resend, SendGrid, Mailgun) когда у брата будет настроенный SMTP.

  // Log to server console for now (will appear in Vercel/Netlify function logs)
  console.log('=== NEW LEAD ===');
  console.log(text);
  console.log('User-Agent:', userAgent);
  console.log('================');

  return new Response(JSON.stringify({
    ok: true,
    delivered: tgOk,
    note: tgOk ? 'Sent to Telegram' : 'Logged (Telegram not configured yet)',
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function GET() {
  return new Response(JSON.stringify({
    ok: true,
    endpoint: '/api/lead',
    methods: ['POST'],
    fields: ['name', 'phone', 'message (optional)', 'preset (optional)'],
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
