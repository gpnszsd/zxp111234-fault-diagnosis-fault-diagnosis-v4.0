FROM nginx:latest

COPY ./mine.conf /etc/nginx/conf.d/

COPY ./dist/ /usr/share/nginx/html/

