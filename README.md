
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="150" alt="Nest Logo" /></a>
</p>


## 專案描述

使用 [Nest.js](https://github.com/nestjs/nest) 框架 實作基於Clean Architecture 其中一種架構 Hexagonal Architecture

- DDD (Domain-Driven-Design)
  解構複雜的業務需求，提高系統的維護性

- CQRS (Command Query Responsibility Segregation)
  通過將讀取與寫入操作分離，提高性能與可擴展性

- Event-Driven
有效處理複雜的任務，提高系統性能與可擴展性

## 主要功能
- 登入功能
- 群組聊天
- 已讀功能
- 即時通訊
- 上傳檔案

## 主要技術
- JWT refresh token 驗證機制
- socket.io
- CQRS
- event-driven


## 執行程式
```bash
$ docker-compose up -d
```

## Swagger Http Api 文件
```bash
$ curl http://127.0.0.1:4000/docs
```


## 聯絡資訊
- [個人網站](https://www.google.com/)
