FROM node:18

RUN apt-get update && apt-get install -y apt-file && apt-file update && \
  apt-get install -y \
  bash \
  vim
# postman, curl, 

# USER node
WORKDIR /app
RUN ls -CFtrla

# ENV PORT 3000
# EXPOSE 3000

CMD [ "node", "server.js" ]

