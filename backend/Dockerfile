FROM node:20.13.1-alpine3.19 AS build

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npm run build
RUN npm install --production

FROM node:20.13.1-alpine3.19

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/node_modules ./node_modules 
COPY --from=build /usr/src/app/dist ./dist 
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/prisma ./prisma

EXPOSE 4000

CMD [ "npm", "run", "start:migrate:prod" ]