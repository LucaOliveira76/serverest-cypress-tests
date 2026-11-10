# ServeRest Cypress Tests

[Read in English](README.md)

Suíte de testes automatizados para o [ServeRest](https://serverest.dev/) (API) e seu [frontend](https://front.serverest.dev/), construída com Cypress e JavaScript.

- **3 specs de API, 8 testes** (usuários, login, produtos)
- **3 specs E2E, 5 testes** (cadastro, login, gestão de produtos como admin)
- Cenários positivos e negativos onde a aplicação permite

## Requisitos

- Node.js 22, 24 ou 26 (as versões suportadas pelo Cypress 16)
- npm

## Como executar

```bash
npm ci
```

| Comando              | O que faz                                 |
| -------------------- | ----------------------------------------- |
| `npm run cy:run`     | Executa a suíte completa em modo headless |
| `npm run cy:run:api` | Executa somente as specs de API           |
| `npm run cy:run:ui`  | Executa somente as specs E2E              |
| `npm run cy:open`    | Abre o runner interativo                  |
| `npm run lint`       | Executa o ESLint                          |
| `npm run format`     | Formata o código com o Prettier           |

### Apontando a suíte para outro ambiente

A URL da API é um valor público exposto por meio de `Cypress.expose()`. Para sobrescrevê-la, use a linha de comando:

```bash
npm run cy:run:api -- --expose apiUrl=http://localhost:3000
```

A URL do frontend é o `baseUrl` em `cypress.config.js`. A suíte não precisa de segredos, por isso não existe arquivo `.env`.

## Estrutura do projeto

```
cypress/
  e2e/
    api/        users.cy.js, login.cy.js, products.cy.js
    ui/         register.cy.js, login.cy.js, product.cy.js
  support/
    factories/  userFactory.js, productFactory.js
    pages/      RegisterPage.js, LoginPage.js, ProductPage.js
    services/   userService.js, authService.js, productService.js
    commands.js deleteUserByEmail, deleteProductByName, loginAs
    e2e.js      carrega os comandos customizados
  fixtures/     product.png (imagem 1x1 para o campo de upload)
.github/workflows/cypress.yml
```

## Cenários de teste

### API

| Spec     | Cenário                              | Resultado esperado                        |
| -------- | ------------------------------------ | ----------------------------------------- |
| Usuários | Criar usuário com dados válidos      | 201, mensagem de sucesso, `_id` retornado |
| Usuários | Criar usuário com e-mail duplicado   | 400, mensagem de e-mail já utilizado      |
| Usuários | Criar usuário com payload inválido   | 400, mensagens de erro por campo          |
| Login    | Login com credenciais válidas        | 200, token `Bearer` retornado             |
| Login    | Login com senha incorreta            | 401, mensagem genérica, sem token         |
| Produtos | Admin cria um produto                | 201, `_id` retornado                      |
| Produtos | Criar produto sem token              | 401                                       |
| Produtos | Criar produto como usuário não admin | 403                                       |

### E2E

| Spec             | Cenário                        | Resultado esperado                                                 |
| ---------------- | ------------------------------ | ------------------------------------------------------------------ |
| Cadastro         | Cadastrar novo usuário         | Redireciona para `/home`, usuário persistido (verificado pela API) |
| Cadastro         | Cadastrar e-mail duplicado     | Alerta exibido, usuário permanece no formulário                    |
| Login            | Login com credenciais válidas  | Redireciona para `/home`                                           |
| Login            | Login com senha incorreta      | Alerta exibido, usuário permanece em `/login`                      |
| Produtos (admin) | Criar produto e vê-lo na lista | Redireciona para a lista, linha do produto visível                 |

## Decisões técnicas

- **Arquitetura em camadas.** As specs descrevem apenas o comportamento. Seletores ficam nos Page Objects, chamadas HTTP nos services e dados de teste nas factories. Uma mudança na interface ou na API é corrigida em um único arquivo.
- **Padrões de projeto.** Page Object, Factory, camada de Service e comandos customizados.
- **Massa de dados.** Usuários e produtos são gerados com Faker e têm valores únicos a cada execução. Dados fixos colidiriam em um servidor público compartilhado.
- **Isolamento e limpeza.** Cada spec cria o que precisa pela API e remove ao final, mesmo quando um teste falha. Usuários criados pela interface são removidos por e-mail, e produtos por nome exato (a correspondência exata protege os dados de terceiros no catálogo compartilhado).
- **O setup é validado.** As etapas de preparação usam asserções com rótulo, então um setup quebrado falha na origem e não como um erro confuso mais adiante.
- **Sem esperas fixas.** Não existe `cy.wait(ms)` em lugar nenhum. O Cypress repete cada asserção até que passe ou expire o tempo limite.
- **Asserções.** Os testes de API verificam status, mensagem e formato do corpo. Em falhas de validação, verificam os erros por campo, para que um 400 pelo motivo errado não passe. Os testes E2E verificam a URL, o estado visível e a persistência pela API.
- **Seletores.** `data-testid` onde a aplicação fornece. Onde não fornece, `role="alert"` para mensagens e o texto da linha para a lista de produtos.
- **Sessões.** `cy.session()` guarda em cache o login do admin na spec de produtos, e o identificador da sessão é o e-mail, para que nenhuma senha apareça no log de comandos.
- **Retentativas.** Duas retentativas somente no modo `run`. Falhas em hooks `before` nunca são repetidas.
- **Configuração do Cypress 16.** Valores públicos usam `Cypress.expose()`. O `cy.env()` é o canal para segredos, caso a suíte venha a precisar deles.

## CI/CD

O workflow do GitHub Actions é executado em pushes para `main`, pull requests e disparo manual. Ele instala com `npm ci` e depois executa lint, specs de API e specs E2E, nessa ordem. Os screenshots são enviados como artefato somente quando uma etapa falha.

