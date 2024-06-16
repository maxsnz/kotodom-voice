FROM node:18-alpine

# RUN npm install --global yarn

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

# EXPOSE 3000

CMD ["yarn", "start"]