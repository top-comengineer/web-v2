# Keep3r Web
Keep3r Network is a decentralized keeper network – it connects projects off-loading devops jobs and external teams ready to help.    
A Job is a term used to refer to a smart contract which is awaiting for an external entity to perform an action.  

This project is in beta. Use at your own risk. You can access the current deployed version here: [keep3r.network](https://keep3r.network/)  

## Installation
This project is developed with React & NextJs, is using TailwindCSS for the styling, the [Yearn Web Lib](https://github.com/yearn/web-lib) for the templating and is deployed on Vercel. A backend has been deployed to gather events from the Keep3r contract and populate the statistic pages.  
In order to run the project, a few things will be required.  

#### Github Auth Token
The project is using the @yearn-finance/web-lib library for basic layout, components, contexts, etc. This package is deployed on GitHub via the Npm registry. In order to install it, a valid GitHub Personal Token should be set on your machine. This token is used to authenticate the requests to the Npm registry. You can follow [this](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-to-github-packages) documentation to install it.  

#### Installation
Next step will be to install the dependencies. You need to make sure [Yarn](https://yarnpkg.com/) is installed on your machine and ready to use. Then, run the following command: `yarn`.  

#### Environment
A few environment variables are required to run the project. You need to create a `.env` file in the root of the project and set the following variables:  
```
ALCHEMY_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
INFURA_KEY=YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
RPC_URL_MAINNET=https://your_rpc_url_for_mainnet
```

#### Run
You can then simply run the project by running the following command: `yarn dev`. By default, the project will run on port 3000.  
