FROM node:22-alpine

# RUN npm install --global yarn

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install --frozen-lockfile

COPY . .

# EXPOSE 3000

CMD ["npm", "start"]