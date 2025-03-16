FROM docker.io/node
WORKDIR /app

COPY package.json package-lock.json .
RUN npm install && npm install -g @angular/cli

COPY . .

