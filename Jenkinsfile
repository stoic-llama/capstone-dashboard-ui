pipeline {
    agent any
    environment {
        version = '1.0'
    }

    stages {
        stage("login") {
            steps {
                echo 'authenticating into jenkins server...'
                sh 'docker login'
                // sh 'docker login registry.digitalocean.com'
                
                // note you need to manually add token for capstone-ccsu once 
                // in Jenkins conatiner that is in the droplet
                // Refer to "API" tab in Digital Ocean
                // sh 'doctl auth init --context capstone-ccsu'  
            }
        }

        stage("build") {
            steps {
                // echo 'building the application...'
                // sh 'doctl registry repo list-v2'
                // sh "docker build -t capstone-frontend:${version} ."
                // sh "docker tag capstone-frontend:${version} registry.digitalocean.com/capstone-ccsu/capstone-frontend:${version}"
                // sh "docker push registry.digitalocean.com/capstone-ccsu/capstone-frontend:${version}"
                // sh 'doctl registry repo list-v2'

                echo 'building the application...'
                // sh 'doctl registry repo list-v2'
                sh "docker build -t capstone-dashboard-ui:${version} ."
                sh "docker tag capstone-dashboard-ui:${version} stoicllama/capstone-dashboard-ui:${version}"
                sh "docker push stoicllama/capstone-dashboard-ui:${version}"
                // sh 'doctl registry repo list-v2'
            }
        }

        stage("test") {
            steps {
                echo 'testing the application...'    
            }
        }

        stage("deploy") {
            steps {
                echo 'deploying the application...' 

                script {
                    // Use the withCredentials block to access the credentials
                    // Note: need --rm when docker run.. so that docker stop can kill it cleanly
                    withCredentials([
                        string(credentialsId: 'website', variable: 'WEBSITE'),
                    ]) {
                        // Define your container name or ID
                        def containerName = 'capstone-dashboard-ui'

                        // Check if the container exists before attempting to stop it
                        def containerExists = sh(script: "docker ps -q --filter name=${containerName}", returnStatus: true) == 0

                        if (containerExists) {
                            // Stop the Docker container
                            sh "docker stop ${containerName}"
                            echo "Container stopped successfully."

                            sh "docker run -d \
                            -p 7200:7200 \
                            --rm \
                            --name capstone-dashboard-ui \
                            --network monitoring \
                            -v /var/run/docker.sock:/var/run/docker.sock \
                            stoicllama/capstone-dashboard-ui:${version}"

                            sh "docker ps"
                        } else {
                            echo "Container does not exist."

                            sh "docker run -d \
                            -p 7200:7200 \
                            --rm \
                            --name capstone-dashboard-ui \
                            --network monitoring \
                            -v /var/run/docker.sock:/var/run/docker.sock \
                            stoicllama/capstone-dashboard-ui:${version}"

                            sh "docker ps"
                        }
                    }

                }
            }
        }
    }

    post {
        always {
            echo "Release finished and start clean up"
            deleteDir() // the actual folder with the downloaded project code is deleted from build server
        }
        success {
            echo "Release Success"
        }
        failure {
            echo "Release Failed"
        }
        cleanup {
            echo "Clean up in post workspace" 
            cleanWs() // any reference this particular build is deleted from the agent
        }
    }

}