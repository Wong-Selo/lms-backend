# Contents
- [Tech Stack](#tech-stack) 
- [Initial Step](#initial-step) 
- [DB Migration](#db-migration) 

# Tech Stack
1. node js express
2. db-migrate
3. postgresql
4. grunt

# INITIAL STEP
1. Clone
2. Copy .env.example -> .env
3. Modify .env
4. Intall node_modules
```
$ docker build images/node --tag lms_node
$ docker run --rm -w /home/node/app -v "$(pwd)/api:/home/node/app" lms_node npm i
```
5. RUN docker compose (using -d to run in the background)
```
$ docker-compose up
```
6. Check with open in the browser http://host:port

# DB Migration

1. Create DB migration
```
$ docker exec -it lms_api db-migrate create <migration-name>
```

2. Then edit api/migrations files
3. Migrate database
```
$ docker exec -it lms_api db-migrate up
```
for reference follow this one 
https://www.npmjs.com/package/db-migrate
https://db-migrate.readthedocs.io/en/latest/Getting%20Started/installation/