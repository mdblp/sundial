FROM node:12-alpine
# apk for building mongodb-topology-manager module
RUN apk --no-cache update && \
    apk --no-cache upgrade && \
    apk add --no-cache make gcc g++ python krb5-dev && \
    npm install -g npm@latest
