FROM node

WORKDIR /app
ADD . /app

# Set env variables
ENV NPM_CONFIG_PRODUCTION false
ENV NODE_ENV production

RUN yarn install

WORKDIR /app/server
RUN yarn install

WORKDIR /app

# First run cra-universal build to build client and server
RUN yarn run cra-universal build

# Copy necessary folders to build
RUN cp -R server/src/models/ dist/build/models/
RUN cp -R server/src/updates/ dist/build/updates/

# Go to dist and install packages
WORKDIR /app/dist
RUN yarn install

WORKDIR /app/dist/build
ENTRYPOINT ["node", "bundle.js"]
