
# Building server

FROM node:10 AS server-build
WORKDIR /server
COPY server/package.json ./
RUN yarn install
COPY . .
RUN yarn build

#Building client

FROM node:10 AS client-build
WORKDIR /client
COPY client/package.json ./
RUN yarn install
COPY . .
RUN yarn build

# Run the application

FROM node:10-alpine
WORKDIR /app
COPY --from=server-build /server ./
COPY --from=client-build /client/dist ./dist/public
EXPOSE 3000
CMD ["yarn", "run", "start:prod"]

