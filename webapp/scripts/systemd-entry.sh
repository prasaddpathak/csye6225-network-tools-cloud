#!/usr/bin/env bash

sudo cp /tmp/webapp.service /lib/systemd/system/webapp.service
echo "Service File successfully copied"
sudo systemctl daemon-reload
sudo systemctl start webapp
sudo systemctl status webapp
sudo systemctl enable webapp
