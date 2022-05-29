# Keep3r web
Keep3r Network is a decentralized keeper network – it connects projects off-loading devops jobs and external teams ready to help.  
A Job is a term used to refer to a smart contract which is awaiting for an external entity to perform an action.

## Installation
In order to run the project, a few things will be required.

#### Github Auth Token
The project is using the @yearn/web-lib library for basic layout, components, contexts, etc. This package is deployed on GitHub via the Npm registry. In order to install it, a valid GitHub Personal Token should be set on your machine. This token is used to authenticate the requests to the Npm registry. You can follow [this](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-to-github-packages) documentation to install it.

##### Installation
Next step will be to install the dependencies. You need to make sure [Yarn](https://yarnpkg.com/) is installed on your machine and ready to use. Then, run the following command: `yarn`

##### Environment
A few environment variables are required to run the project. You need to create a `.env` file in the root of the project and set the following variables:
```
ALCHEMY_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
INFURA_KEY=YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
RPC_URL_MAINNET=https://your_rpc_url_for_mainnet
```

#### Run
You can then simply run the project by running the following command: `yarn dev`. By default, the project will run on port 3000.