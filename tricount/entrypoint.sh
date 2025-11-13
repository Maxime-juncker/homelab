#!/bin/bash

cd /var/www/tricount/

npm install
npm run build
exec npm run start

