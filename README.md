# ИТР Монтаж — сайт дилера септиков

Сайт дилера ИТР по продаже и монтажу септиков и автономных очистных систем
в Москве и МО. Завод-партнёр Малахит + 18 ведущих брендов.

## Технологии

- **Astro 7** — статический сайт-генератор
- **Tailwind CSS 4** — стили
- **React 19** (для интерактивных островов, опционально)
- **@astrojs/sitemap** — автоматическая sitemap
- **TypeScript** — строгая типизация (Content Collections)

## Структура

```
src/
├── content/septic/         # Каталог септиков (Markdown)
├── content/services/       # Услуги (Markdown)
├── content/articles/       # Статьи блога (Markdown, в планах)
├── components/              # Astro-компоненты (Header, Footer, LeadForm, SepticCard)
├── layouts/BaseLayout.astro
├── pages/
│   ├── index.astro         # Главная
│   ├── catalog.astro       # Каталог с фильтрами
│   ├── catalog/[slug].astro # Карточка модели
│   ├── services.astro      # Список услуг
│   ├── services/[slug].astro # Карточка услуги
│   ├── portfolio.astro     # Наши работы
│   ├── about.astro         # О компании
│   ├── faq.astro           # Вопрос-ответ
│   ├── contacts.astro      # Контакты
│   ├── privacy.astro       # Политика конфиденциальности
│   ├── 404.astro
│   └── api/lead.ts         # Endpoint для формы заявки
└── styles/global.css
worklog/                    # Папка для материалов и контекста работы
public/
├── favicon.svg
└── robots.txt
```

## Локальный запуск

```bash
npm install
npm run dev
```

Откроется на http://localhost:4321

## Билд

```bash
npm run build       # → /dist
npm run preview     # локальный предпросмотр билда
```

## Деплой

Рекомендуемые хостинги (бесплатно для статичных сайтов с serverless-функциями):
- **Vercel** — лучший вариант, есть нативная поддержка Astro, serverless-функции для /api/lead
- **Netlify** — альтернатива
- **Cloudflare Pages** — альтернатива

## Настройка формы заявки

В `src/pages/api/lead.ts` нужно подставить:
- `LEAD_EMAIL` — реальный email для получения заявок
- `LEAD_TELEGRAM_BOT_TOKEN` и `LEAD_TELEGRAM_CHAT_ID` — для отправки уведомлений в Telegram (опционально)

Без этих переменных форма логирует заявку в консоль — нужно проверить логи в dashboard хостинга.

## Добавление новой модели септика

1. Создать файл `src/content/septic/<slug>.md`
2. Заполнить frontmatter по схеме в `src/content.config.ts`
3. Написать описание в теле Markdown
4. Запустить `npm run build` — страница появится автоматически

## TODO (что нужно уточнить)

- [ ] Бренд-название компании дилера (сейчас плейсхолдер «ИТР Монтаж»)
- [ ] Реальный телефон, email
- [ ] Домен (сейчас плейсхолдер itr-montazh.ru в astro.config.mjs)
- [ ] Логотип (сейчас текстовый)
- [ ] Реальные фото объектов в /public/images/portfolio/
- [ ] Реальные фото моделей в карточки каталога
- [ ] Реальные характеристики моделей (сейчас демо-данные)
- [ ] Telegram-бот для заявок (опционально)
- [ ] Реальные отзывы клиентов
