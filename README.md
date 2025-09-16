# chat-app

Building a chat app for the express purpose of learning how to deploy a frontend, backend, managed postgres/redis, etc, on _n_-number of Cloud providers

# CLI Snippets

# Preinstall

## Docker Desktop
- Settings > General
  - Check "Use containerd for pulling and storing images" if not already
    - WARNING: This will switch the image registry that docker uses under the hood, you will lose all active images and containers
    - If you have any containers that your launched from the command line, now is the time to figure out how to re-produce them!

Click "Apply", then...

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


## Ingress controller

Add this so ports `80` and `433` for http/https are exposed out

```
helm upgrade --install ingress-nginx ingress-nginx \
  --repo https://kubernetes.github.io/ingress-nginx \
  --namespace ingress-nginx --create-namespace 
```

## Dashboard

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


## Kubeview

```bash
helm repo add kv2 https://code.benco.io/kubeview/deploy/helm
helm repo update
helm install kubeview kv2/kubeview --create-namespace --namespace=kubeview
```

Kubeview uses a LoadBalancer to `localhost:8000` so it's immediately accessable

## Grafana + friends

```bash
helm repo add grafana https://grafana.github.io/helm-charts
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm install tempo grafana/tempo -n monitoring --create-namespace
helm install loki grafana/loki -n monitoring
helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring
helm install grafana grafana/grafana -n monitoring
```

## Services

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
