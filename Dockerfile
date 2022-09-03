# FROM node:16.13.1 as base

# # specify the path of the working directory
# WORKDIR /src

# # copy package.json for dependancy install
# COPY package.json package.json
# COPY package-lock.json package-lock.json

# # specify test build
# FROM base as prod

# # copy files to image
# COPY . .
# # clean dependancy install excluding dev dependancies
# RUN npm i --legacy-peer-deps && npm run build
# # RUN npm run build

# #expose the port in the docker container
# EXPOSE 80
# # the command to start our app
# CMD [ "npm", "start" ]


# # docker build -t test-suite --target test .
# # docker build -t saucy-site --target prod .
# # docker run test-suite
# # docker run -p 3000:3000 saucy-site

# # Stage 1

# FROM node:16.13.1 as build-step

# RUN mkdir -p /app

# WORKDIR /app

# COPY package.json /app

# RUN npm install --force

# COPY . /app

# RUN npm run build


# # Stage 2

# FROM nginx:alpine

# COPY --from=build-step /app/dist/dol-swe-comp /nginxinc/nginx-unprivileged
# EXPOSE 80

# FROM node:alpine AS my-app-build
# WORKDIR /app
# COPY . .
# RUN npm ci --legacy-peer-deps && npm run build

# # stage 2

# FROM nginx:alpine
# COPY --from=my-app-build /app/dist/dol-swe-comp /usr/share/nginx/html
# EXPOSE 80




##### Trying some thangs 9/3
FROM node:18.6.0-alpine3.15 as node

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --force

COPY . .

RUN npm run build

# stage 2
FROM nginx:1.21-alpine

COPY --from=node /usr/src/app/dist/dol-swe-comp /usr/share/nginx/html


COPY ./nginx.config /etc/nginx/conf.d/default.conf

CMD sed -i -e 's/$PORT/'"$PORT"'/g' etc/nginx/conf.d/default.conf && nginx -g 'daemon off'