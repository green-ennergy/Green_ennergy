#!/bin/sh
set -e

echo "==> Running database migrations..."
php /var/www/artisan migrate --force

echo "==> Running database seeders..."
php /var/www/artisan db:seed --force || echo "==> Seeder already populated or skipped."

echo "==> Starting Supervisord (PHP-FPM + Nginx)..."
exec /usr/bin/supervisord -c /etc/supervisord.conf
