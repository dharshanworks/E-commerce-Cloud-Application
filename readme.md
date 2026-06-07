# CloudCart - End-to-End DevOps Project

## Overview

CloudCart is a full-stack MERN-based e-commerce application implemented with modern DevOps practices. This project demonstrates containerization, CI/CD automation, GitOps, Kubernetes orchestration, monitoring, logging, autoscaling, and load testing.

The primary objective of this project is to showcase a production-style DevOps workflow from code commit to deployment, monitoring, and observability.

---

## Architecture

```text
Developer
    │
    ▼
 GitHub Repository
    │
    ▼
 Jenkins CI/CD Pipeline
    │
    ├── SonarQube Code Analysis
    │
    ├── Docker Image Build
    │
    └── DockerHub Push
    │
    ▼
 ArgoCD (GitOps)
    │
    ▼
 Kubernetes (Minikube)
    │
    ├── Frontend Pods
    ├── Backend Pods
    ├── ConfigMaps
    ├── Secrets
    └── Services
    │
    ├── Prometheus
    ├── Grafana
    ├── Elasticsearch
    ├── Kibana
    ├── Filebeat
    └── HPA
```

---

## Technology Stack

### Frontend

* React.js
* Tailwind CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### DevOps & Cloud Native Tools

* Docker
* Kubernetes
* Jenkins
* SonarQube
* ArgoCD
* Prometheus
* Grafana
* Elasticsearch
* Kibana
* Filebeat
* Metrics Server
* Horizontal Pod Autoscaler (HPA)
* k6 Load Testing

---

## Features

### Application Features

* User Authentication
* Product Management
* Shopping Cart
* Order Management
* Responsive UI

### DevOps Features

* Dockerized Frontend and Backend
* Kubernetes Deployments and Services
* CI/CD Pipeline using Jenkins
* Automated Code Quality Checks with SonarQube
* GitOps Deployment using ArgoCD
* Real-Time Monitoring with Prometheus and Grafana
* Centralized Logging with ELK Stack
* Horizontal Pod Autoscaling
* Load Testing using k6

---

## CI/CD Workflow

1. Developer pushes code to GitHub.
2. Jenkins pipeline is triggered.
3. SonarQube performs code quality analysis.
4. Docker images are built.
5. Images are pushed to DockerHub.
6. Kubernetes manifests are updated.
7. ArgoCD detects changes automatically.
8. ArgoCD synchronizes the cluster state.
9. Application is deployed to Kubernetes.

---

## Monitoring

### Prometheus

Prometheus collects metrics from:

* Kubernetes Cluster
* Nodes
* Pods
* Services

### Grafana

Grafana visualizes:

* CPU Usage
* Memory Usage
* Pod Health
* Cluster Health
* Application Metrics

---

## Logging

### ELK Stack

#### Elasticsearch

Stores application and cluster logs.

#### Filebeat

Collects logs from Kubernetes pods and forwards them to Elasticsearch.

#### Kibana

Provides visualization and log analysis dashboards.

---

## Autoscaling

Horizontal Pod Autoscaler (HPA) automatically scales pods based on CPU utilization.

### Backend

* Minimum Replicas: 2
* Maximum Replicas: 10

### Frontend

* Minimum Replicas: 4
* Maximum Replicas: 10

---

## Load Testing

k6 is used to generate application traffic and validate autoscaling behavior.

Example:

```bash
k6 run load-test.js
```

---

## Kubernetes Resources Used

* Namespace
* Deployment
* Service
* ConfigMap
* Secret
* HorizontalPodAutoscaler

---

## Project Structure

```text
CloudCart
│
├── frontend
├── backend
├── k8s
│   ├── base
│   ├── monitoring
│   └── logging
│
├── terraform
├── Jenkinsfile
├── load-test.js
└── README.md
```

---

## Screenshots

Add screenshots in the following directory:

```text
screenshots/
├── cloudcart-homepage.png
├── jenkins-pipeline.png
├── sonarqube-dashboard.png
├── argocd-dashboard.png
├── prometheus-dashboard.png
├── grafana-dashboard.png
├── kibana-logs.png
└── hpa-scaling.png
```

---

## Skills Demonstrated

* Docker
* Kubernetes
* Jenkins
* SonarQube
* ArgoCD
* GitOps
* Prometheus
* Grafana
* ELK Stack
* CI/CD
* Monitoring
* Observability
* Autoscaling
* Load Testing

---

## Future Enhancements

* Alertmanager Integration
* Helm Charts
* GitHub Actions
* Production Cloud Deployment
* DevSecOps Integration
* Container Image Scanning

---

## Author

Dharshan R

Final Year B.Tech Information Technology

DevOps | Cloud | Kubernetes | CI/CD | GitOps Enthusiast
