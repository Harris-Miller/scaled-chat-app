FROM nginx:alpine

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./index.html /www/data/index.html
EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]
