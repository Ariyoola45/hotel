// ============================================================================
// Jenkinsfile — Horizon Hotel Hospitality Management System
// ----------------------------------------------------------------------------
// Declarative pipeline: install -> lint -> test -> build -> Docker build ->
// push to registry -> deploy. Firebase config is pulled from Jenkins
// credentials at build time and passed in as Docker build args, so no
// secrets are ever committed to source control.
//
// Required Jenkins credentials (Manage Jenkins > Credentials):
//   - "dockerhub-creds"        (Username/Password) — Docker registry login
//   - "firebase-api-key"       (Secret text)
//   - "firebase-auth-domain"   (Secret text)
//   - "firebase-project-id"    (Secret text)
//   - "firebase-storage-bucket"(Secret text)
//   - "firebase-sender-id"     (Secret text)
//   - "firebase-app-id"        (Secret text)
//
// Required Jenkins plugins: Docker Pipeline, Pipeline: Stage View, Credentials Binding
// ============================================================================

pipeline {
    agent any

    environment {
        IMAGE_NAME   = "yourdockerhubuser/horizon-hotel-app"
        IMAGE_TAG    = "${env.BUILD_NUMBER}"
        REGISTRY_CRED = "dockerhub-creds"
    }

    options {
        timestamps()
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '15'))
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('app') {
                    sh 'npm ci'
                }
            }
        }

        stage('Lint') {
            steps {
                dir('app') {
                    sh 'npm run lint || true'   // non-blocking: surfaces warnings without failing the build
                }
            }
        }

        stage('Test') {
            steps {
                dir('app') {
                    // If/when unit tests are added (e.g. Vitest), this becomes:
                    //   sh 'npm run test -- --run'
                    sh 'echo "No automated test suite configured yet — placeholder stage."'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('app') {
                    sh 'npm run build'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                withCredentials([
                    string(credentialsId: 'firebase-api-key',        variable: 'FB_API_KEY'),
                    string(credentialsId: 'firebase-auth-domain',    variable: 'FB_AUTH_DOMAIN'),
                    string(credentialsId: 'firebase-project-id',     variable: 'FB_PROJECT_ID'),
                    string(credentialsId: 'firebase-storage-bucket', variable: 'FB_STORAGE_BUCKET'),
                    string(credentialsId: 'firebase-sender-id',      variable: 'FB_SENDER_ID'),
                    string(credentialsId: 'firebase-app-id',         variable: 'FB_APP_ID'),
                ]) {
                    dir('app') {
                        sh """
                          docker build \
                            --build-arg VITE_FIREBASE_API_KEY=$FB_API_KEY \
                            --build-arg VITE_FIREBASE_AUTH_DOMAIN=$FB_AUTH_DOMAIN \
                            --build-arg VITE_FIREBASE_PROJECT_ID=$FB_PROJECT_ID \
                            --build-arg VITE_FIREBASE_STORAGE_BUCKET=$FB_STORAGE_BUCKET \
                            --build-arg VITE_FIREBASE_MESSAGING_SENDER_ID=$FB_SENDER_ID \
                            --build-arg VITE_FIREBASE_APP_ID=$FB_APP_ID \
                            -t ${IMAGE_NAME}:${IMAGE_TAG} \
                            -t ${IMAGE_NAME}:latest .
                        """
                    }
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: "${REGISTRY_CRED}",
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh """
                      echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                      docker push ${IMAGE_NAME}:${IMAGE_TAG}
                      docker push ${IMAGE_NAME}:latest
                    """
                }
            }
        }

        stage('Deploy') {
            steps {
                sh """
                  export IMAGE_TAG=${IMAGE_TAG}
                  docker compose -f docker-compose.yml pull app || true
                  docker compose -f docker-compose.yml up -d --build
                """
            }
        }
    }

    post {
        success {
            echo "✅ Build #${env.BUILD_NUMBER} deployed successfully: ${IMAGE_NAME}:${IMAGE_TAG}"
        }
        failure {
            echo "❌ Build #${env.BUILD_NUMBER} failed. Check the stage logs above."
        }
        always {
            sh 'docker image prune -f || true'
        }
    }
}
