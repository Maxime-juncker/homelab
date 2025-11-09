FROM alpine:3.20

RUN apk update && apk upgrade
RUN apk add php php-fpm php-mysqli php-cgi php-opcache php-session php-dom php-curl
RUN apk add nginx && apk add bash && apk add openssl curl

EXPOSE 443

COPY nginx.conf /etc/nginx/nginx.conf
COPY ./setup.sh /setup.sh
RUN chmod +x /setup.sh

CMD ["bash", "/setup.sh"]
