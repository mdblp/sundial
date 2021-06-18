#!groovy
@Library('mdblp-library') _
pipeline {
    agent any
    triggers {
        //Check for modifications in Bitbucket every hours
        //This is the condition for the bitbucket webhook trigger to work
        pollSCM('30 * * * *')
    }
    environment {
        JUNIT_REPORT_PATH = "tests/report.xml"
    }
    stages {
        stage('Build & package') {
            agent {
                dockerfile {
                    filename 'jenkins-build.dockerfile'
                    reuseNode true
                }
            }
            steps {
                withCredentials([string(credentialsId: 'nexus-token', variable: 'NEXUS_TOKEN')]) {
                    sh 'npm run build-ci'
                    stash name: "test", includes: "**"
                }
            }
        }
        stage('Running tests') {
            agent {
                docker {
                    image 'node:12-alpine'
                }
            }
            steps {
                dir("test-dir") {
                    unstash "test"
                }
                withCredentials([string(credentialsId: 'nexus-token', variable: 'NEXUS_TOKEN')]) {
                    sh '''
                        cd test-dir
                        npm run test
                    '''
                }
            }
        }
        stage('Publish') {
            when { branch "master" }
            steps {
                publish()
            }
        }
   }

}