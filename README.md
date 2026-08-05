# Персональний сайт — Станіслав Ракітянський

Портфоліо: автоматизація бізнес-процесів (n8n, ШІ-агенти) та веб-розробка.

## Стек

- [Next.js](https://nextjs.org) (App Router, TypeScript, Turbopack)
- [Tailwind CSS v4](https://tailwindcss.com) — дизайн-токени в `src/app/globals.css`
- [next-intl](https://next-intl.dev) — локалі `uk` (за замовчуванням, без префікса) та `en` (`/en`)
- [next-themes](https://github.com/pacocoursey/next-themes) — світла/темна тема без FOUC
- Шрифти Inter + Manrope через `next/font` (latin + cyrillic)

## Структура

```
messages/            переклади (uk.json, en.json)
src/i18n/            routing, request config, навігація next-intl
src/proxy.ts         локалізаційний proxy (middleware)
src/app/[locale]/    layout і сторінки
src/components/      ThemeProvider, ThemeToggle, LocaleSwitcher
src/components/ui/   Container, Button, Eyebrow, SectionHeading
```

## Команди

```bash
npm run dev     # дев-сервер
npm run build   # продакшн-збірка (обидві локалі пререндеряться статично)
npm run start   # продакшн-сервер
npm run lint    # eslint
```

## Форма зворотного зв'язку

`POST /api/contact` — єдина динамічна точка: honeypot → Zod-валідація →
Turnstile (опційно) → rate limit → n8n-вебхук → fallback-лист через Resend.
Змінні оточення — у `.env.example`.

## CI та деплой

GitHub Actions (`.github/workflows/ci.yml`): lint + typecheck + build на
кожен PR і push у main. Деплой на Vercel з доменом і чеклистом —
`docs/deploy.md`. Код-ревью відповідності архітектурі —
`docs/architecture-review.md`.
