API de Autenticação com Express
Este projeto é uma API de autenticação construída com Express.js. Inclui registro de usuários, login, autenticação baseada em token e limitação de taxa.

Funcionalidades
Registro de usuários com senhas criptografadas.
Login de usuários com autenticação JWT.
Endpoint para atualização de token.
Middleware para limitação de taxa e verificação de token.
Tecnologias Utilizadas
Express.js
MongoDB
JWT (JSON Web Token)
Argon2 para hashing de senhas
Middleware de limitação de taxa
Instalação
Clone o repositório:

git clone https://github.com/joabysonSouza/authenticationJWT.git
Navegue até o diretório do projeto:
cd authenticationJWT

Instale as dependências:
npm install

Variáveis de Ambiente
Crie um arquivo .env na raiz do seu projeto e adicione as seguintes variáveis de ambiente:

env
SECRET=seu_jwt_secret
REFRESH_TOKEN=seu_refresh_token_secret

Uso
Inicie o servidor:
npm start ou npm run dev



