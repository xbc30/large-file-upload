FROM node:alpine

    WORKDIR /var/www/html

    COPY ./package.json /var/www/html/package.json

    RUN npm install

    COPY . /var/www/html

    EXPOSE 7001

    CMD [ "npm", "run", "start" ]
