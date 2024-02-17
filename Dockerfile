FROM node:20.11 AS dev
WORKDIR /app
COPY package*.json ./

RUN apt-get update
RUN apt-get -y install \
    cmake

RUN npm ci --quiet
COPY . .

RUN npm run build
RUN npx prisma generate
COPY . ./

CMD ["npm", "run", "start:dev"]


FROM node:20.11-alpine AS migrate
ARG DATABASE_URL
WORKDIR /app
COPY package*.json ./

RUN npm ci --quiet

COPY . .
RUN npx prisma migrate deploy


FROM migrate as production
ARG DATABASE_URL

EXPOSE 80

CMD ["npm", "run", "start:prod"]