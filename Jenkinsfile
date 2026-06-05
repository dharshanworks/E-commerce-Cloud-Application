pipeline {
agent none

```
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
                    sh """
                        ${scannerHome}/bin/sonar-scanner \
                        -Dsonar.projectKey=cloudcart \
                        -Dsonar.projectName=CloudCart \
                        -Dsonar.sources=backend/src,frontend/src \
                        -Dsonar.exclusions=**/node_modules/**,**/dist/**,**/coverage/**
                    """
                }
            }
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
        echo 'CloudCart CI Pipeline Completed Successfully!'
    }

    failure {
        echo 'Pipeline Failed. Check Jenkins Console Output.'
    }
}
```

}
