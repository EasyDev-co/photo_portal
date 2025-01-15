FROM node:14-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production
RUN npm install --save-dev html5-qrcode
RUN npm install --save-dev react-app-rewired
RUN npm install sass
RUN npm install react-bootstrap bootstrap

COPY . .

RUN npm run build

RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
