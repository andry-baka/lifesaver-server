FROM node:alpine
ENV SERVICE_NAME hapi-server
ENV SERVICE_PORT 3000

ENV WAIT_START 0

COPY package.json .
RUN npm install
COPY . .

EXPOSE ${SERVICE_PORT}
CMD echo "Waiting for ${WAIT_START}s..." && sleep ${WAIT_START} && npm start
