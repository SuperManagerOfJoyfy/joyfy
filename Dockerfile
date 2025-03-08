#Устанавливаем зависимости
FROM node:20.11-alpine as dependencies
WORKDIR /app

# Копируем package.json и lock-файл
COPY package.json pnpm-lock.yaml ./

# Устанавливаем pnpm и зависимости проекта
RUN npm install -g pnpm && pnpm install --frozen-lockfile

#Билдим приложение
#Кэширование зависимостей — если файлы в проекте изменились,
#но package.json остался неизменным, то стейдж с установкой зависимостей повторно не выполняется, что экономит время.
FROM node:20.11-alpine as builder
WORKDIR /app

# Устанавливаем pnpm в билдере, чтобы была возможность запустить билд
RUN npm install -g pnpm

# Копируем весь проект и зависимости из предыдущего этапа
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules


# Запускаем билд в production-режиме
RUN pnpm run build:production


#Стейдж запуска
FROM node:20.11-alpine as runner
WORKDIR /app
ENV NODE_ENV production

# Копируем всё приложение из builder-стадии
COPY --from=builder /app/ ./

# Открываем порт, на котором будет работать приложение
EXPOSE 3000

# 📌 Если есть standalone-сервер → запускаем его, иначе → next start
CMD ["sh", "-c", "if [ -f server.js ]; then node server.js; else node node_modules/next/dist/bin/next start; fi"]