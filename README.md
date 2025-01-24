# Meu Desafio Backend

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Postgres](https://img.shields.io/badge/Postgres-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![BullMQ](https://img.shields.io/badge/BullMQ-FF6C37?style=for-the-badge&logo=redis&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-1E90FF?style=for-the-badge&logo=zod&logoColor=white)


Meu Desafio Backend é a API que suporta o aplicativo **Meu Desafio**, fornecendo serviços para cadastro, gerenciamento de atividades e armazenamento seguro dos dados do usuário.

---

## Funcionalidades

- Processamento de tarefas em segundo plano com **BullMQ**.
- Cadastro e autenticação de usuários.
- Envio de emails.
- Upload de arquivos para o **Supabase Storage**.
- Registro de atividades (corridas e pedaladas).
- Integração com o banco de dados **PostgreSQL**.
- Validação de dados robusta com **Zod**.

---

## Tecnologias Utilizadas

- **BullMQ** - Biblioteca para gerenciamento de filas utilizando Redis.
- **NestJS** - Framework para desenvolvimento de APIs escaláveis e modulares.
- **Node.js** - Ambiente de execução para JavaScript no lado do servidor.
- **Prisma** - ORM moderno para interação com o banco de dados.
- **PostgreSQL** - Banco de dados relacional utilizado.
- **Supabase** - Plataforma de backend como serviço (BaaS) com armazenamento e autenticação.
- **Zod** - Biblioteca de validação e tipagem.

---

## Instalação

1. Clone este repositório:

```bash
git clone https://github.com/seu-usuario/meu-desafio-backend.git
```

2. Instale as dependências:

```bash
npm install
# ou
yarn install
```

3. Configure o ambiente:
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```env
     DATABASE_URL=postgresql://usuario:senha@localhost:5432/meu-desafio
     JWT_SECRET=sua_chave_secreta
     PORT=3000
     SUPABASE_URL=seu_url_supabase
     SUPABASE_KEY=sua_chave_supabase
```

4. Suba os serviços necessários com Docker Compose:

```bash
docker-compose up -d
```

5. Execute as migrações do banco de dados:

```bash
npx prisma migrate dev
```

6. Inicie o servidor:

```bash
npm run start:dev
```
---

## Como Usar

1. Certifique-se de que o servidor está rodando em `http://localhost:3000`.
2. Utilize ferramentas como **Postman** ou **Insomnia** para testar as rotas da API.
3. Integre o Mobile (aplicativo Meu Desafio) com o backend.

---

## Frontend Mobile

O frontend mobile da aplicação Meu Desafio pode ser encontrado no repositório abaixo:

  - [Repositório do Frontend Mobile](https://github.com/maxassis/meu-desafio.git)

## Contribuições

Contribuições são bem-vindas! Siga os passos abaixo para colaborar:

1. Faça um fork do repositório.
2. Crie um branch para sua feature ou bugfix: `git checkout -b minha-feature`.
3. Faça os commits e adicione uma descrição clara: `git commit -m "Minha nova feature"`.
4. Envie seu código: `git push origin minha-feature`.
5. Abra um Pull Request.

---

## Licença

Este projeto está licenciado sob a Licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais informações.

---

## Contato

- **Desenvolvedor**: Max Assis
- **E-mail**: max.assis@outlook.com
- **GitHub**: [@maxassis](https://github.com/maxassis)



