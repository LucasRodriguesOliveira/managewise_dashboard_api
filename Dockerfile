FROM node:20-alpine3.17

ARG ENV
ARG DB_PORT

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

CMD ["yarn", "start:dev"]

