FROM node:8.9.1

RUN mkdir -p users/src/
WORKDIR users/

ADD src/ src/
ADD package.json package.json
ADD package-lock.json package-lock.json

RUN npm install package.json

CMD ["node", "src/app.js"]
