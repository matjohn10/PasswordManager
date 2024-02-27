<h1 align="center">
Password Manager (Server)
</h1>
<p align="center">
The backend for my password manager project. Built using NodeJS and NPM. Uses mutliple routes and JWT access and refresh tokens for authentification and security. App password is hased using key derivation algorithms cryto.pbkdf2Sync() and the managed password are encrypted using crypto.createCipheriv().
</p>

## Built with

- [![Next][Next.js]][Next-url]
- [![React][React.js]][React-url]
- [![Vue][Vue.js]][Vue-url]
- [![Angular][Angular.io]][Angular-url]
- [![Svelte][Svelte.dev]][Svelte-url]
- [![Laravel][Laravel.com]][Laravel-url]

## Local Installation

Make sure to have [NodeJS](https://nodejs.org/en) and NPM installed.

```sh
npm install npm@latest -g
```

Use the following commands in the directory that you want this project to be cloned.

1. Clone the Repo

```sh
git clone https://github.com/matjohn10/PasswordManager.git
```

2. Install NPM packages

```sh
npm install
```

3. Create .env file and populate with the following variables. _Add your own values._

```sh
touch .env
echo "MONGO_URL=\nJWT_KEY=\nREFRESH_KEY=\nENCRYPTION_ALGO=\nENCRYPTION_SALTS=\nENCRYPTION_ITER=\nENCRYPT_KEY=" > .env
```

4. Start the project

```sh
npm start
```

## Deployement

**Still in progress...**

[Next.js]: https://img.shields.io/badge/typescript-000000?style=for-the-badge&logo=typescript&logoColor=blue
[Next-url]: https://www.typescriptlang.org/
[React.js]: https://img.shields.io/badge/nodejs-20232A?style=for-the-badge&logo=nodedotjs&logoColor=61DAFB
[React-url]: https://nodejs.org/en
[Vue.js]: https://img.shields.io/badge/Express.js-404D59?style=for-the-badge
[Vue-url]: https://expressjs.com/
[Angular.io]: https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white
[Angular-url]: https://www.mongodb.com/
[Svelte.dev]: https://img.shields.io/badge/json%20web%20tokens-323330?style=for-the-badge&logo=json-web-tokens&logoColor=pink
[Svelte-url]: https://jwt.io/
[Laravel.com]: https://img.shields.io/badge/GIT-E44C30?style=for-the-badge&logo=git&logoColor=white
[Laravel-url]: https://git-scm.com/
