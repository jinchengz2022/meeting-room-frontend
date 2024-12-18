# build stage
FROM node as build-stage

WORKDIR /app

COPY build ./

COPY package.json ./

# RUN npm config set registry https://registry.npmmirror.com/

# RUN npm install

COPY . .

# RUN npm run build

# production stage
FROM nginx as production-stage

COPY --from=build-stage /app/build /usr/share/nginx/html

COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
