FROM node:16

WORKDIR /app

COPY package.json ./

COPY yarn.lock ./

COPY . .

RUN npm install -g react-scripts

RUN yarn install

# RUN yarn build

CMD ["yarn", "start"]