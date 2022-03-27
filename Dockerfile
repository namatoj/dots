FROM node:latest

RUN mkdir /app
WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm ci
COPY . .

CMD ["npm", "run", "server"]