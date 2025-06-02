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
        echo 'Repository already checked out by Jenkins'
      }
    }

    stage('Build') {
      steps {
        bat 'npm install'
      }
    }

    stage('Test') {
      steps {
        bat 'npm test'
      }
    }

    stage('Code Quality - SonarQube') {
      steps {
        echo 'Skipping SonarQube analysis on Windows (no sh support).'
        // If you want to run SonarQube, consider using Git Bash or WSL2
      }
    }

    stage('Build Docker Image') {
      steps {
        bat 'docker build -t %IMAGE_NAME%:%IMAGE_TAG% .'
      }
    }

    stage('Security Scan - Trivy') {
      steps {
        echo 'Skipping Trivy security scan on Windows (no sh support).'
        // If you want to run Trivy, consider using Git Bash or WSL2
      }
    }

    stage('Deploy to Test Environment') {
      steps {
        bat '''
        docker stop %CONTAINER_NAME% || echo Container not running.
        docker rm %CONTAINER_NAME% || echo Container not found.
        docker run -d -p 3000:3000 --name %CONTAINER_NAME% %IMAGE_NAME%:%IMAGE_TAG%
        '''
      }
    }

    stage('Release') {
      steps {
        bat 'docker tag %IMAGE_NAME%:%IMAGE_TAG% %IMAGE_NAME%:release'
      }
    }

    stage('Monitoring & Logs') {
      steps {
        echo 'Displaying the last 10 lines of Docker container logs:'
        bat 'docker logs %CONTAINER_NAME% --tail 10'
      }
    }
  }

  post {
    always {
      echo 'Cleaning up...'
      bat '''
      docker stop %CONTAINER_NAME% || echo Container not running.
      docker rm %CONTAINER_NAME% || echo Container not found.
      '''
    }
  }
}
