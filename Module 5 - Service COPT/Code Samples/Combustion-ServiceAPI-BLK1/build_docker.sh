clear
OV="v1.5.7"
NV="v1.6.1"

docker build -t services-combustion-blk1:$NV .
docker image save -o ../services-combustion-blk1-$NV.tar services-combustion-blk1:$NV
# ssh ichsan@bolok1 "cp ~/CombustionOpt/zipped/services-combustion-blk1-$OV.tar ~/CombustionOpt/zipped/services-combustion-blk1-$NV.tar"
rsync -Pavr ../services-combustion-blk1-$NV.tar ichsan@bolok1:~/CombustionOpt/zipped/.
rsync -Pavr run_service_tar.sh ichsan@bolok1:~/CombustionOpt/zipped/.
ssh ichsan@bolok1 'cd CombustionOpt/zipped/; ./run_service_tar.sh'
