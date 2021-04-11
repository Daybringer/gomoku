
# Building server

FROM node:14 AS server-build
WORKDIR /server
COPY server/package.json ./
COPY server/tsconfig.build.json ./
COPY server/tsconfig.json ./
COPY server/nest-cli.json ./
RUN yarn install
COPY server ./
RUN yarn build

#Building client

FROM node:14 AS client-build
WORKDIR /client
COPY client/package.json ./
COPY client/tsconfig.json ./
RUN yarn install
COPY client ./
RUN yarn build

# Run the application

FROM node:14-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=server-build /server ./
COPY --from=client-build /client/dist ./dist/public
EXPOSE 3000
CMD ["yarn", "run", "start:prod"]

