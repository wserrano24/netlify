@Library('microfront-sharedlibrary-v1')_

node{
    configFileProvider([configFile(fileId: "deployMicrofront", variable: 'deployMicrofront',targetLocation:"$WORKSPACE/deployMicrofront.groovy")]){
        def rootDir = pwd()
        def tools = load "${rootDir}/deployMicrofront.groovy"
    }
}