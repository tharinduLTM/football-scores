pipeline {
  agent any

  environment {
    IMAGE_NAME = 'football-scores-api'
    IMAGE_TAG = "latest"
    CONTAINER_NAME = 'football-scores-test'
    SONAR_PROJECT_KEY = 'football-scores'
    SONAR_HOST_URL = 'http://localhost:9000'
    SONAR_LOGIN = 'admin'
    TRIVY_IMAGE = 'aquasec/trivy:latest'
  }

  stages {
    stage('Checkout') {
      steps {
        git 'https://github.com/tharinduLTM/football-scores.git'
      }
    }

    stage('Build') {
      steps {
        bat 'npm install'
      }
    }

    stage('Test') {
      steps {
        sh 'npm test'
      }
    }

    stage('Code Quality - SonarQube') {
      steps {
        sh '''
        docker run --rm \
          -e SONAR_HOST_URL=${SONAR_HOST_URL} \
          -e SONAR_LOGIN=${SONAR_LOGIN} \
          -v "$PWD:/usr/src" \
          sonarsource/sonar-scanner-cli \
          -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
          -Dsonar.sources=. \
          -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
        '''
      }
    }

    stage('Build Docker Image') {
      steps {
        sh 'docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .'
      }
    }

    stage('Security Scan - Trivy') {
      steps {
        sh '''
        docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
          ${TRIVY_IMAGE} image ${IMAGE_NAME}:${IMAGE_TAG}
        '''
      }
    }

    stage('Deploy to Test Environment') {
      steps {
        sh '''
        docker stop ${CONTAINER_NAME} || true
        docker rm ${CONTAINER_NAME} || true
        docker run -d -p 3000:3000 --name ${CONTAINER_NAME} ${IMAGE_NAME}:${IMAGE_TAG}
        '''
      }
    }

    stage('Release') {
      steps {
        sh 'docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:release'
      }
    }

    stage('Monitoring & Logs') {
      steps {
        echo 'Monitoring app logs and readiness check...'
        sh 'docker logs ${CONTAINER_NAME} --tail 10'
      }
    }
  }

  post {
    always {
      echo 'Cleaning up...'
      sh 'docker stop ${CONTAINER_NAME} || true'
      sh 'docker rm ${CONTAINER_NAME} || true'
    }
  }
}
