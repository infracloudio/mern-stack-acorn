# Deploying Mern Stack Application on Acorn

The MERN stack, comprising MongoDB, Express.js, React.js, and Node.js, is a comprehensive web development framework, and a variant of the MEAN stack. Complementing this, [Acorn](http://www.acorn.io) serves as a user-friendly cloud platform, offering a substantial free sandbox accessible through GitHub account as Sign-in option . Designed for simplified deployment of modern cloud-native apps, Acorn leverages familiar development workflows and mainstream container tools, eliminating the complexities associated with provisioning or configuring underlying cloud resources. In essence, Acorn provides the power of Kubernetes and Terraform without the intricate setup.

In deploying an application on Acorn, defining it as an [Acornfile](https://docs.acorn.io/reference/acornfile) is the initial step, resulting in an Acorn Image deployable on the platform. This tutorial guides you through provisioning a sample MERN Application on Acorn, following the standard [MongoDB sample application guide](https://www.mongodb.com/languages/mern-stack-tutorial). The application created in this walkthrough is a Record List for Employees.

If you want to skip to the end, just click [Run in Acorn](https://acorn.io/run/ghcr.io/infracloudio/mern-acorn:v1.%23.%23-%23?ref=slayer321&name=mern) to launch the app immediately in a free sandbox environment. All you need to join is a GitHub ID to create an account.

_Note: Everything shown in this tutorial can be found in [this repository](https://github.com/infracloudio/mern-stack-acorn)_.

## Pre-requisites

- Acorn CLI: The CLI allows you to interact with the Acorn Runtime as well as Acorn to deploy and manage your applications. Refer to the [Installation documentation](https://docs.acorn.io/installation/installing) to install Acorn CLI for your environment.
- A GitHub account is required to sign up and use the Acorn Platform.

## Acorn Login

Log in to the [Acorn Platform](http://acorn.io) using the GitHub Sign-In option with your GitHub user.
![Login Screen](./assets/acorn-login-page.png)

After the installation of Acorn CLI for your OS, you can login to the Acorn platform.

```sh
$ acorn login
```

## Create the MERN Application

In this tutorial will create a simple MERN app from the [MongoDB sample application guide](https://www.mongodb.com/languages/mern-stack-tutorial). It is a simple application that provides standard CRUD features which act as a record list for employees. In Acorn, there are two ways you can deploy your MERN application.

1. Using Acorn platform dashboard.
2. Using CLI

The Acorn platform dashboard is the easiest one where, in just a few clicks you can deploy the MERN application on the platform and start using it. However, if you want to customize the application or to understand how to run your own MERN applications using Acorn, use the second option os recommended.

## Deploying Using Acorn Dashboard

In this option you use the published Acorn application image to deploy the MERN sample application in just a few clicks. It allows you to deploy your applications faster without any additional configurations. Let us see below how you can deploy the mern app to the Acorn platform dashboard.

1. Login to the [Acorn Platform](https://acorn.io/auth/login) using the Github Sign-In option with your Github user.
2. Select the “Create Acorn” option.
3. Choose the source for deploying your Acorns
   3.1. Select “From Acorn Image” to deploy the sample Application.
   ![](./assets/select-from-acorn-image.png)

   3.2. Provide a name "Mern Sample Acorn”, use the default Region and provide the URL for the Acorn image and click Create.

   ```
   ghcr.io/infracloudio/mern-acorn:v1.#.#-#
   ```

   ![](./assets/mern-deployment-preview.png)

>_Note: The App will be deployed in the Acorn Sandbox Environment. As the App is provisioned on AcornPlatform in the sandbox environment it will only be available for 2 hrs and after that it will be shutdown. Upgrade to a pro account to keep it running longer_.

4. Once the Acorn is running, you can access it by clicking the Endpoint or the redirect link.
   
   4.1. Running Application on Acorn
   ![Running MERN Application](./assets/mern-running-on-platform.png)
   
   4.2. Running MERN app
   ![Running Main MERN Application](./assets/mern-main-app.png)

## Deploying Using Acorn CLI

As mentioned previously, running the acorn application using CLI lets you understand the Acornfile. With the CLI option, you can customize the sample app to your requirement or use your Acorn knowledge to run your own MERN application.

To run the application using CLI you first need to clone the source code repository on your machine.

```
$ git clone https://github.com/infracloudio/mern-stack-acorn.git
```

Once cloned here’s how the directory structure will look.

```
.
├── Acornfile
├── client
│   ├── cypress
|   |.....
│  
├── LICENSE
├── mern.png
├── README.md
├── server
│   ├── config.env
|   |.....
│   └── server.mjs
└── tutorial.md

```

### Understanding the Acornfile

We have the sample MERN Application ready. Now to run the application we need an Acornfile which describes the whole application without all of the boilerplate of Kubernetes YAML files. The Acorn CLI is used to build, deploy, and operate Acorn on the Acorn cloud platform. It also can work on any Kubernetes cluster running the open source Acorn Runtime.

Below is the Acornfile for deploying the Mern app that we created earlier:

```sh
args: {
  mongodbname: "mongodb"
}

services: db: {
    image: "ghcr.io/acorn-io/mongodb:v#.#-#"
    serviceArgs: {
      dbName: args.mongodbname
  }
}
containers: {
   server: {
      build: {
         context:    "./server"
         dockerfile: "./server/Dockerfile"
      }
      dirs: "/usr/src/app": "./server"
      ports: publish: "5050:5050/http"
      if args.dev{
      dirs: {
         "/usr/src/app": "./server"
      }
      }
      env: {
         DB_HOST: "@{service.db.address}"
         DB_PORT: "@{service.db.port.27017}"
         DB_NAME: "@{service.db.data.dbName}"
         DB_USER: "@{service.db.secrets.admin.username}"
         DB_PASS: "@{service.db.secrets.admin.password}"
      }
      consumes: ["db"]
   }
   client: {
      build: {
         context:    "./client"
         dockerfile: "./client/Dockerfile"
      }
      memory: 1536Mi
      dirs: "/usr/src/app": "./client"
      ports: publish: "3000:3000/http"
      env: {
         REACT_APP_SERVER_HOST: "@{services.server.endpoint}"
      }
      if args.dev{
      dirs: {
         "/usr/src/app": "./client"
         }
      }
      dependsOn: ["server"]
   }

}
```

There are 3 requirements for running MERN Application

- Client
- Server
- DB

The above Acornfile has the following elements:

- **Args**: Which is used to take the user args.
- **Services**: Here we're using the [MongoDB](https://github.com/acorn-io/mongodb) service that is built into Acorn as an [Acorn Service](https://docs.acorn.io/reference/services).
- **Containers**: We define a two container named client and server which define the following configurations:
  - **Server**:
    - **build**: details required to build a Mern server Application
    - **dirs**: this field is used to mount our application to a specific directory.
    - **ports**: port where our application is listening on.
    - **env**: In the env section we are providing all the env variables which the server application will be using.
    - **consumes**: here server consumes DB
  - **Client**:
    - **build**: details required to build a Mern client Application
    - **dirs**: this field is used to mount our application to a specific directory.
    - **ports**: port where our application is listening on.
    - **env**: In the env section we are providing all the env variables which the server application will be using.
    - **memory**: memory used by client
    - **dependsOn**: here client depends on server

### Running the Application

We have already logged in using Acorn CLI now you can directly deploy applications on your sandbox on the Acorn platform. Run the following command from the root of the directory.

```
$ acorn run -n mern-app -i
```

Below is what the output looks like.

![](./assets/mern-local-run.png)

## The Mern Application

To use this application click on the link given by Acorn Platform. This will show you the application home page. Here you can create Employees in Record List. Once added you can edit and delete it as well.

![](./assets/mern-main-app.png)

## Running the app in dev mode

If you are developing your application and don't want to start and stop the application everytime you make the changes you can use the incredibly helpful Acorn Dev Mode. Running in dev mode allows you to do continous development of the application, and have your running instance reflect the changes as soon as you save your changes. Run the following command.

```
$ acorn dev -n mern-app .
```

## Push an artifact to a registry

Using the Dev mode you can easily modify the application as per your requirement and once the application is working as expected and is ready to be built and packaged, push it to a registry. You can push it to any OCI registry. We will use Github Container Registry in this example. Once published, you can use the acorn image to deploy it directly in the Acorn platform using the dashboard or CLI, as described previously.

### Log in to the registry

Log in to the registry with the command below and follow the prompts.

```
$ acorn login ghcr.io
```

### Build and push the image

Build and push the image with the below command.

```
$ acorn build --push -t ghcr.io/infracloudio/mern-acorn:v1.0.0-0
```

Once the application is built and pushed you can use those images to run your application on Acorn Platform.

## What's Next?

1. The App is provisioned on Acorn Platform and is available for two hours. Upgrade to Pro account for anything you want to keep running longer.
2. After deploying you can edit the Acorn Application or remove it if no longer needed. Click the Edit option to edit your Acorn's Image. Toggle the Advanced Options switch for additional edit options.
3. Remove the Acorn by selecting the Remove option from your Acorn dashboard.

## Conclusion

In this tutorial we show how we can use the Acornfile and get our Mern application up and running and it’s very easy to make changes to the Application file when you are developing it without the need of restarting your application. If you are looking to run the application directly you can run it on Acorn Platform by providing the image name.
