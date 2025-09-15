# chat-app

Building a chat app for the express purpose of learning how to deploy a frontend, backend, managed postgres/redis, etc, on _n_-number of Cloud providers

# CLI Snippets

# Preinstall

## Ingress controller

You need to add this manually to correctly expose `localhost:80` via Ingress objects
- `kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.13.2/deploy/static/provider/cloud/deploy.yaml`

## Dashboard

Run in order:
- `kubectl apply -f ./kube/dashboard.yml`
- `helm upgrade --install kubernetes-dashboard kubernetes-dashboard/kubernetes-dashboard --create-namespace --namespace kubernetes-dashboard`
- `kubectl -n kubernetes-dashboard port-forward svc/kubernetes-dashboard-kong-proxy 8443:443`

Dashboard will then display on `localhost:8443`

### Installing dashboard and generating API Key

TODO

## Kubeview

```bash
helm repo add kv2 https://code.benco.io/kubeview/deploy/helm
helm repo update
helm install kubeview kv2/kubeview --create-namespace --namespace=kubeview
```

This is an helm "application" and you do not need to port-forward. Available at `localhost:8000`

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

TODO: figure out how to config file this so I don't have to re-add manually each time
- postgres id: 9628
- redis id: 12776
- nodejs id (for bun server app): 11159
