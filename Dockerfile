# --- Сборка ---
FROM node:24-slim AS build
WORKDIR /app

# Сначала только список зависимостей: пока он не меняется,
# Docker берёт установленные пакеты из кэша и не ставит их заново
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# Теперь весь проект — и собираем
COPY . .
RUN npm run build

# --- Запуск ---
FROM node:24-slim
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    NUXT_DATABASE_URL=file:/data/wishlist.db \
    NUXT_UPLOADS_DIR=/data/uploads

# Из сборки берём только готовое приложение и миграции
COPY --from=build /app/.output ./.output
COPY --from=build /app/server/db/migrations ./server/db/migrations
COPY --from=build /app/node_modules/@libsql ./.output/server/node_modules/@libsql
COPY --from=build /app/node_modules/@img ./.output/server/node_modules/@img

# База и фото живут в папке /data — к ней подключим постоянный диск
RUN mkdir /data && chown node:node /data

# Запускаем не от администратора, а от обычного пользователя node
USER node
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]