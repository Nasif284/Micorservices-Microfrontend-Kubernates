FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src
COPY proto ./proto

EXPOSE 4001 50051

CMD ["node", "src/server.js"]
