# chat-app

This project is meant to demonstrate what a typical "Chat App" tutorial you would find online would look like at scale. In addition to a basic react frontend / node backend, this project includes:
* A fully containerized frontend using nginx to serve the bundle
* A horizontally scalable backend
  * Redis used both for Auth tokens and as the backing layer for web-sockets to keep presence across being connected to one of many possible back-end instances
* A separate micro-service for image processing
* Full Observability

# Running and Local Development

## Preinstall

You will need node, bun, and docker, if you don't know how to install these, this project is likely too advanced for you

### Pre-configure docker-desktop

If you plan on using Docker-Desktop to manage your local kubernetes cluster for this project, you will want to update the following configuration options
- Settings > General
  - Check "Use containerd for pulling and storing images" if not already
    - WARNING: This will switch the image registry that docker uses under the hood, you will lose all active images and containers
    - If you have any containers that your launched from the command line, now is the time to figure out how to re-produce them!
  - Click "Apply"

## Running production locally with Docker Compose

Though a monorepo, I am specifically using a base `package.json` to utilize npm-workspace features. It's more common in Enterprise that FE and BE projects live in separate repos and are owned by separate teams. All of the root directories should be thought of as such.

You can run a full-stack production version of this application locally via docker-compose

```
docker compose up -d
```

First time will take a while as it needs to pull all the remote images and build the local ones. It's quicker the next time around.

Manual database migration is needed for the app is usable.

```
cd server
bun install
bun run migrate
bun run seed # optional
```

Navigating to http://localhost:80 will let you view the running application

In addition to the frontend, the docker-compose is configured to expose the GUI interfaces for all the different services
* Postgres - No built-in GUI, run `bun run studio` from `/server` to launch Drizzle's GUI
  * Alternatively, use pg4Admin, dbBeaver, etc, w/ connection string: postgres://postgres:postgres@postgres:5432/scaled_chat_app
* Redis - http://localhost:8001
* MinIO - http://localhost:9000 - user: minioadmin, pass: minioadmin
* Grafana - http://localhost:3001
* Prometheus - http://localhost:9090

## Local Development

You can spin up each of the 3 local projects' dev-servers from their own directories. They are all configured to run on ports that don't conflict with the docker-compose and can be launch independently. You do need the docker-compose running regardless, as the dev-serves do still require the running postgres, redis, etc, to work

Note: The `/nginx` project is not a "local" project like the others. It's there simply to act as the public entry to the docker-compose, and is configured to simulate Kubernetes Ingress Controller and Load Balancer to best mimic those behavioral expectations on your local

# Preinstall

# Kubernetes

**WIP: Need to re-view and update this section. Info may be stale**

You can use any choice of local cluster options. Docker Desktop is the easiest, but I find MiniKube is the best for power-users

## Docker Desktop Kubernetes
From Docker Desktop
- Settings > Kubernetes
  - Check "Enable Kubernetes"
  - Under Cluster settings
    - check "kind"
    - kubernetes version dropdown choose latest
    - set Nodes to "2"
    - check "Show system containers (advanced)"

Click "Apply" again.

Not that unchecking "Enable Kubernetes" _destroys_ the cluster, and does not just stop it! This is very annoying because you'll lose everything you've deployed to it.

You can still stop/start it though. you simply need to select and stop the 4 containers you see in the Containers page
- Just check them all and Click The Stop/Play buttons at the top right to do them all at once

I have no idea why DockerDesktop doesn't make this easier. Hopefully in the future.

## MiniKube

### Ingress controller

Add this so ports `80` and `433` for http/https are exposed out

```
helm upgrade --install ingress-nginx ingress-nginx \
  --repo https://kubernetes.github.io/ingress-nginx \
  --namespace ingress-nginx --create-namespace 
```

### Dashboard

Note: you _must_ use the namespace kubernetes-dashboard for this to work
```bash
# install everything with helm
helm upgrade dashboard ./helm/dashboard --create-namespace --namespace kubernetes-dashboard --install --dependency-update
# create a long-lived token
kubectl get secret admin-user -n kubernetes-dashboard -o jsonpath="{.data.token}" | base64 -d
# activate the proxy -- this needs to stay running to access the dashboard
kubectl -n kubernetes-dashboard port-forward svc/kubernetes-dashboard-kong-proxy 8443:443
```

Nav to `localhost:8443` and past in the token


### Kubeview

```bash
helm repo add kv2 https://code.benco.io/kubeview/deploy/helm
helm repo update
helm install kubeview kv2/kubeview --create-namespace --namespace=kubeview
```

Kubeview uses a LoadBalancer to `localhost:8000` so it's immediately accessible

### Grafana + friends

```bash
helm repo add grafana https://grafana.github.io/helm-charts
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm install tempo grafana/tempo -n monitoring --create-namespace
helm install loki grafana/loki -n monitoring
helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring
helm install grafana grafana/grafana -n monitoring
```

### Services

- `kubectl port-forward svc/chat-svc-postgres 5432:5432`
- `kubectl port-forward svc/chat-svc-redis 6379:6379`

# Setting up Grafana

## Dashboard

Long live token:
```
kubectl get secret admin-user -n kubernetes-dashboard -o jsonpath="{.data.token}" | base64 -d
```

TODO: figure out how to config file this so I don't have to re-add manually each time
- postgres id: 9628
- redis id: 12776
- nodejs id (for bun server app): 11159

# To Fix

- elysia-logging `.onAfterResponse()` doesn't fire as expected, look into

# TODO and Ideas

- add metrics to s3 and other services
- figure out how to add `userId`, `sessionId`, etc, to all API calls and socket messages for traces/spans
  - figure out how to send those across micro-services to correctly report them

- Joined roomed (to show versus all rooms)
- Friends list? (to show versus all users)
- Reimplement room admin

- ClientSide
  - pull and persist other user info
    - thinking just do _all_ users for first time
    - on subsequent sessions, query on `updatedAt` from last check
    - should subscribe to a "user update" channel that on receive an update, will update user's `lastCheckedAt`
  - on application first load, no chat history is persisted (for now)
  - on room enter
    - subscribe from incoming updates
    - for first time, grab latest chats
    - on subsequent enter after leave, query for chats since most-recent
  - on channel leave
    - unsubscribe from incoming updates
  - Display active / inactive icons for users
    - keep it simple for starters: just show when other users are connected via the websocket

- Slack like "Canvas" page, auto-created per room
  - Integrated Markdown editing (eg like how Confluence does it)
  - Always "live"
    - Shows active users
    - Cursor Positions
    - All updates live via CRDTs
    - Basic offline support: no edit, once back online queries for updates, attempts to reconcile would-be-in-flight changes


