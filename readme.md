<!-- docker build -->
sudo docker build . -t first

sudo docker run  -p 8001:8001 first


sudo docker save first | gzip > first.tar.gz

<!-- docker list //process -->
sudo docker ps

<!-- docker stop -->
sudo docker stop <id>