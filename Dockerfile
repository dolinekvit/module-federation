FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/shell/package.json apps/shell/
COPY apps/app1/package.json apps/app1/
COPY apps/app2/package.json apps/app2/
COPY packages/contracts/package.json packages/contracts/
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
