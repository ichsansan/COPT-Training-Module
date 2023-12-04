NV=v1.6.1

docker stop services-combustion-blk1
docker rm services-combustion-blk1
docker image rm  services-combustion-blk1:$NV
docker image load -i services-combustion-blk1-$NV.tar
docker run -itd --name services-combustion-blk1 --restart unless-stopped --memory="300M" -p 0.0.0.0:8083:8083 services-combustion-blk1:$NV
