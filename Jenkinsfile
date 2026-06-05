pipeline {
agent none


environment {
    DOCKER_USER = 'dharshanplans'
    BACKEND_IMAGE = 'cloudcart-backend'
    FRONTEND_IMAGE = 'cloudcart-frontend'
}

stages {

    stage('Backend Dependencies') {
        agent {
            docker {
                image 'node:22-alpine'
                reuseNode true
            }
        }
        steps {
            dir('backend') {
                sh 'npm install'
            }
        }
    }

    stage('Frontend Build') {
        agent {
            docker {
                image 'node:22-alpine'
                reuseNode true
            }
        }
        steps {
            dir('frontend') {
                sh 'npm install'
                sh 'npm run build'
            }
        }
    }

    stage('SonarQube Analysis') {
        agent any
        steps {
            script {
                def scannerHome = tool 'SonarScanner'

                withSonarQubeEnv('SonarQube') {
                    sh "${scannerHome}/bin/sonar-scanner"
                }
            }
        }
    }

    stage('OWASP Dependency Check') {
        agent any

        steps {
            dependencyCheck(
                additionalArguments: '--scan . --format XML --format HTML',
                odcInstallation: 'DependencyCheck'
            )

            dependencyCheckPublisher(
                pattern: '**/dependency-check-report.xml'
            )
        }
    }

    stage('Trivy Filesystem Scan') {
        agent any

        steps {
            sh '''
            docker run --rm \
            -v $WORKSPACE:/workspace \
            aquasec/trivy:latest \
            fs /workspace
            '''
        }
    }

    stage('Build Backend Image') {
        agent any

        steps {
            sh '''
            docker build \
            -t ${DOCKER_USER}/${BACKEND_IMAGE}:${BUILD_NUMBER} \
            -t ${DOCKER_USER}/${BACKEND_IMAGE}:latest \
            ./backend
            '''
        }
    }

    stage('Build Frontend Image') {
        agent any

        steps {
            sh '''
            docker build \
            -t ${DOCKER_USER}/${FRONTEND_IMAGE}:${BUILD_NUMBER} \
            -t ${DOCKER_USER}/${FRONTEND_IMAGE}:latest \
            ./frontend
            '''
        }
    }

    stage('Docker Version') {
        agent any

        steps {
            sh 'docker --version'
        }
    }
}

post {
    success {
        echo 'CloudCart DevSecOps Pipeline Completed Successfully!'
    }

    failure {
        echo 'Pipeline Failed. Check Jenkins Console Output.'
    }
}


}
