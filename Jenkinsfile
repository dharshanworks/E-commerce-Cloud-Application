pipeline {
agent any

stages {

    stage('Backend Dependencies') {
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

    stage('Docker Version') {
        steps {
            sh 'docker --version'
        }
    }
}

}