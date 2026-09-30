pipeline {
  agent any

  tools {
    nodejs 'node20'
  }

  environment {
    IMAGE_NAME = "react-app"
    IMAGE_TAG  = "v${BUILD_NUMBER}"
  }

  stages {

    stage('Checkout') {
      steps {
        checkout([
          $class: 'GitSCM',
          branches: [[name: '*/main']],
          extensions: [
            [$class: 'CloneOption', shallow: true, depth: 1, timeout: 30]
          ],
          userRemoteConfigs: [[url: 'https://github.com/Ariyoola45/hotel']]
        ])
      }
    }

    stage('Install & Build') {
      steps {
        dir('app') {
          sh 'npm install'
          sh 'npm run build'
        }
      }
    }

    stage('SonarQube Analysis') {
      steps {
        dir('app') {
          withSonarQubeEnv('MySonarQube') {
            sh "${tool 'sonar-scanner'}/bin/sonar-scanner"
          }
        }
      }
    }

    stage('Quality Gate') {
      steps {
        timeout(time: 15, unit: 'MINUTES') {
          waitForQualityGate abortPipeline: true
        }
      }
    }

    stage('Docker Build') {
      steps {
        dir('app') {
          sh 'docker build -t $IMAGE_NAME:$IMAGE_TAG .'
        }
      }
    }

    stage('Load into Minikube') {
      steps {
        sh 'minikube image load $IMAGE_NAME:$IMAGE_TAG'
      }
    }

    stage('Deploy - All Targets') {
      parallel {

        stage('Kubernetes') {
          steps {
            sh '''
              kubectl set image deployment/horizon-hotel-management-system \
                react-app=$IMAGE_NAME:$IMAGE_TAG

              kubectl rollout status deployment/horizon-hotel-management-system
            '''
          }
        }

        stage('Firebase Hosting') {
          steps {
            dir('app') {
              withCredentials([
                string(
                  credentialsId: 'TOKEN-FIREBASES',
                  variable: 'FIREBASE_TOKEN'
                )
              ]) {
                sh 'firebase deploy --only hosting --token "$FIREBASE_TOKEN"'
              }
            }
          }
        }

        stage('Vercel') {
          steps {
            dir('app') {
              withCredentials([
                string(
                  credentialsId: 'VERCEL-TOKEN',
                  variable: 'VERCEL_TOKEN'
                )
              ]) {
                sh 'vercel --token "$VERCEL_TOKEN" --prod --yes'
              }
            }
          }
        }
      }
    }
  }

  post {
    success {
      echo "Build ${IMAGE_TAG} deployed successfully."
    }

    failure {
      echo "Pipeline failed — check the stage logs above."
    }

    always {
      cleanWs()
    }
  }
}