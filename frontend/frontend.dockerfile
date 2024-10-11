FROM node:14-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production
RUN npm install --save-dev html5-qrcode
RUN npm install --save-dev react-app-rewired
RUN npm install sass
RUN npm install react-bootstrap bootstrap

COPY . .
EXPOSE 3000
# ENV NODE_ENV=production REACT_APP_API_URL=http://localhost:8080/ REACT_APP_AUDITORIA_API_URL=http://localhost:8080/ GENERATE_SOURCEMAP=false DISABLE_ESLINT_PLUGIN=true
CMD ["npm", "start"]