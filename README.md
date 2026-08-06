# 🛒 CloudCart – Cloud-Native MERN E-Commerce Platform

CloudCart is a production-inspired cloud-native MERN e-commerce platform that demonstrates a complete DevOps lifecycle on AWS. The project automates infrastructure provisioning, application delivery, security scanning, monitoring, centralized logging, and GitOps-based deployments using modern DevOps practices.

---

## 🚀 Features

- MERN-based e-commerce application
- Containerized using Docker
- Deployed on Amazon EKS
- Infrastructure provisioned with Terraform
- CI/CD pipeline using Jenkins
- GitOps deployment using ArgoCD
- Docker image management with Amazon ECR
- Static code analysis using SonarQube
- Dependency vulnerability scanning using OWASP Dependency Check
- Container image security scanning using Trivy
- Monitoring with Prometheus & Grafana
- Centralized logging using Filebeat, Elasticsearch & Kibana (ELK)
- AWS Application Load Balancer for external access

---

## 🏗 Architecture

GitHub
→ Jenkins CI/CD
→ SonarQube
→ OWASP Dependency Check
→ Trivy
→ Docker Build
→ Amazon ECR
→ GitOps Repository
→ ArgoCD
→ Amazon EKS
→ AWS Application Load Balancer
→ End Users

Monitoring:
Prometheus → Grafana

Logging:
Filebeat → Elasticsearch → Kibana

---

## 📁 Repository Structure

```
CloudCart/
├── frontend/
├── backend/
├── Dockerfile
├── Jenkinsfile
├── k8s/
├── terraform/
└── README.md
```

---

## ⚙ Tech Stack

### Frontend
- React.js

### Backend
- Node.js
- Express.js

### Database
- MongoDB Atlas

### DevOps
- Docker
- Kubernetes
- Jenkins
- ArgoCD
- Terraform

### AWS
- Amazon EKS
- Amazon ECR
- Application Load Balancer
- IAM
- VPC

### Monitoring
- Prometheus
- Grafana

### Logging
- Filebeat
- Elasticsearch
- Kibana

### DevSecOps
- SonarQube
- OWASP Dependency Check
- Trivy

---

## 🔄 CI/CD Workflow

1. Developer pushes code to GitHub
2. GitHub Webhook triggers Jenkins
3. Jenkins performs:
   - Checkout
   - Build
   - SonarQube Analysis
   - OWASP Dependency Check
   - Trivy Scan
   - Docker Build
   - Push Image to Amazon ECR
4. Jenkins updates the GitOps Repository
5. ArgoCD detects changes
6. Application is automatically deployed to Amazon EKS

---

## 📊 Monitoring

Prometheus continuously collects application and Kubernetes metrics.

Grafana visualizes:

- CPU Usage
- Memory Usage
- Request Rate
- Response Time
- Kubernetes Health

---

## 📜 Centralized Logging

Application logs are collected by Filebeat, indexed by Elasticsearch, and visualized in Kibana for troubleshooting and log analysis.

---

## 🔒 Security

- SonarQube
- OWASP Dependency Check
- Trivy
- IAM Roles
- Kubernetes Secrets

---

## 📸 Screenshots

Add screenshots of:

- Jenkins Pipeline
- ArgoCD Dashboard
- Prometheus Targets
- Grafana Dashboard
- Kibana Discover
- AWS ALB
- Amazon EKS

---

## 👨‍💻 Author

Dharshan R
