#!/bin/sh

cd /var/www/
chown -R www-data:root /var/www;



if [ "$(ls -A /var/www/nextcloud)" ]; then
	echo nextcloud is already installed!
	exec php-fpm83 --nodaemonize
fi

mv /www.conf /etc/php83/php-fpm.d/www.conf

# Download the latest Nextcloud
wget https://download.nextcloud.com/server/releases/latest.tar.bz2

echo extracting nextcloud
tar -xjf latest.tar.bz2 -C /var/www/

cd /var/www/nextcloud

echo seting permission
find /var/www/nextcloud -type f -exec chmod 644 {} \;
find /var/www/nextcloud -type d -exec chmod 755 {} \;
chmod +x /var/www/nextcloud/occ

echo installing nextcloud
mkdir -p /var/www/nextcloud/nextcloud
php -d memory_limit=1024M occ maintenance:install \
  --database="mysql" \
  --database-name="nextcloud" \
  --database-user=$MYSQL_USER \
  --database-pass=$MYSQL_PASSW \
  --database-host="mariadb" \
  --database-port="3306" \
  --admin-user=$NEXT_USER \
  --admin-pass=$NEXT_PASS \
  --data-dir="/var/www/nextcloud/nextcloud/data"

chmod 644 /var/www/nextcloud/config/config.php 
chown -R www-data:www-data /var/www/nextcloud

echo creating external storage
mkdir /var/www/test

php -d memory_limit=1024M occ config:system:set trusted_domains 1 --value='*' # to access from anywhere

php -d memory_limit=1024m occ app:enable files_external


php -d memory_limit=1024m occ files_external:create music local null::null -c datadir=/var/www/music

echo "nextcloud ready for use!"
exec php-fpm83 --nodaemonize
