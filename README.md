TRANSACTIONS ADD

## Start

Node.JS version 16.x.x
As a database I will use PostgreSQL (running in Docker container)
As an ORM I will use Sequelize

## Run tests

1. docker exec -it custom_postgres_container psql -U postgres
2. CREATE DATABASE user_organization_test;
3. \q
4. npm run migrate-test
5. 