#!/bin/sh

# Заменяем переменные в конфигурации Nginx
envsubst '${PRODUCT_SERVICE_PORT} ${ORDER_SERVICE_PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# Запускаем Nginx в фореграунде
nginx -g 'daemon off;' 