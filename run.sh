#!/bin/bash

# Stop the Docker container
docker stop capstone-dashboard-ui

# Check the exit status of the docker stop command
# $? reads the exit code from the last shell command - docker stop capstone-dashboard-ui
if [ $? -eq 0 ]; then
    echo "Container stopped successfully"

    # Add your additional commands here
    echo "Running docker run and docker ps"
    
    docker run -d \
        -p 7200:7200 \
        --rm \
        --name capstone-dashboard-ui \
        --network monitoring \
        -v /var/run/docker.sock:/var/run/docker.sock \
        stoicllama/capstone-dashboard-ui:$0

    docker ps

else
    echo "Container does not exist"

    # Add your additional commands here
    echo "Running docker run and docker ps"
    
    docker run -d \
        -p 7200:7200 \
        --rm \
        --name capstone-dashboard-ui \
        --network monitoring \
        -v /var/run/docker.sock:/var/run/docker.sock \
        stoicllama/capstone-dashboard-ui:$0

    docker ps
fi
