#!/bin/bash
# Assumes we're using the Bitnami AMI.

SCRIPT_LOCATION="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
CODE_LOCATION="$( cd $SCRIPT_LOCATION/../ >/dev/null 2>&1 && pwd )"
ORIGINAL_LOCATION="$PWD"
cd $SCRIPT_LOCATION;



# Permissions
sudo chown -R bitnami:daemon $CODE_LOCATION
sudo chmod -R 0774 $CODE_LOCATION/storage
sudo chmod -R 0774 $CODE_LOCATION/storage/bootstrap/cache



# Verify PHP and Composer are present.
hash php 2>/dev/null || { echo >&2 "PHP needs to be installed.  Aborting."; exit 1; }
hash composer 2>/dev/null || { echo >&2 "Composer needs to be installed.  Aborting."; exit 1; }



# Composer Install
echo "Installing Composer dependencies..."
cd $CODE_LOCATION;
composer install
if [ $? -ne 0 ]; then
    >&2 echo "Composer dependency installation failed."
    exit 1;
fi
echo "Installed Composer dependencies."
echo "--------------------"



# Artisan Environment Setup
echo "Running Artisan key generation..."
cp $SCRIPT_LOCATION/.env.base .env
php artisan key:generate
if [ $? -ne 0 ]; then
    >&2 echo "Artisan key generation failed."
    exit 1;
fi
echo "Completed Artisan key generation."
echo "--------------------"



# Migrate Database (force to skip confirmation prompt).
# php artisan migrate --force
# if [ $? -ne 0 ]; then
#     >&2 echo "Database migration failed."
#     exit 1;
# fi
# echo "Completed database migration."
# echo "--------------------"