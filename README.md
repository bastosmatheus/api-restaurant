<h1 align="center" style="font-weight: bold">api-restaurant 🍔</h1>

## Descrição 📜

Esse projeto consiste em uma api para um restaurante, sendo possivel cadastrar usuários, funcionários e entregadores. Na aplicação da para fazer pedidos, tem sistema de entrega, formas de pagamento, entre outros recursos. O processo se inicia com a criação do usuário, após isso é possível ver o cardapio, escolher os alimentos, efetuar/pagar o pedido e acompanhar a entrega (aceita por um entregador cadastrado). A criação e edição dos pratos é feita por um funcionário, mais especificamente, um gerente (validado através do token jwt).

Para garantir a qualidade, o sistema foi feito com arquitetura limpa, juntamente com testes unitários, utilizando vitest.

## Tecnologias 🖥️

Este projeto está utilizando as seguintes tecnologias:

- [Node.js](https://nodejs.org/en)
- [Express](https://www.expressjs.com/pt-br/)
- [Pg-promise](https://github.com/vitaly-t/pg-promise)
- [Vitest](https://vitest.dev/)
- [JWT](https://jwt.io/)
- [Zod](https://zod.dev/)

## Endpoints 📌

A seguir estão as rotas da aplicação (a maioria só pode ser acessada com a validação do token jwt, além das rotas privadas, que apenas gerentes podem acessar):

### Usuário

- **GET** `/users`: lista todos os usuários.
- **GET** `/users/:id`: lista um usuário buscando pelo id.
- **GET** `/users/email/:email`: lista um usuário buscando pelo email.
- **POST** `/users`: cria um novo usuário.
- **POST** `/users/login`: faz o login.
- **PUT** `/users/:id`: atualiza as informações do usuário.
- **PATCH** `/users/:id`: atualiza a senha do usuário.
- **DELETE** `/users/:id`: deleta um usuário.

### Entregador

- **GET** `/deliverymans`: lista todos os entregadores.
- **GET** `/deliverymans/:id`: lista um entregador buscando pelo id.
- **GET** `/deliverymans/email/:email`: lista um entregador buscando pelo email.
- **POST** `/deliverymans`: cria um novo entregador.
- **POST** `/deliverymans/login`: faz o login.
- **PUT** `/deliverymans/:id`: atualiza as informações do entregador.
- **PATCH** `/deliverymans/:id`: atualiza a senha do entregador.
- **DELETE** `/deliverymans`: deleta um entregador.

### Funcionário

- **GET** `/employees`: lista todos os funcionários.
- **GET** `/employees/role/:employee_role`: lista os funcionários buscando pelo cargo.
- **GET** `/employees/:id`: lista um funcionário buscando pelo id.
- **GET** `/employees/email/:email`: lista um funcionário buscando pelo email.
- **POST** `/employees`: cria um novo funcionário.
- **POST** `/employees/login`: faz o login.
- **PUT** `/employees/:id`: atualiza as informações do funcionário.
- **PATCH** `/employees/:id`: atualiza a senha do funcionário.
- **DELETE** `/employees/:id`: deleta um funcionário.

### Comida

- **GET** `/foods`: lista todos os alimentos.
- **GET** `/foods/category/:category`: lista todos os alimentos de uma determinada categoria.
- **GET** `/foods/:id`: lista um alimento buscando pelo id.
- **GET** `/foods/name/:food_name`: lista um alimento buscando pelo nome.
- **POST** `/foods`: cria um novo alimento.
- **PUT** `/foods/:id`: atualiza as informações de um alimento.
- **DELETE** `/foods/:id`: deleta um alimento.

### Pedido

- **GET** `/orders`: lista todos os pedidos.
- **GET** `/orders/cards`: lista todos os pedidos pagos com cartão.
- **GET** `/orders/pixs`: lista todos os pedidos pagos com pix.
- **GET** `/orders/card/:id_card`: lista todos os pedidos feito com um cartão especifico.
- **GET** `/orders/user/:id_user`: lista todos os pedidos feito por um usuário especifico.
- **GET** `/orders/status/:status`: lista todos os pedidos com determinado status.
- **GET** `/orders/:id`: lista um pedido buscando pelo id.
- **POST** `/orders`: cria um novo pedido.
- **PATCH** `/orders/:id`: atualiza o status do pedido.

### Pix

- **GET** `/pixs`: lista todos os pixs.
- **GET** `/pixs/user/:id_user`: lista todos os pixs feito por um usuário especifico.
- **GET** `/pixs/status/:status`: lista todos os pixs com determinado status.
- **GET** `/pixs/:id`: lista um pix buscando pelo id.
- **GET** `/pixs/code/:code`: lista um pix buscando pelo código.
- **POST** `/pixs`: cria um novo pix.
- **PATCH** `/pixs/:id`: atualiza o status do pix.

### Cartão

- **GET** `/cards`: lista todos os cartões.
- **GET** `/cards/user/:id_user`: lista todos os cartões feito por um usuário especifico.
- **GET** `/cards/:id`: lista um cartão buscando pelo id.
- **GET** `/cards/card_number/:card_number`: lista um cartão buscando pelo número do cartão.
- **POST** `/cards`: cria um novo cartão.
- **DELETE** `/pixs/:id`: delete um cartão.

### Entrega

- **GET** `/deliveries`: lista todas as entregas.
- **GET** `/deliveries/not_accepted`: lista todas as entregas que ainda não foram aceitas.
- **GET** `/deliveries/deliveryman/:id_deliveryman`: lista todas as entregas de um determinado entregador.
- **GET** `/deliveries/:id`: lista uma entrega buscando pelo id.
- **POST** `/deliveries`: cria uma nova entrega.
- **PATCH** `/deliveries/:id/deliveryman/:id_deliveryman`: aceita a entrega associando a um entregador.
- **PATCH** `/deliveries/:id`: finaliza a entrega.

## Como rodar esse projeto? 💿

<h3>Pre-requisitos</h3>

- [Node.js](https://nodejs.org/en)
- [PostgreSQL](https://www.postgresql.org/)
- [Git](https://git-scm.com/)
- [Github](https://github.com/)

<h3>Clonagem</h3>

```bash
# clone o repositório
$ git clone https://github.com/bastosmatheus/api-restaurant.git
```

<h3>Configuração do arquivo .env</h3>

```bash
# arquivo .env
DATABASE_URL="postgresql://username:password@localhost:5432/yourdatabase?schema=public"
```

<h3>Projeto</h3>

```bash
# depois de clonado, procure a pasta do projeto
$ cd api-restaurant

# instale todas as dependências
$ npm install

# execute o projeto
$ npm run dev
```
