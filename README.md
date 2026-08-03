# 🚀 CloudCart - Production-Grade MERN DevOps Platform on AWS EKS

> A production-inspired cloud-native three-tier MERN application deployed on Amazon EKS using modern DevOps practices including CI/CD, GitOps, Kubernetes, Monitoring, and Centralized Logging.

---

## 📌 Project Overview

CloudCart is a full-stack e-commerce application designed to demonstrate an end-to-end DevOps workflow on AWS.

The project showcases how modern DevOps teams build, secure, deploy, monitor, and operate containerized applications using Kubernetes and industry-standard tools.

---

# 🏗 Architecture

<p align="center">
  <img src="docs/architecture/cloudcart-architecture.png" alt="CloudCart Architecture" width="100%">
</p>

---

# 🚀 DevOps Workflow

```text
Developer
    │
    ▼
GitHub Repository
    │
    ▼
Jenkins CI/CD Pipeline
    │
    ├───────────────► SonarQube
    │
    ├───────────────► Trivy Scan
    │
    └───────────────► OWASP Dependency Check
    │
    ▼
Docker Build
    │
    ▼
Amazon ECR
    │
    ▼
ArgoCD (GitOps)
    │
    ▼
Amazon EKS
    │
    ├── Frontend
    ├── Backend
    └── MongoDB Atlas
    │
    ▼
AWS Application Load Balancer
    │
    ▼
Users

Monitoring
Prometheus → Grafana

Logging
Filebeat → Elasticsearch → Kibana
```

---

# ✨ Features

- Three-Tier MERN Architecture
- Containerized using Docker
- Kubernetes Deployment
- GitOps with ArgoCD
- Automated CI/CD Pipeline
- Code Quality Analysis
- Container Vulnerability Scanning
- Dependency Security Scanning
- AWS Load Balancer
- Persistent Storage using EBS CSI Driver
- Application Monitoring
- Centralized Logging
- Production-inspired Kubernetes Deployment

---

# 🛠 Technology Stack

## Frontend

- React
- Tailwind CSS
- Axios

## Backend

- Node.js
- Express.js
- JWT Authentication
- Swagger API

## Database

- MongoDB Atlas

---

# ☁ AWS Services

- Amazon EKS
- Amazon ECR
- EC2
- IAM
- VPC
- Route 53
- Application Load Balancer
- EBS CSI Driver
- IRSA (IAM Roles for Service Accounts)

---

# ⚙ DevOps Stack

## CI/CD

- Jenkins

## GitOps

- ArgoCD

## Containerization

- Docker

## Container Registry

- Amazon ECR

## Code Quality

- SonarQube

## Security

- Trivy
- OWASP Dependency Check

## Monitoring

- Prometheus
- Grafana

## Logging

- Elasticsearch
- Filebeat
- Kibana

---

# 📂 Repository Structure

```
CloudCart
│
├── frontend/
├── backend/
├── kubernetes/
├── helm/
├── argocd/
├── monitoring/
├── logging/
├── docker/
├── terraform/
├── ansible/
├── docs/
├── screenshots/
└── README.md
```

---

# 🚀 CI/CD Pipeline

The Jenkins pipeline performs the following stages:

1. Checkout Source Code
2. Install Dependencies
3. Run Unit Tests
4. SonarQube Analysis
5. OWASP Dependency Check
6. Trivy Security Scan
7. Build Docker Images
8. Push Images to Amazon ECR
9. Update Kubernetes Manifests
10. Git Push
11. ArgoCD Automatic Deployment

---

# ☸ Kubernetes Components

- Deployments
- Services
- Ingress
- ConfigMaps
- Secrets
- Persistent Volumes
- Persistent Volume Claims
- Service Accounts

---

# 📊 Monitoring Stack

Prometheus collects metrics from:

- Kubernetes Cluster
- Backend Application
- Node Exporter
- kube-state-metrics

Grafana visualizes:

- CPU Usage
- Memory Usage
- Pod Status
- Node Health
- Application Metrics

---

# 📜 Logging Stack

Filebeat collects logs from Kubernetes Pods.

Logs are shipped to Elasticsearch and visualized using Kibana.

Collected Logs

- Backend Logs
- Frontend Logs
- Kubernetes Logs
- Container Logs

---

# 🔐 Security

- Helmet
- JWT Authentication
- SonarQube
- Trivy
- OWASP Dependency Check
- IAM Roles
- Kubernetes Secrets

---

# 📸 Screenshots

## Architecture

```
docs/screenshots/architecture.png
```

## Jenkins Pipeline

```
docs/screenshots/jenkins.png
```

## ArgoCD

```
docs/screenshots/argocd.png
```

## Grafana Dashboard

```
docs/screenshots/grafana.png
```

## Kibana Discover

```
docs/screenshots/kibana.png
```

---

# 🎯 Learning Outcomes

This project provided practical experience with:

- Cloud-native application deployment
- Kubernetes orchestration
- GitOps workflow
- CI/CD automation
- DevSecOps practices
- Infrastructure troubleshooting
- Kubernetes networking
- Persistent storage
- Monitoring and observability
- Centralized logging
- Production deployment strategies

---

# 🚧 Future Enhancements

- Blue-Green Deployment
- Canary Deployment
- Horizontal Pod Autoscaler (HPA)
- Cluster Autoscaler
- Infrastructure as Code using Terraform
- OpenTelemetry Integration
- Distributed Tracing
- Alertmanager Slack Notifications
- Backup & Disaster Recovery
- Advanced Grafana Dashboards

---

# 👨‍💻 Author

**Dharshan R**

AWS | DevOps | Cloud | Kubernetes

LinkedIn:
https://www.linkedin.com/in/iamdharshanr/

GitHub:
https://github.com/dharshanworks

---

# ⭐ If you found this project useful, consider giving it a Star!
