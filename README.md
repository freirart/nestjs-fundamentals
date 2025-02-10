# NestJS Fundamentals

NestJS é um Framework do ecossistema Node.js

- Node.js oferece uma flexibilidade enorme para o desenvolvedor. Esta flexibilidade pode se tornar trabalhosa visto que o desenvolvedor deve definir manualmente tudo o que a aplicação deve ter.
- O framework NestJS abstrai funcionalidades do runtime (typescript, error handling, etc.) para permitir que o desenvolvedor foque majoritariamente no desenvolvimento da aplicação.

[Funcionalidades básicas de CRUD com um banco de dados falso e tratamento de erros](https://github.com/freirart/nestjs-fundamentals/commit/74b1a815ca60164cdfd3ff1b8acdbcb8b2e622e3)

## Modularização da aplicação

- Ao criar um controller/service pela CLI do Nest de modo que o cwd seja a raiz do projeto, este será automaticamente referenciado no `app.module.ts`.
- Isto não é adequado visto que estes artefatos deveriam estar dentro do seu próprio módulo e somente este último deveria ser referenciado nos `imports` do `app.module.ts`.
- Configuração do módulo (metadados que o Nest utiliza para organizar a aplicação):
  - `controllers`: listagem das rotas da aplicação (`controllers`) que interagem com o módulo em questão;
  - `exports`: listagem de **serviços** que estão disponíveis para todos que utilizam do módulo em questão;
  - `imports`: listagem de todos os **módulos** que o módulo em questão importa;
  - `providers`: listagem de **serviços** que são utilizados no módulo em questão.
