FROM nginx:latest

RUN echo "Asia/shanghai" > /etc/timezone;

ADD dist /usr/share/nginx/html

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
