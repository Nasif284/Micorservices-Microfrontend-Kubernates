FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
COPY src ./src
COPY proto ./proto

RUN npx prisma generate

EXPOSE 4002

CMD ["sh", "-c", "npx prisma migrate deploy && node src/server.js"]
