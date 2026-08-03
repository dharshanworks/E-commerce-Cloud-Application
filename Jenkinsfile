pipeline {
    agent any

    options {
        timestamps()
    }

    environment {
        AWS_REGION = "ap-south-1"
        AWS_ACCOUNT_ID = "747848915242"

        BACKEND_IMAGE = "cloudcart-backend"
        FRONTEND_IMAGE = "cloudcart-frontend"

        BACKEND_ECR = "747848915242.dkr.ecr.ap-south-1.amazonaws.com/cloudcart-backend"
        FRONTEND_ECR = "747848915242.dkr.ecr.ap-south-1.amazonaws.com/cloudcart-frontend"

        IMAGE_TAG = "${BUILD_NUMBER}"

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

        stage('Skip Jenkins Commit') {
            steps {
                script {

                    def msg = sh(
                        script: "git log -1 --pretty=%s",
                        returnStdout: true
                    ).trim()

                    echo "Latest Commit: ${msg}"

                    if (msg.contains("[skip-jenkins]")) {

                        currentBuild.description = "Skipped Jenkins self-trigger"

                        catchError(buildResult: 'NOT_BUILT', stageResult: 'NOT_BUILT') {
                            error("Stopping Jenkins self-trigger.")
                        }
                    }
                }
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
                    sh 'npm ci'
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir('frontend') {
                    sh 'npm ci'
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
                sh 'docker build -t ${BACKEND_IMAGE}:${IMAGE_TAG} ./backend'
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                sh 'docker build -t ${FRONTEND_IMAGE}:${IMAGE_TAG} ./frontend'
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
                        ${BACKEND_IMAGE}:${IMAGE_TAG}
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
                        ${FRONTEND_IMAGE}:${IMAGE_TAG}
                '''
            }
        }

        stage('Archive Trivy Reports') {
            steps {
                archiveArtifacts artifacts: 'trivy-report/*.txt', fingerprint: true
            }
        }

        stage('Login to Amazon ECR') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-ecr'
                ]]) {
                    sh '''
                        export AWS_PAGER=""

                        aws ecr get-login-password \
                            --region ${AWS_REGION} | docker login \
                            --username AWS \
                            --password-stdin \
                            ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                    '''
                }
            }
        }

        stage('Tag Backend Image') {
            steps {
                sh '''
                    docker tag ${BACKEND_IMAGE}:${IMAGE_TAG} \
                        ${BACKEND_ECR}:${IMAGE_TAG}

                    docker tag ${BACKEND_IMAGE}:${IMAGE_TAG} \
                        ${BACKEND_ECR}:latest
                '''
            }
        }

        stage('Tag Frontend Image') {
            steps {
                sh '''
                    docker tag ${FRONTEND_IMAGE}:${IMAGE_TAG} \
                        ${FRONTEND_ECR}:${IMAGE_TAG}

                    docker tag ${FRONTEND_IMAGE}:${IMAGE_TAG} \
                        ${FRONTEND_ECR}:latest
                '''
            }
        }

        stage('Push Backend Image') {
            steps {
                sh '''
                    docker push ${BACKEND_ECR}:${IMAGE_TAG}
                    docker push ${BACKEND_ECR}:latest
                '''
            }
        }

        stage('Push Frontend Image') {
            steps {
                sh '''
                    docker push ${FRONTEND_ECR}:${IMAGE_TAG}
                    docker push ${FRONTEND_ECR}:latest
                '''
            }
        }

        stage('Update Helm Image Tags') {
            steps {
                sh """
                    sed -i 's/tag: .*/tag: ${IMAGE_TAG}/' helm/cloudcart-backend/values.yaml
                    sed -i 's/tag: .*/tag: ${IMAGE_TAG}/' helm/cloudcart-frontend/values.yaml
                """

                sh '''
                    echo "Backend values.yaml"
                    cat helm/cloudcart-backend/values.yaml

                    echo "Frontend values.yaml"
                    cat helm/cloudcart-frontend/values.yaml
                '''
            }
        }

        stage('Update GitOps Repository') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'github-creds',
                        usernameVariable: 'GIT_USERNAME',
                        passwordVariable: 'GIT_TOKEN'
                    )
                ]) {

                    sh '''
                        rm -rf gitops

                        git clone https://${GIT_USERNAME}:${GIT_TOKEN}@github.com/dharshanworks/CloudCart-GitOps.git gitops

                        sed -i "s/tag:.*/tag: ${IMAGE_TAG}/" gitops/cloudcart-backend/values.yaml
                        sed -i "s/tag:.*/tag: ${IMAGE_TAG}/" gitops/cloudcart-frontend/values.yaml

                        cd gitops

                        git config user.name "Jenkins"
                        git config user.email "jenkins@cloudcart.com"

                        git add .

                        if ! git diff --cached --quiet; then
                            git commit -m "Update image tag to ${IMAGE_TAG}"
                            git push origin main
                        else
                            echo "No GitOps changes"
                        fi
                    '''
                }
            }
        }

    }

    post {
        success {
            echo 'Pipeline completed successfully.'
        }

        failure {
            script {
                if (currentBuild.result != 'NOT_BUILT') {
                    echo 'Pipeline failed.'
                }
            }
        }

        always {
            cleanWs()
        }
    }
}