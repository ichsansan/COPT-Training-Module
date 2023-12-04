# README bat-blk-1

## Setup

- git clone https://gitlabcorp.smltech.co.id/pjb-soket/bat-template-blk1.git
- cd bat-template-blk1

## Installation for Project

- `cd 01-BLK` if you want to edit the source code of BLK BAT

### Example of BAT BLK Unit 01 installation and setup:

- `git checkout` to branch development if you want to edit the source code of BLK unit 1 BAT
- `git checkout development`
- (Please using Yarn for the installation of the project) 
- `yarn install`
- make sure you are using blk-01 web services API endpoint and unit name is PLTU BOLOK (UNIT 1) in `.env` and `.env.local` file
- copy this variable to the .env file `REACT_APP_BASE_URL=http://10.7.1.116:3013`
- `yarn start`

## Build and Deployment

- example for BLK unit 1 build and deployment:
- ```yarn build``` in the blk-01 folder if you want to build project for BLK unit 1
- copy the build folder into `/docker` folder
- make sure you already install docker
- inside of the docker folder type, `docker build -t 10.7.1.116:5000/bat-fuse-blk1:TAG_VERSION .`
- `docker push 10.7.1.116:5000/bat-fuse-blk1:TAG_VERSION`

### URL Domain Setup for Dev

- BLK1_API_ENDPOINT=<http://10.7.1.116:3013>
