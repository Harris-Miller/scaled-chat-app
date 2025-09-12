# chat-app

Building a chat app for the express purpose of learning how to deploy a frontend, backend, managed postgres/redis, etc, on _n_-number of Cloud providers

## Stage 1
- auth is just simple username/password system (no email)
  - cookie access/refresh tokens enabled (backed by redis), but no OAuth of any kind
- landing page has simple "create or join" chat room names
  - creating a room needs a name, is assigned a ulid, which can be used to join
  - can list available rooms (virtualized, look in tanstack for this)
- chat is done
  - via websockets and broadcasting
  - history kept in DB
  - stretch: show chat history upon re-enter
- docker-compose includes httpd project that simulates kubernetes nginx load balancer

## Stage 2
- socket.io redis adapter for scaling, use deploy option on docker-compose on server to test
- allow users to post pictures, storing in a `localStack` container for docker-compose
- show all rooms a user has joined, user can leave a room
- user can add metadata and profile pic
  - use npm package `sharp` to create thumbnails of the profile pics

## Stage 3
- Set up local Kubernetes through DockerDesktop
- Helm Chart to manage deployment and orchestrations

## Stage 4
- ???

