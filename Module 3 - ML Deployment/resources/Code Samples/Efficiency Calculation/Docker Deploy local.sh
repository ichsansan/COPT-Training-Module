docker build -t efficiency_pred:v1.0 .
docker run -itd --name efficiency_pred --restart unless-stopped --memory="2G" -p 0.0.0.0:5002:5002 efficiency_pred:v1.0