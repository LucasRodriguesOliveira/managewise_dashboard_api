FROM node:20-alpine3.17

ARG ENV
ARG DB_PORT
ARG DATABASE_URL

ENV NODE_ENV=${ENV:-development}

RUN echo DATABASE_URL

WORKDIR /app

COPY package.json .
COPY nest-cli.json .
COPY tsconfig.* .
COPY /prisma ./prisma

RUN yarn

COPY /src ./src

EXPOSE ${API_PORT}

RUN yarn prisma generate

CMD ["yarn", "start:dev"]

