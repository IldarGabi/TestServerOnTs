# MongoDB Installation Guide using Docker

Follow these steps to install and run MongoDB locally using Docker.

## 1. Check if Docker is installed on your computer

Run the following command in your terminal:

```bash
$ docker -v
```
## 1.1 If Docker is not installed, download and install it from the [official website](https://www.docker.com/products/docker-desktop/)

## 2. Download the MongoDB container image from the Docker repository

```bash
$ docker pull mongo
```
## 3. Verify that the container image has been downloaded

```bash
$ docker ps -a
```
## 4. Run the MongoDB container

```bash
$ docker run -d -p 27017:27017 --name <dockerContainererName> -v mongo-data:/data/db -e MONGODB_INITDB_ROOT_USERNAME=<userRootName> -e MONGODB_INITDB_ROOT_PASSWORD=<userRootPassword> mongo:latest

```
Explanation of the command:

* `-d`: runs the container in detached mode (in the background).
* `-p` 27017:27017: maps port 27017 on the host machine to the container, allowing you to connect to MongoDB.
* `--name mongodb`: assigns the name mongodb to the container.
mongo: specifies that you want to use the downloaded MongoDB image.
* `-e MONGODB_INITDB_ROOT_USERNAME`: set env for root username for connct DB   
* `-e MONGODB_INITDB_ROOT_PASSWORD`: set env for root password for connct DB
* `mongo:latest`: specifies that you want to use the downloaded MongoDB image.

## 5. Check if the container is running

```bash
$ docker ps
```

## 6. Download and install the MongoDB Compass UI client

For easier interaction with MongoDB, download MongoDB Compass from [official website](https://www.mongodb.com/try/download/compass)

## 7. Connect to the local MongoDB database on port 27017

Use MongoDB Compass or any other MongoDB client to connect to your local database using the following connection string:
`mongodb://localhost:27017`
