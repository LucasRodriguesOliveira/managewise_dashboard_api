# Manage Wise Dashboard API
<p align="center">
  <img src="https://img.shields.io/badge/Node.js-v20-%23fbfbfb?logo=nodedotjs&color=%2345a955" />
  <img src="https://img.shields.io/badge/Nest.js-v10-%234555a9?logo=nestjs&color=%23E0234E" />
  <img src="https://img.shields.io/badge/platform--express-v10-%23fbfbfb?logo=express&color=%23000000" />
  <img src="https://img.shields.io/badge/Typescript-v5.1.3-%234555a9?logo=typescript&color=%233178C6" />
  <img src="https://img.shields.io/badge/prisma-v5.7.0-%23fbfbfb?logo=prisma&color=2D3748" />
  <img src="https://img.shields.io/badge/PostgreSQL-v16.1-%23fbfbfb?logo=postgresql&color=%234169E1" />
  <img src="https://img.shields.io/badge/Redis-v7.2.3-%23fbfbfb?logo=redis&color=%23DC382D" />
  <img src="https://img.shields.io/badge/Docker-v24.0.7-%23fbfbfb?logo=docker&color=%232496ED" />
  <img src="https://img.shields.io/badge/swagger-v7.1.16-%23fbfbfb?logo=swagger&color=%2385EA2D" />
  <img src="https://img.shields.io/badge/class--validator-v0.14.0-%23fbfbfb?color=%23000000" />
  <img src="https://img.shields.io/badge/class--transformer-v0.5.1-%23fbfbfb?color=%23000000" />
  <img src="https://img.shields.io/badge/joi-v17.11-%23fbfbfb?color=%23000000" />
  <img src="https://img.shields.io/badge/jest-v29.5-%23fbfbfb?logo=jest&color=%23C21325" />
  <img src="https://img.shields.io/badge/Compodoc-v1.1.233-%234555a9" />
</p>

## Description

Uma API para gerenciamento do dashboard e contratos da aplicação ManageWise

## Installation

Para rodar a aplicação em docker, pode ser executada com:
```bash
$ docker compose up
```
Adicione a flag `--build` caso seja a primeira execução ou queira recriar o container

Caso seja a primeira vez executando a aplicação, será necessário gerar as migrations e sincronizar

Para executar no docker, abra outro terminal e consulte o ID do container:
`docker ps`

irá retornar uma lista de containers em execução, basta copiar o ID do container que tem como nome `managewise_dashboard_api-api`

No meu caso, o resultado de `docker ps` é este
| CONTAINER ID | IMAGE | COMMAND | CREATED | STATUS | PORTS | NAMES
| --- | --- | --- | --- | --- | --- | --- |
| 1517231d8eb8 | managewise_dashboard_api-api | "docker-entrypoint.s…" | 3 minutes ago | Up 3 minutes | 0.0.0.0:3000->3000/tcp, :::3000->3000/tcp | managewise_dashboard_api-api-1 |
| 0cff098d9aee | postgres:16.1-alpine3.19 | "docker-entrypoint.s…" | 3 minutes ago | Up 3 minutes | 0.0.0.0:5432->5432/tcp, :::5432->5432/tcp | managewise_dashboard_api-db-1 |
| 44b6b95d4762 | redis:7.2.3-alpine | "docker-entrypoint.s…" | 3 minutes ago | Up 3 minutes | 0.0.0.0:6379->6379/tcp, :::6379->6379/tcp | managewise_dashboard_api-redis-1 |

Portanto, no meu caso, `1517231d8eb8` é o ID que preciso do container `managewise_dashboard_api-api`

Agora apenas é necessário rodar o comando `exec`:

- yarn migrate
`docker exec -it 1517231d8eb8 yarn prisma migrate dev --name init`

- yarn generate
`docker exec it 1517231d8eb8 yarn generate`

## Test

Testes unitários podem ser executados localmente

```bash
# unit tests
$ yarn run test
```

## License

ManageWise is [MIT licensed](LICENSE).
