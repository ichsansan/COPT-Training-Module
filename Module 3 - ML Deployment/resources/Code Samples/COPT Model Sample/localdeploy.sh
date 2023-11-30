clear
OV="r1.7.3"
NV="r1.7.4"

docker stop ml-runner-blk
docker rm -f ml-runner-blk
docker image rm ml-runner-blk:$NV
docker build -t ml-runner-blk:$NV .

## Run local
docker run -itd --name ml-runner-blk1 --restart unless-stopped --memory="4G" -p 0.0.0.0:5002:5002 ml-runner-blk1:$NV


## Transfer
# docker image save -o ../ml-runner-blk-$NV.tar ml-runner-blk:$NV

# ssh ichsan@bolok2 "(ls ~/CombustionOpt/zipped/ml-runner-blk-$NV.tar && echo \"File exists\") || cp ~/CombustionOpt/zipped/ml-runner-blk-$OV.tar ~/CombustionOpt/zipped/ml-runner-blk-$NV.tar"
# rsync -avP ../ml-runner-blk-$NV.tar ichsan@bolok2:~/CombustionOpt/zipped/.
