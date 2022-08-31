# FROM node:16.13.1 as base

# # specify the path of the working directory
# WORKDIR /src

# # copy package.json for dependancy install
# COPY package.json package.json
# COPY package-lock.json package-lock.json

# # specify test build
# FROM base as prod
# # clean dependancy install excluding dev dependancies
# RUN npm i
# RUN npm run build
# # copy files to image
# COPY . .
# #expose the port in the docker container
# EXPOSE 4200
# # the command to start our app
# CMD [ "npm", "start" ]

# # docker build -t test-suite --target test .
# # docker build -t saucy-site --target prod .
# # docker run test-suite
# # docker run -p 3000:3000 saucy-site

# Stage 1

FROM node:16.13.1 as build-step

RUN mkdir -p /app

WORKDIR /app

COPY package.json /app

RUN npm install --force

COPY . /app

RUN npm run build


# Stage 2

FROM nginx:alpine

COPY --from=build-step /app/dist/dol-swe-comp /nginxinc/nginx-unprivileged
EXPOSE 80
