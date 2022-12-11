FROM node:16-alpine AS base

# update packages in the CentOS distribution
# RUN yum update
WORKDIR /app 
COPY ["package.json", "package-lock.json", "./"]


RUN npm install
COPY . .

# port & environment configuration settings
# ARG port
# ENV APP_PORT ${port}

# ARG environment
# ENV NODE_ENV ${environment}

FROM base AS dev
RUN npm run build
CMD ["node", "./dist/main.js" ]

FROM base AS prod
RUN npm install -g @nestjs/cli
RUN npm run build
CMD ["node", "./dist/main.js" ]


