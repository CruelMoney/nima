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
RUN cp -R server/src/templates/ dist/build/templates/
RUN cp -R server/src/updates/ dist/build/updates/

# Build admin
WORKDIR /app/admin
RUN yarn install
RUN yarn build
WORKDIR /app
RUN mkdir -p dist/build/admin
RUN mv admin/build/* dist/build/admin

# Go to dist and install packages
WORKDIR /app/dist
RUN yarn install --production

WORKDIR /app
ENTRYPOINT ["node", "dist/build/bundle.js"]
