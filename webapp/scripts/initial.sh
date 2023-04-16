#!/usr/bin/env bash

sudo apt-get update
sudo apt-get upgrade -y
sudo apt install -y curl
sudo apt install -y unzip
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y npm
sudo apt-get install -y mysql-server
sudo apt-get clean
sudo systemctl start mysql.service
sudo systemctl status mysql.service
sudo mysql <<EOF
  CREATE USER 'node-server'@'localhost' IDENTIFIED BY 'password';
  CREATE DATABASE webapp;
  GRANT ALL PRIVILEGES ON webapp.* TO 'node-server'@'localhost';
EOF
sudo mkdir webapp
sudo cp /tmp/webapp.zip /home/ubuntu/webapp/webapp.zip
sudo chmod -R 777 /home/ubuntu/
cd /home/ubuntu/webapp/
unzip webapp.zip
cd server/
npm ci
npm test