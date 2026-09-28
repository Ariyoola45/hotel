pipeline {
  agent any

  environment {
    IMAGE_NAME = "react-app"
    IMAGE_TAG  = "v${BUILD_NUMBER}"
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Install & Build') {
      steps {
        sh 'npm install'
        sh 'npm run build'
      }
    }

    stage('SonarQube Analysis') {
      steps {
        withSonarQubeEnv('MySonarQube') {
          sh 'sonar-scanner'
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

    stage('Docker Build') {
      steps { sh 'docker build -t $IMAGE_NAME:$IMAGE_TAG .' }
    }

    stage('Load into Minikube') {
      steps { sh 'minikube image load $IMAGE_NAME:$IMAGE_TAG' }
    }

    stage('Deploy - All Targets') {
      parallel {
        stage('Kubernetes') {
          steps {
            sh 'kubectl set image deployment/react-app react-app=$IMAGE_NAME:$IMAGE_TAG'
          }
        }
        stage('Firebase Hosting') {
          steps {
            withCredentials([string(credentialsId: 'firebase-token', variable: 'TOKEN-FIREBASES')]) {
              sh 'firebase deploy --only hosting --token "$TOKEN-FIREBASES"'
            }
          }
        }
        stage('Vercel') {
          steps {
            withCredentials([string(credentialsId: 'vercel-token', variable: 'VERCEL-TOKEN')]) {
              sh 'vercel --token "$VERCEL-TOKEN" --prod --yes'
            }
          }
        }
      }
    }
  }

  post {
    success { echo "Build ${IMAGE_TAG} deployed successfully." }
    failure { echo "Pipeline failed — check the stage logs above." }
    always  { cleanWs() }
  }
}