# Getting Started with NodeTS

Welcome to Zitrium's backend part!

## First setup

### Used services

You need to install (on your machine or for example on Docker) listed applications in order to run this project correctly:

- [MongoDB](https://www.mongodb.com/) - db for storing users
- [Redis](https://redis.io/) - db for storing temporary data, like tokens

You will also need to create a [Mailgun](https://www.mailgun.com/) account in order to send emails to users. More info about Mailgun below.

### After downloading the project

- run `npm install` in both frontend and backend directory to install all required packages
- create `.env` environment file in both frontend and backend directory and fill in your data. You can find a template in `.env.example` file
- run `npm run build` in backend directory to create js files out of ts files, which is required as Node doesn't fully support ts yet (may change in the future)

### Docker

If you want to create a docker container, put this example `docker-compose.yml` in your root dir, where both frontend and backend are.

```yaml
version: '3.8'

services: 

  backend:
    build: 
      context: ./backend  # name of backend dir
      dockerfile: Dockerfile
    container_name: backend
    tty: true
    env_file: ./backend/.env
    environment:
      # mongodb:27017 - mongodb here is equivalent to the service name for db
      # demoDB is the name of created database
      MONGO_URI: mongodb://mongodb:27017/demoDB
      REDIS_HOST: redis
    ports: 
      - "3000:3000"
    depends_on:
      - mongodb
      - redis
    networks:
      - node-network

  frontend:
    build: 
      context: ./frontend  # name of frontend dir
      dockerfile: Dockerfile
    container_name: frontend
    tty: true
    env_file: ./frontend/.env
    ports: 
      - "3001:3001"
    depends_on:
      - backend

  mongodb:
    image: mongo:7.0.12
    container_name: mongodb
    restart: always
    volumes:
      - mongodata:/data/db
    ports: 
      - "27017:27017"
    networks: 
      - node-network
      
  redis:
    image: redis:7.4.0
    container_name: redis
    ports:
      - "6379:6379"
  
volumes:
  mongodata:
  
networks: 
  node-network:
    driver: bridge
```

And then in the same directory run in console:

### `docker-compose up --build`

## Running the project

To start both backend and frontend, in backend directory run:

### `npm run dev`

After a while, you should be able to connect to [http://localhost:3001](http://localhost:3001) and begin the interaction with React app

Remember that after changing server code, you always have to build JavaScript files with:

### `npm run build`

## Mailgun

We have used Mailgun as a mailing service to send verification e-mails to users. During development period, when you may not have your domain active yet, you can use Mailgun's sandbox domain (you get that automatically at the start) which allows for sending mails up to 5 given emails. So you pass your email, then on that email agree to receive emails from sandbox domain, and you can start mailing to yourself for testing.

## Frontend

[https://github.com/Lachimek12/Zitrium-Frontend](https://github.com/Lachimek12/Zitrium-Frontend)

## Learn More

Ahhh, don't.
