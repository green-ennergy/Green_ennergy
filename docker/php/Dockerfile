FROM php:8.4-fpm-alpine

WORKDIR /var/www

RUN apk add --no-cache \
    bash \
    git \
    unzip \
    postgresql-dev \
    libzip-dev \
    oniguruma-dev

RUN docker-php-ext-install \
    pdo_pgsql \
    mbstring \
    bcmath \
    zip

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

CMD ["php-fpm"]