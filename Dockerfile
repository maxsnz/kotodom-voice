FROM oven/bun:1.3.13-debian

WORKDIR /usr/src/app

# pnpm для install — детерминированный lock и аккуратная обработка peer
# deps. Bun используется как runtime: исполняет TypeScript нативно,
# `tsx`/`ts-node` не нужны.
RUN bun install -g pnpm@10.33.4

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --prod

COPY . .

CMD ["bun", "src/index.ts"]
