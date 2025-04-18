# build stage
FROM node:14-alpine as build-stage
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
# production stage
FROM nginx:1.17-alpine as production-stage
# Copy config nginx
COPY --from=build-stage /app/.nginx/nginx.conf /etc/nginx/conf.d/default.conf
# Remove default nginx static assets
COPY --from=build-stage /app/dist/. /usr/share/nginx/html/
COPY --from=build-stage /app/firebase-messaging-sw.js /usr/share/nginx/html/
CMD ["nginx", "-g", "daemon off;"]