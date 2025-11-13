#!/bin/bash

CERT_DIR="./ssl"
KEY_FILE="$CERT_DIR/nginx.key"
CERT_FILE="$CERT_DIR/nginx.crt"
SUBJ="/C=FR/ST=ge/L=CHARBONIERE/O=ME/CN=mjuncker.42.fr"

mkdir -p "$CERT_DIR"

echo "generating new ssl keys"
openssl req -x509 -nodes -newkey rsa:2048 \
	-keyout "$KEY_FILE" \
	-out "$CERT_FILE" \
	-days 365 \
	-subj "$SUBJ"

