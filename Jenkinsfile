pipeline {
agent none

stages {

    stage('Backend Dependencies') {
        agent {
            docker {
                image 'node:22-alpine'
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
            }
        }
        steps {
            dir('frontend') {
                sh 'npm install'
                sh 'npm run build'
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

}