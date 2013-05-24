#/bin/bash
cd ./Hyrise
export HYRISE_DB_PATH=`pwd`/test
export LD_LIBRARY_PATH=./build/:$LD_LIBRARY_PATH
./build/hyrise_server -l ./build/log.properties -p 5000
