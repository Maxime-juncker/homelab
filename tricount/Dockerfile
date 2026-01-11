FROM alpine:3.20

RUN apk update && apk upgrade
RUN apk add bash curl npm

COPY ./frontend /var/www/tricount
COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

CMD ["bash", "/entrypoint.sh"]
