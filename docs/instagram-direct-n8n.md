# Instagram Direct → n8n (AI-консультант)

Підключення вхідних повідомлень Instagram Direct до локального n8n (Docker + ngrok) з AI-агентом,
який консультує по асортименту, оформлює замовлення і передає складні питання менеджеру.

Workflow: [`n8n/Instagram_Direct.json`](../n8n/Instagram_Direct.json)

## Як це працює

```
Клієнт в Instagram Direct
        │
        ▼
Meta (Instagram Webhooks)  ──POST──►  https://<ngrok>/webhook/instagram
        ▲                                        │
        │                                        ▼
        │                              n8n: Respond 200 (одразу)
        │                                        │
        │                                        ▼
        │                              Parse IG Event (фільтр echo/не-текст)
        │                                        │
        │                                        ▼
        │                              AI Agent ── Clothing / Delivery / Handoff
        │                                        │
        └──── POST /me/messages ◄────── Send IG Reply
```

Один URL обслуговує і верифікацію (**GET**), і події (**POST**) — Meta вимагає саме так.

## 0. Передумови

| Що | Стан |
|---|---|
| Instagram професійний акаунт (Business/Creator) | є — `stanislav_rakitianskyi`, `user_id` `17841424168274664` |
| Meta app з продуктом Instagram | створений, дозволи `instagram_business_basic` / `manage_comments` / `manage_messages` додані |
| Instagram Tester роль | видана й прийнята |
| **Другий** Instagram-акаунт для тестів | **потрібен** — самому собі в Direct не напишеш |
| n8n у Docker + ngrok | є |
| Sub-workflows `Clothing`, `Delivery`, `Handoff` | є в інстансі, ID уже прописані в JSON |

## 1. ngrok + n8n

Безкоштовний ngrok дає один **статичний** домен — беріть його, інакше після кожного рестарту
доведеться міняти Callback URL у Meta.

```bash
ngrok http --domain=your-name.ngrok-free.app 5678
```

n8n має знати свою публічну адресу, інакше він реєструє вебхуки на `localhost`:

```yaml
# docker-compose.yml
services:
  n8n:
    image: n8nio/n8n:latest
    restart: unless-stopped
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=your-name.ngrok-free.app
      - N8N_PROTOCOL=https
      - N8N_PORT=5678
      - WEBHOOK_URL=https://your-name.ngrok-free.app/
      - N8N_EDITOR_BASE_URL=https://your-name.ngrok-free.app/
      - GENERIC_TIMEZONE=Europe/Kyiv
    volumes:
      - n8n_data:/home/node/.n8n

volumes:
  n8n_data:
```

`docker compose up -d` і перевірка знадвору:

```bash
curl https://your-name.ngrok-free.app/healthz     # {"status":"ok"}
```

У полі Webhook-ноди має відображатися ngrok-домен, а не `localhost:5678`.

## 2. Токен доступу в Meta

App Dashboard → **Instagram** → *API setup with Instagram login*:

1. **Крок 2 «Generate access tokens»** → напроти акаунта натиснути **Generate token** → скопіювати
   `IGAA…`. Це long-lived IG User token на **60 днів**.
2. Перевірити токен:

   ```bash
   curl "https://graph.instagram.com/v26.0/me?fields=user_id,username&access_token=IGAA..."
   ```

3. **App roles → Add People → Instagram Tester** — додати **другий** (тестовий) акаунт і прийняти
   інвайт у ньому: Instagram → Settings → *Apps and websites* → *Tester invites*. У Development mode
   Meta доставляє події лише для акаунтів, що мають роль у застосунку.

## 3. Дозвіл у застосунку Instagram

Найчастіша причина «верифікація пройшла, а повідомлення не приходять». У мобільному Instagram
бізнес-акаунта: **Settings and privacy → Messages and story replies → Connected tools →
Allow access to messages → ON**.

## 4. Імпорт workflow у n8n

1. n8n → **Import from File** → `n8n/Instagram_Direct.json`.
2. Створити credential **Header Auth**:
   - Name: `Authorization`
   - Value: `Bearer IGAA…`

   Вибрати його в нодах `Send IG Reply`, `Send IG Unsupported`, `Typing On (optional)`.
3. У ноді **`Token Valid?`** замінити `CHANGE_ME_VERIFY_TOKEN` на власний рядок
   (наприклад `ig_direct_2026_stas`) — його ж введете в Meta.
4. Перевірити, що в нодах `Clothing` / `Delivery` / `Handoff` підтягнулися відповідні sub-workflows,
   а в `Handoff` `id_client` — ваш Telegram ID для сповіщень менеджера.
5. **Activate** (тумблер справа вгорі).

Production URL: `https://your-name.ngrok-free.app/webhook/instagram`

> Test URL (`/webhook-test/…`) живе лише один запит після натискання *Test workflow* — Meta з ним
> верифікацію не пройде. Для Meta завжди production URL + активний workflow.

## 5. Вебхук у Meta

Instagram → *API setup with Instagram login* → **Configure webhooks**:

| Поле | Значення |
|---|---|
| Callback URL | `https://your-name.ngrok-free.app/webhook/instagram` |
| Verify token | той самий рядок, що в ноді `Token Valid?` |

> **Не переплутай два секрети** — це найпоширеніша помилка на цьому кроці.
>
> | | Verify token | Access token (`IGAA…`) |
> |---|---|---|
> | Хто придумує | **ти сам**, довільний рядок | Meta видає кнопкою *Generate token* |
> | Для чого | Meta один раз доводить, що URL твій | підпис кожного запиту на **відправку** повідомлення |
> | Де живе | поле «Verify token» у Meta **+** нода `Token Valid?` | credential **Header Auth**: `Authorization` = `Bearer IGAA…` |
>
> Якщо вставити `IGAA…` у поле «Verify token», n8n відповість `403 Forbidden`, а Meta покаже
> «The callback URL or verify token couldn't be validated».

**Verify and save** → Meta робить GET з `hub.mode`, `hub.verify_token`, `hub.challenge`, n8n
повертає `hub.challenge` тілом відповіді з кодом 200.

Далі:
1. Підписатися на поле **`messages`** (за бажанням `messaging_postbacks`, `message_reactions`).
2. У кроці 2 напроти акаунта перемкнути **Webhook Subscription** → **On** (на скріншоті було `Off` —
   без цього події не йдуть).

## 6. Тест

З другого Instagram-акаунта написати в Direct на `@stanislav_rakitianskyi`, наприклад
«Привіт, є худі розмір M?».

Очікувано: у n8n → **Executions** з'являється виконання `Instagram Direct`, а в Direct — відповідь
агента до 100 символів. Далі можна пройти повний сценарій до оформлення замовлення — тоді
`Delivery` запише рядок у Data Table `Direct_Client` і надішле картку замовлення в Telegram.

## Діагностика

| Симптом | Причина | Рішення |
|---|---|---|
| Meta: *The URL couldn't be validated*, в інспекторі ngrok `403 Forbidden` | verify token не збігається (часто туди вставляють access token) | звірити рядок у ноді `Token Valid?` з полем у Meta |
| Meta: *The URL couldn't be validated*, в інспекторі `404 … is not registered` | воркфлоу не активований або в Meta вказано test-URL | активувати воркфлоу, у Callback URL прибрати `-test` |
| Верифікація ок, але подій немає | вимкнено *Allow access to messages*; не підписано поле `messages`; `Webhook Subscription` = Off | пройти кроки 3 і 5 |
| Executions є, клієнт нічого не отримує | протермінований токен, немає `instagram_business_manage_messages`, вихід за 24-годинне вікно | відкрити відповідь ноди `Send IG Reply` — Meta пише причину в `error.message` |
| `OAuthException` code `190` | токен недійсний/відкликаний | згенерувати новий токен, оновити credential |
| Бот відповідає сам собі по колу | не відфільтровано echo власних повідомлень | `Parse IG Event` уже відкидає `is_echo` — не прибирати |
| Клієнт отримує дублі | Meta не дочекалася 200 і ретраїть доставку | `Respond 200` мусить стояти **перед** обробкою (як у цьому workflow) |
| Після рестарту ngrok усе відвалилось | змінився домен | статичний домен ngrok; або оновити Callback URL і `WEBHOOK_URL` |
| Порожні поля в замовленні | тул `Delivery` передає не всі 9 полів | див. розділ нижче |

Корисне для розбору: `docker compose logs -f n8n`, веб-інспектор ngrok на `http://127.0.0.1:4040`
(видно кожен запит Meta і що саме відповів n8n).

## Кнопка «Test» у дашборді Meta

Meta надсилає власний тестовий payload у форматі `entry[].changes[]` з `field: "messages"`, тоді як
реальні повідомлення Instagram Direct приходять як `entry[].messaging[]`. `Parse IG Event` розуміє
обидві форми, тож кнопкою можна перевірити ланцюг до агента, не чекаючи живого клієнта. Остання
нода `Send IG Reply` при цьому впаде — у тестовому payload `sender.id` вигаданий (`12334`), і Meta
не знаходить такого користувача. Це нормально: усе до неї вже підтверджено.

## Обмеження тестового формату

- **Development mode** — переписуватися можна лише з акаунтами, що мають роль у застосунку. Для
  зовнішніх клієнтів потрібні App Review з Advanced Access на `instagram_business_manage_messages`
  і Business Verification.
- **24-годинне вікно** — відповідати можна протягом 24 годин після повідомлення клієнта; поза ним
  лише через тег `human_agent`.
- **1000 символів** на одне повідомлення (у workflow текст ріжеться до 990 з запасом).
- **Токен на 60 днів** — оновлення без переходу в дашборд:

  ```bash
  curl "https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=IGAA..."
  ```

  Можна автоматизувати окремим workflow зі Schedule Trigger раз на місяць.
- **Simple Memory** тримає контекст у пам'яті процесу — після рестарту контейнера діалоги
  «забуваються». Для продакшну — Postgres Chat Memory (Postgres-credential уже є в інстансі).
- **Підпис запитів.** Meta підписує кожен POST заголовком `X-Hub-Signature-256` (HMAC-SHA256 від
  raw body з App Secret). Для демо не критично, для проду — увімкнути `Raw Body` у Webhook-ноді та
  звіряти підпис нодою **Crypto** перед обробкою.

## Знайдені баги в наявних workflow

Виправлені в `Instagram_Direct.json`, але в `Consultant` (Telegram) лишаються:

1. **`Clothing` не шукає.** Тул передає поле `name`, а sub-workflow `Clothing` очікує
   `Найменування` — у PGVector потрапляє `undefined`, тобто пошук по асортименту фактично не
   працює. У IG-версії передається `Найменування` (ключ `$fromAI` при цьому мусить бути
   латиницею — `query`).
2. **`Delivery` отримує 3 поля з 9.** Тул передає лише `city`, `phone_number`, `mail_number`, а
   trigger чекає ще `customer_name`, `items_name`, `items_size`, `items_quantity`, `items_price`,
   `items_total_price` → у Telegram-картці й у Data Table порожні товари та ПІБ. У IG-версії
   передаються всі 9.
3. **Пам'ять не працює.** `sessionKey` = `message.message_id`, який унікальний для **кожного**
   повідомлення, тож кожна реплика починає діалог з нуля. Ключем має бути ідентифікатор
   співрозмовника: `message.chat.id` для Telegram, `sender_id` (IGSID) для Instagram.
