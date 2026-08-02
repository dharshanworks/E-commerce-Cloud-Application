pipeline {
    agent any

    options {
        timestamps()
    }

    environment {
        BACKEND_IMAGE = "cloudcart-backend"
        FRONTEND_IMAGE = "cloudcart-frontend"
        SONAR_SCANNER = tool 'SonarScanner'
        DEPENDENCY_CHECK = tool 'DependencyCheck'
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
                sh 'trivy --version'
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

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh """
                        ${SONAR_SCANNER}/bin/sonar-scanner \
                        -Dsonar.projectKey=CloudCart \
                        -Dsonar.projectName=CloudCart \
                        -Dsonar.sources=. \
                        -Dsonar.sourceEncoding=UTF-8
                    """
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('OWASP Dependency Check') {
            steps {

                sh 'mkdir -p dependency-check-report'

                dependencyCheck(
                    odcInstallation: 'DependencyCheck',
                    additionalArguments: '''
                        --scan .
                        --format HTML
                        --format XML
                        --out dependency-check-report
                    '''
                )

                dependencyCheckPublisher(
                    pattern: 'dependency-check-report/dependency-check-report.xml'
                )
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

        stage('Trivy Scan Backend Image') {
            steps {
                sh '''
                    mkdir -p trivy-report

                    trivy image \
                        --severity HIGH,CRITICAL \
                        --format table \
                        -o trivy-report/backend-report.txt \
                        ${BACKEND_IMAGE}:latest
                '''
            }
        }

        stage('Trivy Scan Frontend Image') {
            steps {
                sh '''
                    trivy image \
                        --severity HIGH,CRITICAL \
                        --format table \
                        -o trivy-report/frontend-report.txt \
                        ${FRONTEND_IMAGE}:latest
                '''
            }
        }

        stage('Archive Trivy Reports') {
            steps {
                archiveArtifacts artifacts: 'trivy-report/*.txt', fingerprint: true
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