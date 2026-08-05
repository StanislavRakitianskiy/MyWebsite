# Деплой на Vercel

## 1. Проєкт

1. [vercel.com/new](https://vercel.com/new) → Import репозиторію `MyWebsite`.
2. Framework Preset: **Next.js** (визначиться сам). Build-налаштування не чіпати.
3. Гілка `main` → production; кожен PR → preview-деплой автоматично.

## 2. Змінні оточення (Project → Settings → Environment Variables)

Обов'язкові для проду:

| Змінна | Значення |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://ваш-домен` — canonical, hreflang, sitemap, OG |
| `N8N_WEBHOOK_URL` | URL вебхука WF_CONTACT у вашому n8n |
| `N8N_WEBHOOK_SECRET` | довільний секрет; той самий перевіряйте в n8n у заголовку `x-webhook-secret` |
| `RESEND_API_KEY` | ключ [resend.com](https://resend.com) — fallback-канал |
| `CONTACT_EMAIL` | куди падає fallback-лист |

Опційні:

| Змінна | Навіщо |
|---|---|
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` | капча Cloudflare Turnstile; без ключів форма працює без капчі |
| `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` | rate limit між serverless-інстансами. **Без них у проді ліміт діє лише в межах одного інстанса** |
| `RESEND_FROM` | адреса відправника fallback-листа (дефолт — onboarding@resend.dev) |

Порожній рядок = «не задано» (див. `src/lib/env.ts`).

## 3. Домен

1. Project → Settings → Domains → Add → ваш домен.
2. У реєстратора: A-запис `76.76.21.21` або CNAME `cname.vercel-dns.com` (Vercel покаже точні значення). SSL — автоматично.
3. Оновіть `NEXT_PUBLIC_SITE_URL` на фінальний домен і зробіть redeploy.
4. `https://домен/sitemap.xml` → додати в Google Search Console.

## 4. n8n: вебхук WF_CONTACT

1. Webhook-нода: POST, шлях `/webhook/contact`.
2. Перша IF-нода: `{{ $json.headers["x-webhook-secret"] }}` дорівнює секрету → інакше 403.
3. Далі за архітектурою §8: Telegram-повідомлення вам → рядок у Google Sheets → автовідповідь клієнту.
4. Payload: `{ name, contact, message, budget?, locale, submittedAt, ip }`.

## 5. Перевірка після деплою

- `/` і `/en` віддаються, перемикачі мови/теми працюють;
- `curl -I https://домен` → усі security-заголовки з `next.config.ts`;
- форма: тестова заявка → Telegram; вимкніть workflow у n8n → заявка має прийти листом (fallback);
- OG: вставте URL у [opengraph.xyz](https://www.opengraph.xyz) — картинка з ім'ям кирилицею;
- Lighthouse по проду: ціль ≥ 98/100/100/100.

## 6. Бандл і бюджети (заміри фази 6)

Замір по мережі (gzip, прод-білд): HTML 11.3KB · CSS 6.4KB · JS 157KB ·
шрифти 104KB · **разом ~280KB** (бюджет §12 — до 700KB ✓). Форма
(react-hook-form + zod) у First Load не входить — довантажується при
наближенні до секції контактів.

JS-розбивка: ~115KB — базовий рантайм React 19 + Next.js 16 (App Router),
~42KB — next-intl, next-themes і код застосунку. Ціль §12 «до 90KB» на
App Router недосяжна в принципі (сам фреймворк важчий); фактичний
Lighthouse Performance 98 — ціль якості виконана.

Аналіз бандла: `ANALYZE=true npm run build -- --webpack` (плагін
@next/bundle-analyzer несумісний з Turbopack) або інтерактивно
`npx next experimental-analyze`.
