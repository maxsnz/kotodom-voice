# Kotodom Voice

Telegram-бот: принимает текст → синтезирует речь через Amazon Polly →
шлёт обратно voice-сообщение.

- **Стек:** Bun (runtime, исполняет TS нативно) + pnpm (install) +
  telegraf + @aws-sdk/client-polly
- **Тип:** worker, long-polling. Нет HTTP, не нужен публичный домен.
- **Состояние:** stateless. Никаких volume / БД.

## Local dev

```bash
pnpm install
cp .env.example .env   # заполнить TELEGRAM_TOKEN, AWS_KEY/SECRET, и т.д.
pnpm dev               # bun --watch src/index.ts
```

### Env переменные

См. `src/config.ts` — там единый source of truth с валидацией. Кратко:

- `TELEGRAM_TOKEN` — от @BotFather
- `AWS_KEY`, `AWS_SECRET` — IAM credentials с правом `polly:SynthesizeSpeech`
- `AWS_LANGUAGE_CODE` (default `ru-RU`)
- `AWS_VOICE_ID` (default `Maxim`) — список доступных голосов:
  <https://docs.aws.amazon.com/polly/latest/dg/available-voices.html>
- `LOGTAIL_TOKEN`, `LOGTAIL_SOURCE` — optional, для Better Stack
- `NODE_ENV` — `production` в проде

## Deploy

Развёрнут на kotodom-сервере (Hetzner) через Ansible
(`deploy/playbook.yml` + общий `kotodom/infra/`). Подробнее — см.
`infra/README.md`.

```bash
make github-key   # one-time: генерим deploy-key и кладём pubkey в GitHub
make setup        # one-time bootstrap: клон, .env, Vector tail
make deploy       # сборка образа + старт контейнера
```
