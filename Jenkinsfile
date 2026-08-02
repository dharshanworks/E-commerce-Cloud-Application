pipeline {
    agent any

    options {
        timestamps()
    }

    environment {
        BACKEND_IMAGE = "cloudcart-backend"
        FRONTEND_IMAGE = "cloudcart-frontend"
    }

    stages {

        stage('Checkout') {
            steps {
                echo "Checking out source code..."
                checkout scm
            }
        }

        stage('Verify Environment') {
            steps {
                sh 'git --version'
                sh 'docker --version'
                sh 'aws --version'
                sh 'node --version'
                sh 'npm --version'
            }
        }

        stage('Backend Build') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                sh 'docker build -t ${BACKEND_IMAGE}:latest ./backend'
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                sh 'docker build -t ${FRONTEND_IMAGE}:latest ./frontend'
            }
        }
    }

    post {

        success {
            echo 'Pipeline completed successfully.'
        }

        failure {
            echo 'Pipeline failed.'
        }

        always {
            cleanWs()
        }
    }
}