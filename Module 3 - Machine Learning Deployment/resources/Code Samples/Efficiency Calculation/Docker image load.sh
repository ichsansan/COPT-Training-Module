docker stop efficiency_pred
docker rm efficiency_pred
docker image rm efficiency_pred:v1.0
docker image load -i ../efficiency_pred_v1.0.tar
docker run -itd --name efficiency_pred --restart unless-stopped --memory="2G" -p 0.0.0.0:5002:5002 efficiency_pred:v1.0