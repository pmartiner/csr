# CSR

## Architecture

| Name             | Service | Container | Tech                 |
|------------------|---------|-----------|----------------------|
| Web              | Web     | web       | React                |
| Leaders API      | Leaders | leaders   | Express              |
| DB               | DB      | db        | Postgres             |

##### (1) Web - http://localhost:8080

| Endpoint   | HTTP Method | CRUD Method | Result                  |
|-------------|-------------|-------------|------------------------|
| /           | GET         | READ        | render main page       |
| /login      | GET         | READ        | render login page      |
| /register   | GET         | READ        | render register page   |

##### (2) Leaders - http://localhost:3000

| Endpoint            | HTTP Method | CRUD Method | Result            |
|---------------------|-------------|-------------|-------------------|
| /leaders/ping       | GET         | READ        | `pong`            |
| /leaders/send       | POST        | CREATE      | json example      |
| /leaders/register   | POST        | CREATE      | add a user        |
| /leaders/login      | POST        | CREATE      | log in a leader   |
