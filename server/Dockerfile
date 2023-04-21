FROM node:16

WORKDIR /server

COPY . .

RUN npm install -g nodemon

RUN yarn install

# RUN yarn build

CMD ["yarn", "start"]