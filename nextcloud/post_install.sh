#!/bin/bash

# Wait for Nextcloud to be ready
while [ ! -f /var/www/html/config/config.php ]; do
	sleep 2
done
echo starting pre install script

cd /var/www/html/

SHARED_DIR="/media"

find /var/www/html -type f -exec chmod 644 {} \;
find /var/www/html -type d -exec chmod 755 {} \;

php occ app:enable files_external
php occ files_external:create media local null::null -c datadir="$SHARED_DIR"

echo success
