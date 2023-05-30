FROM node:18

RUN apt-get update && apt-get install -y apt-file && apt-file update && \
  apt-get install -y \
  bash \
  vim
# postman, curl, 

# USER node
WORKDIR /app
RUN ls -CFtrla

CMD [ "node", "server.js" ]

