# Azure Cloud Portfolio: Containerized Batch Execution

## Executive Summary
This repository demonstrates an enterprise-grade, serverless batch execution engine deployed to Azure Container Apps (ACA) Jobs. It solves the business problem of maintaining idle compute for intermittent workloads by leveraging a scale-to-zero economic model. The deployment architecture adheres to strict zero-trust security principles, utilizing passwordless OpenID Connect (OIDC) federation, least-privilege Role-Based Access Control (RBAC), and non-root container execution environments.

## Architecture Diagram
(Refer to repository documentation for ASCII layout)

## Pipeline Performance
The CI/CD pipeline is fully automated via GitHub Actions, achieving a complete deployment and verification cycle in 54 seconds.

## Architectural Justifications
* Azure Container Apps (ACA) Jobs vs. Continuous Apps: ACA Jobs are explicitly designed for ephemeral, run-to-completion tasks. Unlike standard Web Apps or continuously running Container Apps, Jobs scale strictly to zero upon exit code 0, eliminating all idle compute costs.
* OIDC Workload Identity vs. Static Secrets: Traditional Service Principals require storing long-lived client secrets inside GitHub, posing a risk of credential leakage and requiring manual rotation. 
* Docker Buildx Caching: Leveraging GitHub Actions cache (type=gha) for Docker build layers reduces the compilation and push stage to 6 seconds, heavily optimizing the developer feedback loop.
