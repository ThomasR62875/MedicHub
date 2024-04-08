FROM node:17-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm install -g nodemon 

EXPOSE 19006 19001 19002 8081

CMD ["npm", "run", "dev"]