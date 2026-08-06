# Use the official PHP image with Apache web server
FROM php:8.2-apache

# Install and enable the MySQLi extension (required for database connectivity)
RUN docker-php-ext-install mysqli && docker-php-ext-enable mysqli

# Enable Apache rewrite and headers modules for CORS and URL routing
RUN a2enmod rewrite headers

# Allow .htaccess overrides in Apache
RUN sed -i '/<Directory \/var\/www\/>/,/<\/Directory>/s/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf

# Copy the backend files from the current folder into Apache's default HTML folder
COPY . /var/www/html/

# Expose port 80 (Apache default)
EXPOSE 80
