pipeline {
    agent any
    tools {nodejs "NODEJS"}
    stages {
        stage('Build and Test') {
            steps {
                script {
                    // Checkout the repository and save the resulting metadata
                    def scmVars = checkout([
                    $class: 'GitSCM',
                    userRemoteConfigs: [[
                        url: 'https://git.morsoftware.com/scm/mms/r-mor-management-system.git',
                        credentialsId: 'fdc77c60-4697-4ec5-a21a-ed137c0e80a5'
                      ]],
                      branches: [ [name: '*/develop'] ]
                    ])
                    
                    // Displaying the variables saving it as environment variable
                    env.GIT_COMMIT = scmVars.GIT_COMMIT
                    env.GIT_COMMIT_MSG = sh (script: 'git log -1 --pretty=%B ${GIT_COMMIT}', returnStdout: true).trim()
                }
                git branch: 'develop', credentialsId: 'fdc77c60-4697-4ec5-a21a-ed137c0e80a5', url: 'https://git.morsoftware.com/scm/mms/r-mor-management-system.git'
            }
        }
        stage('Deploy') {
            steps {
                sh 'docker-compose -f docker-compose-development.yml up --build -d'
            }
        }
    }
    post {
        success {
            script {
                slackSend(
                    message: """
                        *${currentBuild.currentResult}:* Job `${env.JOB_NAME}` build `${env.BUILD_DISPLAY_NAME}` server DEV>
                        Build commit: ${env.GIT_COMMIT}
                        Last commit message: '${env.GIT_COMMIT_MSG}'
                        More info at: ${env.BUILD_URL}
                        Time: ${currentBuild.durationString.minus(' and counting')}
                        """.stripIndent().trim(),
                    channel: 'mor-mms-prj-deploy',
                )
            }
            // slackSend channel: "mor-mms-prj-deploy", message: "Build deployed successfully - ${env.JOB_NAME} ${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)\n${env.GIT_COMMIT_MSG}"
        }
    }
}
