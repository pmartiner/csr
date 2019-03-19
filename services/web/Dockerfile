FROM node:8.9.1

RUN mkdir -p web/src/
RUN mkdir -p web/public/
WORKDIR web/

ADD src/ src/
ADD public/ public/
ADD package.json package.json
ADD package-lock.json package-lock.json

RUN npm install package.json

CMD ["REACT_APP_USERS_SERVICE_URL"]
CMD ["npm", "start"]
