# EVO Silos manager

## Install required dependencies

```bash
sudo apt-get update && sudo apt-get upgrade -y && sudo apt-get install -y git mc nginx mysql-server
```

## Grant user access to USB serial ports

```bash
sudo usermod -a -G tty evo # change evo to your username
sudo usermod -a -G dialout evo # change evo to your username
```

## Install nvm

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
```

Exit terminal and open again

```bash
nvm install 18
```

## Setup Nginx

```bash
sudo ufw allow 'Nginx HTTP'
sudo cp ./deployment/silos-manager.conf /etc/nginx/sites-available
sudo rm /etc/nginx/sites-enabled/default
sudo ln -s /etc/nginx/sites-available/silos-manager.conf /etc/nginx/sites-enabled
sudo systemctl restart nginx
```

#### Copy and fill .env file

```bash
cp .env.example .env
```

## Setup MySQL

```bash
sudo mysql_secure_installation
sudo mysql
```

```sql
mysql>CREATE DATABASE db_name; # change db_name to value from .env file
mysql>CREATE DATABASE shadow_db_name; # change shadow_db_name to value from .env file
mysql>CREATE USER 'username'@'%' IDENTIFIED WITH mysql_native_password BY 'password'; # change username and password to values from .env file
mysql>GRANT ALL ON db_name.* TO 'username'@'%'; # change db_name and username to value from .env file
mysql>GRANT ALL ON shadow_db_name.* TO 'username'@'%'; # change shadow_db_name and username to value from .env file
mysql>exit
```

More details: https://www.digitalocean.com/community/tutorials/how-to-install-linux-nginx-mysql-php-lemp-stack-on-ubuntu-22-04

## Migrate database

```bash
npx prisma migrate dev --name init --schema src/prisma/schema.prisma
```

## Install pm2 and run app

```bash
npm install pm2@latest -g
cd /path/to/project
pm2 start dist/index.js --name evo-silos-manager -o /dev/null -e /dev/null
# add [-- reload time (ms)] flag after name flag to set reload time (180000 default)
# add [-- office] flag after reload time flag to run as office comp (for development only)
pm2 startup // Follow after command instructions
pm2 save
```
