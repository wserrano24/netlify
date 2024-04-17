# pfi-bkm-mfe-lap-dashboard-v1

This project **requires** Node version **v16.17.1 LTS** or greater

## Project setup

You need to set the enviroments files into the project

- **.env** for **production** enviroment
- **.env.dev** for **development** enviroment


## Setup

Install your environment

```
npm install

```

Build

```
npm run build

```


## Webpack Config

In the **webpack.config.js** file make sure you have the following settings

- Ensure that the const are set:

```

NAME = "mfeDashboard";
FILENAME = "remoteEntry.js"
PORT = 8090

```

It is necessary to rename the **dist** folder to **pfi-bkm-mfe-lap-dashboard-v1** after make a build.

### Production settings

- Change the property **config.output.publicPath** with the dns where the microfrontend will be deployed (cloudfront, netlify) + the name of the microfrontend (**pfi-bkm-mfe-lap-dashboard-v1**)

ex:
```

config.output.publicPath: "https://advance-front.apibaz.com/pfi-bkm-mfe-lap-dashboard-v1/",

```
