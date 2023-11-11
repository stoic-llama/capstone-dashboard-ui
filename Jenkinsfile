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
                    def containerName = 'capstone-dashboard-ui'

                    // def containerExists = sh(returnStdout: true, script: "docker ps -q --filter name=${containerName}")

                    sh 'docker ps -q --filter name=${containerName} > result'
                    def containerExists = readFile('result')

                    echo "containerExists value: " 
                    echo "${containerExists}"

                    if (containerExists.length() != 0) {
                        // Stop the Docker container
                        sh "docker stop ${containerName}"
                        echo "Container stopped successfully. Continuing..."
                    } else {
                        echo "Container does not exist. Continuing..."
                    }
                }

               withCredentials([
                    string(credentialsId: 'website', variable: 'WEBSITE'),
                ]) {
                    sh '''
                        ssh -i /var/jenkins_home/.ssh/website_deploy_rsa_key ${WEBSITE} "docker run -d \
                        -p 7200:7200 \
                        --rm \
                        --name capstone-dashboard-ui \
                        --network monitoring \
                        -v /var/run/docker.sock:/var/run/docker.sock \
                        stoicllama/capstone-dashboard-ui:${version}

                        docker ps
                        "
                    '''
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