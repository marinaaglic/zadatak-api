# Project

This is an API that allows users to register, login and access protected resource. There are 3 type of roles for users: USER, BLOGGER and ADMIN.
USERs can send posts for pending if they are going to be allowed or not.
ADMIN can allow posts or decline.
BLOGGERs are users who's posts have been allowed.

## Setup

Git clone the project

Run `npm install`

Copy .env.example to .env and add your secrets

DB_CONNECT needs to be your mongodb connection string
TOKEN_KEY needs to be your hash key

Run `npm run start` to start server

## API documentation

https://app.swaggerhub.com/apis/MAGLICCUV_1/Zadatak-API/1.0.0

## Postman

You can find Postman collection in docs folder, import it to Postman.
