# SoftCards API 🃏

**API RESTful para o** **SoftCards** **, um sistema de estudos baseado em flashcards com repetição espaçada. Este projeto foi desenvolvido com foco em boas práticas de engenharia de software, arquitetura limpa e segurança, demonstrando as competências necessárias para uma posição de Desenvolvedor(a) Backend.**

## 🚀 Features

* **🔐 Autenticação e Autorização:**
  * **Registro de novos usuários com senha criptografada (**`bcrypt`).
  * **Login seguro retornando um** **JSON Web Token (JWT)** **.**
  * **Middleware para proteção de rotas, garantindo que apenas usuários autenticados possam acessar seus próprios recursos.**
* **📚 Gerenciamento de Conteúdo:**
  * **CRUD** completo para **Decks** (baralhos de estudo).
  * **CRUD** completo para  **Flashcards** **, sempre associados a um deck específico.**
  * **Lógica de negócio que garante que um usuário só pode gerenciar seus próprios decks e cards.**
* **📄 Documentação de API:**
  * **Documentação completa e interativa com** **Swagger (OpenAPI)** **.**
  * **Endpoint**  `/api-docs` para visualizar e testar todos os endpoints da API.
* **🛡️ Segurança e Performance:**
  * `helmet`: Adiciona cabeçalhos de segurança HTTP para proteger contra vulnerabilidades comuns.
  * `express-rate-limit`: Protege contra ataques de força bruta e negação de serviço.
  * `compression`: Comprime as respostas HTTP com Gzip para melhor performance.
  * `morgan`: Logs detalhados de requisições em ambiente de desenvolvimento.
  * `express-validator`: Validação e sanitização robusta dos dados de entrada.
* **🏗️ Arquitetura Profissional:**
  * **Padrão MVC + Services** para separação clara de responsabilidades.
  * **Controllers** **: Gerenciam o fluxo de requisição e resposta.**
  * **Services** **: Abstraem e centralizam a lógica de negócio.**
  * **Models** **: Definem os schemas de dados com Mongoose.**
  * **Routes** **: Mapeiam os endpoints para os controllers.**
  * **Middlewares** **: Centralizam funcionalidades transversais como autenticação e tratamento de erros.**
  * **Tratamento de Erros** **: Middleware global que captura erros assíncronos, evitando que o servidor quebre.**

## 🛠️ Stack de Tecnologia

* **Backend:** Node.js
* **Framework:** Express.js
* **Banco de Dados:** MongoDB (com Mongoose ODM)
* **Autenticação:** JSON Web Token (JWT)
* **Validação:** express-validator
* **Documentação:** Swagger UI
* **Segurança:** Helmet, Express Rate Limit
* **Testes:** Jest, Supertest (a ser implementado)

## ⚙️ Primeiros Passos

**Siga as instruções abaixo para configurar e rodar o projeto localmente.**

### Pré-requisitos

* [Node.js](https://nodejs.org/ "null") (versão 18.x ou superior)
* [MongoDB](https://www.mongodb.com/try/download/community "null") (ou uma instância no MongoDB Atlas)
* **Um gerenciador de pacotes como** `npm` ou `yarn`.

### Instalação

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/seu-usuario/softcards-api.git
   cd softcards-api

   ```
2. **Instale as dependências:**

   ```bash
   npm install

   ```
3. **Configure as variáveis de ambiente:**

   * **Crie um arquivo** ` .env` na raiz do projeto, baseado no arquivo `env_example` (se houver) ou crie um do zero.
   * **Adicione as seguintes variáveis:**
     ```
     # Porta da aplicação
     PORT=3000

     # String de conexão do MongoDB
     MONGO_URI=mongodb://localhost:27017/softcards

     # Segredo para gerar os tokens JWT
     JWT_SECRET=seu_segredo_super_secreto
     # Segredo para gerar os refresh tokens
     JWT_REFRESH_SECRET=outro_segredo_super_secreto
     ```

### Executando a Aplicação

**Para iniciar o servidor em modo de desenvolvimento, execute:**

```
npm start

```

**O servidor estará rodando em**`http://localhost:3000`.

## 🐳 Executando com Docker

Se preferir utilizar Docker para gerenciar o ambiente, siga os passos abaixo:

### Pré-requisitos

* [Docker](https://www.docker.com/)
* [Docker Compose](https://docs.docker.com/compose/)

### Instruções

1. **Clone o repositório (se ainda não fez):**

```bash
  git clone https://github.com/seu-usuario/softcards-api.git
  cd softcards-api
```

2. **Configure as variáveis de ambiente:**

* Crie o arquivo `.env` conforme instruções anteriores.
* **Importante:** A variável `MONGO_URI` deve apontar para o nome do serviço do MongoDB definido no `docker-compose.yml`, que é `mongo`.

```
  # .env para Docker
  PORT=3000
  MONGO_URI=mongodb://mongo:27017/softcards
  JWT_SECRET=seu_segredo_super_secreto
  JWT_REFRESH_SECRET=outro_segredo_super_secreto
```

3. **Suba os contêineres:**

* Na raiz do projeto, execute:

```bash
  docker-compose up --build
```

* O parâmetro `--build` garante que a imagem da API será construída na primeira execução. Nas próximas vezes, utilize apenas:

```bash
  docker-compose up
```

A aplicação estará disponível em `http://localhost:3000` e o MongoDB será acessível internamente pelo serviço Docker.
