FROM node:18:alpine

WORKDIR /server

COPY . .

RUN npm install -g nodemon

RUN yarn install

# RUN yarn build

CMD ["yarn", "start"]