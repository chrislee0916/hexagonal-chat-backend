
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="150" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>



## 專案描述

使用 [Nest.js](https://github.com/nestjs/nest) 框架 實作基於Clean Architecture 其中一種架構 Hexagonal Architecture

- DDD (Domain-Driven-Design)
  解構複雜的業務需求，提高系統的維護性

- CQRS (Command Query Responsibility Segregation)
  通過將讀取與寫入操作分離，提高性能與可擴展性

- Event-Driven
有效處理複雜的任務，提高系統性能與可擴展性

## Getting started

### Prerequisites
hexagonal-chat-backend requires [Docker](https://www.docker.com/)

### Running Application
first, clone this repository:
```bash
$ git clone https://github.com/chrislee0916/hexagonal-chat-backend.git
```

switch to directory
```bash
$ cd hexagonal-chat-backend
```

run the application
```bash
$ docker-compose up -d
```
Then visit http://127.0.0.1:4000/docs in your browser to see the swagger docs.


## Key Feature
- 登入功能
- 群組聊天
- 已讀功能
- 即時通訊
- 上傳檔案


## Key Technology Images

- JWT refresh token
![cqrs&event_driven](https://i.imgur.com/IxhsJ3c.png)

- CQRS & Event-Driven
![cqrs&event_driven](https://i.imgur.com/0yC1zZ5.png)


