FROM node:14.15.4-alpine3.12 AS build
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn
COPY . .
RUN yarn build


FROM node:14.15.4-alpine3.12
WORKDIR /app
COPY package.json .
COPY yarn.lock .
COPY .env .
COPY start.sh .
COPY --from=build /app/dist ./dist
RUN chmod +x ./start.sh
CMD [ "./start.sh"]

