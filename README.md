# NestJS Fundamentals

NestJS é um Framework do ecossistema Node.js

- Node.js oferece uma flexibilidade enorme para o desenvolvedor. Esta flexibilidade pode se tornar trabalhosa visto que o desenvolvedor deve definir manualmente tudo o que a aplicação deve ter.
- O framework NestJS abstrai funcionalidades do runtime (typescript, error handling, etc.) para permitir que o desenvolvedor foque majoritariamente no desenvolvimento da aplicação.
- [Nest CLI](https://docs.nestjs.com/cli/overview)
  - Atenção para a flag `--dry-run` nos comandos `nest generate` (ou `nest g` para os íntimos) que auxilia na visualização dos artefatos que serão gerados antes mesmo da geração.

## Modularização da aplicação

- É feita através de **Módulos** cujo papel é:
  - organizar os componentes da aplicação;
  - encapsular lógicas e componentes que fazem parte do mesmo contexto;
  - definir a extensão das suas fronteiras no que tange suas funcionalidades internas e externas.
- Ao criar um controller/service pela CLI do Nest de modo que o `cwd` seja a raiz do projeto, este será automaticamente referenciado no `app.module.ts`.
- Isto não é adequado visto que estes artefatos deveriam estar dentro do seu próprio módulo e somente este último deveria ser referenciado nos `imports` do `app.module.ts`.
- Configuração do módulo (metadados que o Nest utiliza para organizar a aplicação):
  - `controllers`: listagem das rotas da aplicação (`controllers`) que interagem com o módulo em questão;
  - `exports`: listagem de **serviços** que estão disponíveis para todos que utilizam do módulo em questão;
  - `imports`: listagem de todos os **módulos** que o módulo em questão importa;
  - `providers`: listagem de **serviços** que são utilizados no módulo em questão.

### Controllers

- É responsável por amarrar uma requisição HTTP feita para a aplicação à caminhos/funções definidas pelo controller;
- É responsável por manipular requisições para a aplicação, principalmente a validação do formato dos dados para que então possa chamar o **Service**/**Provider** que aplicará as regras de negócio em cima destes valores;
- O vínculo do método HTTP a uma função é feito através de _decorators_ (`@Get()`, `@Post()`, etc.);
- O nome da rota é definido no parâmetro do _decorator_ `@Controller()` e as sub-rotas são definidas nos parâmetros dos _decorators_ dos métodos;
- Os decorators são utilizados não só para vincular os métodos HTTP mas também para obter:
  - o corpo da requisição (`@Body()`);
  - os query params (`@Query()`);
  - e os url params (`@Param()`).
- Os valores que são passados na requisição estão no formato JSON e podem ser obtidos pelo nome das suas chaves:

```typescript
// curl -d '{"name": "Stoninho", "age": 13}' -X POST http://example.com

@Post()
create(@Body('name') name: string) {
  // ...
}
```

#### Data Transfer Objects (DTO)

Uma estratégia muito comum nos _controllers_ é o uso de **Data Transfer Objects (DTOs)** cujo papel é:

- Ser um objeto que encapsula dados e que são enviados de uma ponta a outra;
- Ser uma interface de Inputs e Outputs dentro da aplicação.

> **Importante:** Um DTO não necessariamente representa uma tabela no banco de dados!

DTOs podem ser gerados através do comando:

```bash
nest g class <module>/dto/<action>.dto --no-spec
```

Para auxiliar na transformação destes dados, os **Pipes** podem ser utilizados na aplicação da seguinte maneira:

```typescript
// main.ts

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

No exemplo acima pode ser observado:

- Utilização do `ValidationPipe` que auxilia diretamente no manuseio dos dados vindos da requisição;
- Configuração do `ValidationPipe` em conjunto com os DTOs para não permitir valores que não estejam definidos nos DTOs através do `whitelist` e do `transform`.

### Providers (a.k.a. Services)

- Injetam dependências;
- Lidam com regras de negócio;
- Responsável pelo armazenamento e recuperação de dados.
