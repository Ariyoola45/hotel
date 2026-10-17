# Horizon Hotel Management System

### A Hotel Management Application with Local DevOps, CI/CD, Infrastructure as Code, and Monitoring

Horizon Hotel is a hospitality management application designed to help hotel staff manage guests, rooms, reservations, check-ins, check-outs, payments, housekeeping, and operational reports.

The project combines frontend development with practical DevOps engineering. Alongside the application, I have configured a local environment for containerization, continuous integration and delivery, infrastructure-as-code experiments, and application monitoring.

The application uses React and Firebase, while the DevOps environment includes Docker, Docker Compose, Jenkins, Terraform, Prometheus, Grafana, Alertmanager, and the Nginx Prometheus Exporter.

**Project focus:** Application development, containerization, CI/CD automation, monitoring, and local infrastructure experimentation.

**Deployment approach:** Local development and testing, with optional integrations for cloud hosting and local Kubernetes.

---

## Table of Contents

1. Project Overview
2. Project Objectives
3. Application Features
4. Technology Stack
5. DevOps Implementation
6. System Architecture
7. Project Structure
8. Application Workflow
9. Local Development Setup
10. Running with Docker
11. Monitoring and Observability
12. Prometheus and Alertmanager
13. Grafana Dashboards
14. Jenkins CI/CD Pipeline
15. Docker and Container Management
16. Terraform and Infrastructure as Code
17. Local Kubernetes with Minikube
18. Environment Variables and Secrets
19. Security Considerations
20. Troubleshooting
21. Challenges and Learning Outcomes
22. Future Improvements
23. Current Deployment Scope
24. Skills Demonstrated
25. Academic Context

---

## 1. Project Overview

Hotel operations involve several connected activities, including guest registration, room allocation, reservations, payment collection, and housekeeping.

Horizon Hotel brings these activities together in a web-based application with role-based access for hotel administrators and receptionists.

In addition to building the application, I developed a local DevOps environment to practise how a frontend application can be packaged, deployed, monitored, and maintained using industry-relevant tools.

The project explores the relationship between application development and infrastructure operations.

### Main Goals

- Build a functional hotel management application.
- Organize application code into reusable React components.
- Use Firebase Authentication for user authentication.
- Use Cloud Firestore for application data.
- Containerize the application using Docker.
- Orchestrate the local application and monitoring services using Docker Compose.
- Develop a Jenkins pipeline for automated build and deployment tasks.
- Collect application-server metrics using Prometheus.
- Visualize metrics with Grafana.
- Manage alerts using Alertmanager.
- Practise infrastructure as code using Terraform.
- Experiment with local Kubernetes deployment using Minikube.
- Document the environment so another developer can understand and reproduce the setup.

---

## 2. Project Objectives

### Application Development

The application provides a centralized interface for managing hotel operations. Its interface is built with React, while Firebase provides authentication and database services.

### DevOps and Automation

The project demonstrates how development workflows can be automated using a CI/CD pipeline and how an application can be packaged consistently using containers.

### Monitoring and Observability

The monitoring stack provides a foundation for observing Nginx metrics, reviewing Prometheus targets, visualizing available metrics, and managing configured alerts.

### Infrastructure as Code

Terraform configuration is included for practising infrastructure provisioning. The project has also been used for experiments with a local AWS-compatible endpoint.

### Local-First Development

The environment is designed to support continued development and testing on a local machine without depending on an active AWS-hosted deployment.

---

## 3. Application Features

| Feature | Description |
|---|---|
| Authentication | User sign-in through Firebase Authentication |
| Role-Based Access | Separate administrator and receptionist permissions |
| Guest Management | Register, search, edit, and remove guest records |
| Room Management | Maintain room information, rates, and room status |
| Reservations | Create and manage room reservations |
| Check-In | Update reservations and room occupancy |
| Check-Out | Complete reservations and calculate charges |
| Payments | Record payments and review payment history |
| Housekeeping | Assign and track room-cleaning tasks |
| Reports | Present hotel statistics and revenue information |
| Staff Management | Support administrator and receptionist roles |

### Authentication and Authorization

Firebase Authentication manages user authentication.

The application also uses staff-role information to determine which areas of the interface a user can access.

The intended roles are:

- **Administrator:** Access to administrative functionality, including staff management.
- **Receptionist:** Access to the operational features permitted by the application.

Actual authorization must also be enforced through appropriate database security rules. Hiding a page or button in React alone is not sufficient to secure application data.

### Guest Management

The guest-management module supports maintaining guest records and retrieving guest information when processing reservations.

### Room Management

Room records represent the hotel's room inventory. Depending on the application's configuration, room information can include room number, type, rate, and operational status.

### Reservations and Check-In

Reservations connect guests with rooms and booking dates. The workflow supports managing bookings and updating the relevant reservation and room statuses.

### Check-Out and Payments

The check-out workflow supports calculating charges based on the reservation and room rate and recording payment information.

### Housekeeping

Housekeeping tasks support tracking room-cleaning activities and updating room availability when the relevant workflow is completed.

### Reports

The reporting interface is intended to provide useful operational information, including room occupancy, revenue information, and summary statistics.

---

## 4. Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | Component-based user interface |
| Vite | Development server and frontend build tooling |
| React Router | Client-side navigation |
| Recharts | Data visualization |
| react-hot-toast | User notifications |

### Backend and Data Services

| Technology | Purpose |
|---|---|
| Firebase Authentication | User authentication |
| Cloud Firestore | Application data storage |
| Firestore Security Rules | Database access control |

### Containerization

| Technology | Purpose |
|---|---|
| Docker | Package the application into a container image |
| Docker Compose | Run and connect local application and monitoring services |
| Nginx | Serve the built frontend and expose server-status metrics |

### CI/CD

| Technology | Purpose |
|---|---|
| Jenkins | Automate configured pipeline stages |
| Git | Version control |
| GitHub | Source-code hosting and collaboration |
| SonarQube | Code-quality and static-analysis integration |
| SonarScanner | Submit code for SonarQube analysis |

### Monitoring and Alerting

| Technology | Purpose |
|---|---|
| Prometheus | Collect and query metrics |
| Grafana | Visualize metrics using dashboards |
| Alertmanager | Manage and route alerts |
| Nginx Prometheus Exporter | Expose Nginx metrics for Prometheus |

### Infrastructure and Orchestration

| Technology | Purpose |
|---|---|
| Terraform | Define and manage infrastructure through code |
| Floci | Local AWS-compatible endpoint used for infrastructure experiments |
| Minikube | Run a local Kubernetes environment |
| kubectl | Interact with Kubernetes resources |

---

## 5. DevOps Implementation

The DevOps environment brings together several practices that are important when preparing applications for deployment and ongoing operation.

### Containerization

The React application is built into static frontend assets and served through Nginx.

Docker provides a repeatable way to package the application and run it in a container.

### Service Orchestration

Docker Compose defines the local application and monitoring services, including their configuration, ports, volumes, and network.

This makes it easier to manage the local environment without starting every container manually.

### Continuous Integration and Delivery

Jenkins is configured to automate selected tasks such as source-code checkout, dependency installation, application builds, code analysis, Docker image creation, and deployment operations.

The exact stages that complete successfully depend on the Jenkins configuration, installed tools, credentials, and availability of deployment targets.

### Monitoring

Prometheus and the Nginx Prometheus Exporter provide the foundation for collecting server metrics.

Grafana provides dashboards for exploring the collected metrics, while Alertmanager manages alerts generated by the monitoring configuration.

### Infrastructure as Code

Terraform configuration is included for practising infrastructure provisioning and resource management.

Local AWS-compatible infrastructure experiments allow the workflow to be explored without claiming that the resources are deployed in a live AWS account.

---

## 6. System Architecture

The project separates the hotel application from the supporting local DevOps environment.

```text
                        DEVELOPER
                            |
                            v
                     Local Git Repository
                            |
                            v
                          GitHub
                            |
                            v
                         Jenkins
                            |
              +-------------+-------------+
              |             |             |
              v             v             v
          Dependencies   Code Analysis   Build
              |             |             |
              +-------------+-------------+
                            |
                            v
                       Docker Image
                            |
                            v
                    Local Container Runtime
                            |
                            v
                     Docker Compose
                            |
              +-------------+-------------+
              |             |             |
              v             v             v
          Hotel App     Prometheus    Alertmanager
              |
              v
            Nginx
              |
              v
        Nginx Exporter
              |
              v
          Prometheus
              |
              v
            Grafana
```

### Application Layer

The React application provides the interface for hotel staff. Firebase supplies authentication and database services.

### Container Layer

Docker packages the application, while Docker Compose manages the local services and their network connections.

### Monitoring Layer

The Nginx exporter exposes server metrics. Prometheus collects configured metrics, Grafana visualizes them, and Alertmanager handles configured alerts.

### Automation Layer

Jenkins coordinates the build and deployment stages defined in the pipeline.

### Infrastructure Layer

Terraform and the local AWS-compatible endpoint are used for infrastructure-as-code experiments. Minikube provides a separate environment for Kubernetes practice.

**Note:** This architecture describes the intended workflow. A stage shown in the diagram should be considered operational only after it has been configured and tested successfully.

---

## 7. Project Structure

```text
horizon-hotel-management-system/
│
├── app/
│   ├── src/
│   │   ├── firebase/
│   │   ├── context/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   └── styles/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── firestore.rules
│   └── .env.example
│
├── monitoring/
│   ├── prometheus/
│   │   ├── prometheus.yml
│   │   └── alert.rules.yml
│   │
│   ├── alertmanager/
│   │   └── alertmanager.yml
│   │
│   └── grafana/
│       ├── provisioning/
│       └── dashboards/
│
├── terrafrom/
│   ├── provider.tf
│   ├── vpc.tf
│   └── ec2.tf
│
├── docker-compose.yml
├── Jenkinsfile
├── .gitignore
└── README.md
```

The Terraform directory is currently named `terrafrom`. The name can be corrected to `terraform` in a later cleanup, provided the change is made consistently.

Local Terraform state, environment files, and downloaded provider files should not be committed to the repository.

---

## 8. Application Workflow

A typical hotel operation follows this sequence:

1. An authorized user signs in.
2. The user opens the relevant dashboard.
3. Guest information is registered or retrieved.
4. An available room is selected.
5. A reservation is created.
6. The reservation is checked in when the guest arrives.
7. Room status is updated according to the application's workflow.
8. Payment information is recorded during check-out.
9. The room can be assigned to housekeeping.
10. The room's status is updated after the housekeeping task is completed.
11. Authorized staff can review available reports.

The exact behaviour depends on the application's implemented business rules and Firebase configuration.

---

## 9. Local Development Setup

### Prerequisites

Install or configure the tools needed for the part of the project you want to run:

- Git
- Node.js
- npm
- Docker Engine
- Docker Compose
- A Firebase project
- Jenkins, if testing the CI/CD pipeline
- Terraform, if testing infrastructure-as-code configuration
- Minikube and kubectl, if testing Kubernetes deployment

You do not need to run every component just to work on the React application.

### Step 1: Clone the Repository

Replace the URL below with the repository URL if the repository name or location changes.

```bash
git clone https://github.com/Ariyoola45/hotel.git
cd hotel
```

### Step 2: Install Application Dependencies

```bash
cd app
npm install
```

### Step 3: Configure Firebase

Create a Firebase project through the Firebase Console:

https://console.firebase.google.com/

Configure the authentication provider and Firestore database required by the application.

Create a local environment file based on the supplied example:

```bash
cp .env.example .env
```

Edit `.env` and add your own Firebase configuration values.

Example:

```dotenv
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Use the actual variable names expected by the application.

Do not commit the completed `.env` file.

### Step 4: Start the Development Server

```bash
npm run dev
```

Open:

http://localhost:5173

The development server is intended for local development, not as a production hosting service.

---

## 10. Running the Application with Docker

The application includes a Dockerfile for building the frontend and serving the generated assets through Nginx.

### Build the Image

From the application directory:

```bash
docker build -t horizon-hotel-app .
```

If the Dockerfile expects Firebase variables as build arguments, supply them using the names and arguments defined in that Dockerfile.

### Run the Container

```bash
docker run -d \
  --name horizon-hotel-test \
  -p 8080:80 \
  horizon-hotel-app
```

Open:

http://localhost:8080

Check the container:

```bash
docker ps
```

View its logs:

```bash
docker logs horizon-hotel-test
```

Remove the test container when it is no longer needed:

```bash
docker rm -f horizon-hotel-test
```

The standalone container and the Docker Compose application may use different port mappings.

---

## 11. Running the Full Local Stack

Docker Compose manages the application and its supporting monitoring services.

### Configure Environment Variables

Review `docker-compose.yml` and identify the variables required by the application service.

Create a local `.env` file at the repository root if that is what the Compose configuration expects.

Populate it with the appropriate Firebase configuration.

Do not publish this file to GitHub.

### Start the Services

From the project root:

```bash
docker compose up -d --build
```

### Inspect Service Status

```bash
docker compose ps
```

### View Logs

Application:

```bash
docker compose logs --tail=100 app
```

Prometheus:

```bash
docker compose logs --tail=100 prometheus
```

Grafana:

```bash
docker compose logs --tail=100 grafana
```

Alertmanager:

```bash
docker compose logs --tail=100 alertmanager
```

Nginx exporter:

```bash
docker compose logs --tail=100 nginx-exporter
```

### Stop the Services

```bash
docker compose down
```

The command stops and removes the Compose containers and network. Persistent named volumes are retained unless explicitly removed.

To avoid losing monitoring data, do not remove the volumes unless you intend to reset the stored data.

---

## 12. Monitoring and Observability

Monitoring helps engineers understand whether an application and its supporting services are functioning as expected.

The Horizon Hotel monitoring environment uses Prometheus, Grafana, Alertmanager, and the Nginx Prometheus Exporter.

### Monitoring Objectives

- Observe Nginx metrics.
- Check whether Prometheus can scrape the configured targets.
- Review metrics over time.
- Visualize available metrics in Grafana.
- Configure alerts for relevant conditions.
- Investigate service availability and monitoring failures.

### Nginx Prometheus Exporter

The exporter obtains supported metrics from the Nginx status endpoint and exposes them in a Prometheus-compatible format.

The Nginx configuration must provide the status endpoint expected by the exporter.

The exporter and application must also be able to communicate over the configured Docker network.

### Exporter Metrics

When configured and reachable, the exporter exposes metrics through:

http://localhost:9113/metrics

This endpoint is useful for checking whether the exporter is running and returning metrics.

### Monitoring Flow

```text
Nginx
  |
  v
Nginx Status Endpoint
  |
  v
Nginx Prometheus Exporter
  |
  v
Prometheus
  |
  v
Grafana
```

Prometheus does not automatically monitor every aspect of a React application simply because the frontend runs in Docker.

Application-level metrics, browser performance measurements, HTTP availability checks, and backend metrics may require additional instrumentation or exporters.

---

## 13. Prometheus and Alertmanager

### Prometheus

Prometheus collects metrics from configured targets at regular intervals.

The project's Prometheus configuration is located at:

```text
monitoring/prometheus/prometheus.yml
```

Alert rules are located at:

```text
monitoring/prometheus/alert.rules.yml
```

Open the Prometheus interface:

http://localhost:9090

Check the configured scrape targets:

http://localhost:9090/targets

A target should be considered healthy only when Prometheus reports it as successfully scraped.

### Alertmanager

Alertmanager receives alerts from Prometheus and applies the configured routing and notification policies.

The configuration is located at:

```text
monitoring/alertmanager/alertmanager.yml
```

Open:

http://localhost:9093

Email or webhook notifications require valid receiver configuration. Placeholder settings alone do not deliver real notifications.

### Troubleshooting Monitoring

If the exporter is running but Prometheus cannot scrape it, check:

1. The exporter container logs.
2. The Nginx status endpoint.
3. The Docker Compose network.
4. The target address in `prometheus.yml`.
5. The target status in the Prometheus interface.

---

## 14. Grafana Dashboards

Grafana provides a visual interface for exploring the metrics collected by Prometheus.

Open:

http://localhost:3000

The supplied configuration includes Grafana provisioning and dashboard directories.

```text
monitoring/
└── grafana/
    ├── provisioning/
    └── dashboards/
```

If automatic provisioning is configured correctly, Grafana can load the configured Prometheus data source and dashboards during startup.

### What Grafana Is Used For

- Reviewing available metrics.
- Visualizing server activity.
- Exploring metric changes over time.
- Investigating monitoring problems.
- Presenting the state of configured monitoring targets.

### Dashboard Troubleshooting

If a dashboard is empty:

1. Confirm that Prometheus is running.
2. Open Prometheus Targets and inspect the scrape status.
3. Check the Grafana data-source connection.
4. Confirm that the dashboard queries match the available metric names.
5. Review Grafana and Prometheus logs.

An empty dashboard does not necessarily mean Grafana is broken; the underlying metric may be unavailable or the query may need adjustment.

---

## 15. Jenkins CI/CD Pipeline

The repository includes a Jenkins declarative pipeline.

The pipeline is intended to automate selected stages in the software delivery process.

### Pipeline Objectives

- Retrieve source code from GitHub.
- Install application dependencies.
- Build the React application.
- Run configured code-quality analysis.
- Build a Docker image.
- Load the image into the local Minikube environment when configured.
- Run the configured deployment stages.
- Report the pipeline result.

### General Workflow

```text
GitHub
   |
   v
Jenkins Checkout
   |
   v
Dependency Installation
   |
   v
Application Build
   |
   v
SonarQube Analysis
   |
   v
Quality Gate
   |
   v
Docker Image Build
   |
   v
Configured Deployment
```

The actual Jenkinsfile determines the stages and their execution order.

### SonarQube Integration

SonarQube is used to analyse source code and report findings such as code-quality issues and security-related concerns.

A configured quality gate can prevent later pipeline stages from proceeding when its conditions are not satisfied.

A successful build does not automatically mean that all security concerns have been resolved.

### Docker Integration

Jenkins can build the application image using the Dockerfile.

The Jenkins agent needs appropriate Docker access and permissions to perform these operations.

### Deployment Integration

The current pipeline includes deployment-related operations involving local Kubernetes and optional external hosting services.

These stages require valid credentials, correctly configured tools, and reachable deployment targets.

A local Docker Compose deployment is separate from a Jenkins deployment stage targeting Minikube, Firebase Hosting, or Vercel.

### Jenkins Credentials

Store tokens and passwords in Jenkins Credentials rather than placing them directly in the Jenkinsfile.

Depending on the stages being used, the pipeline may require:

- SonarQube configuration and scanner installation.
- Docker access.
- Kubernetes client configuration.
- Minikube access.
- Firebase deployment credentials.
- Vercel deployment credentials.

Only configure the credentials required for the stages you intend to execute.

---

## 16. Docker and Container Management

Docker provides a consistent way to package and run the application.

Docker Compose makes it possible to define multiple related services in a single configuration file.

### Useful Commands

List running containers:

```bash
docker ps
```

List all containers:

```bash
docker ps -a
```

List local images:

```bash
docker images
```

Inspect application logs:

```bash
docker logs --tail=100 hh-app
```

Inspect application health:

```bash
docker inspect --format '{{json .State.Health}}' hh-app
```

Review resource usage:

```bash
docker stats
```

Validate Compose configuration:

```bash
docker compose config -q
```

Rebuild and restart the local stack after intentional configuration changes:

```bash
docker compose up -d --build
```

Use these commands to diagnose failures before removing containers or deleting volumes.

---

## 17. Terraform and Infrastructure as Code

Terraform is used to define infrastructure resources through configuration files.

The project includes configuration for networking and compute resources, with an AWS-compatible local endpoint used for infrastructure experiments.

### Infrastructure Components

The supplied Terraform configuration includes resources for:

- A virtual private cloud.
- A subnet.
- An internet gateway.
- A security group.
- An EC2-style instance.
- Resource outputs.

The exact resources that can be created depend on the configured provider and endpoint.

### Local AWS-Compatible Endpoint

The development configuration uses:

```text
http://localhost:4566
```

This endpoint is intended for local infrastructure experiments. It should not be presented as an AWS production endpoint.

The endpoint must be running and configured to support the AWS services required by the Terraform configuration.

### Terraform Workflow

Initialize the Terraform working directory:

```bash
terraform -chdir=terrafrom init
```

Format the configuration:

```bash
terraform -chdir=terrafrom fmt
```

Validate the configuration:

```bash
terraform -chdir=terrafrom validate
```

Review the proposed changes:

```bash
terraform -chdir=terrafrom plan
```

Only apply a plan after confirming that the provider and endpoint point to the intended environment.

```bash
terraform -chdir=terrafrom apply
```

The apply command is not required just to validate or document the project.

### Terraform State

Terraform state tracks the resources managed by Terraform.

State files can contain sensitive information and should not be committed to a public repository.

The project `.gitignore` excludes Terraform state and local provider data while allowing the dependency lock file to remain version-controlled.

---

## 18. Local Kubernetes with Minikube

Minikube provides a local Kubernetes environment for learning and testing container deployments.

The project has Kubernetes-related deployment operations in the Jenkins pipeline.

### Check Minikube Status

```bash
minikube status
```

### Start Minikube

```bash
minikube start
```

### Check Kubernetes Nodes

```bash
kubectl get nodes
```

### Inspect Deployments

```bash
kubectl get deployments
```

### Inspect Pods

```bash
kubectl get pods
```

### Inspect Services

```bash
kubectl get services
```

These commands require a working Minikube installation and a valid Kubernetes context.

The Kubernetes deployment is separate from the Docker Compose stack. Running Docker Compose does not automatically start Minikube or deploy Kubernetes resources.

---

## 19. Environment Variables and Secrets

The project uses environment variables for application configuration.

Examples include Firebase web-application configuration values.

Local environment files should be created from example files and populated with the values required by the application.

### Files That Should Not Be Committed

Examples include:

```text
.env
.env.local
app/.env
app/.env.local
```

Terraform state and local provider directories should also remain out of source control.

### Important Security Considerations

- Never commit private keys, passwords, access tokens, or service-account credentials.
- Do not assume that `.gitignore` protects files that are already tracked.
- Review the Git staging area before every commit.
- Rotate exposed credentials if they have been published.
- Use Jenkins Credentials for pipeline secrets.
- Configure Firebase Security Rules to enforce access controls.

Firebase web configuration values are not equivalent to private service-account credentials, but they still need appropriate application restrictions and database security rules.

---

## 20. Security Considerations

Security is important even in a portfolio project.

### Application Security

- Enforce authorization through Firestore Security Rules.
- Validate application inputs.
- Avoid relying solely on frontend role checks.
- Restrict administrative operations to authorized users.

### Container Security

- Use maintained base images.
- Avoid embedding secrets in Docker images.
- Review container permissions and exposed ports.
- Keep dependencies updated.

### Infrastructure Security

- Avoid exposing administrative ports to every IP address.
- Review security-group rules before deploying infrastructure.
- Avoid committing Terraform state.
- Verify the target environment before applying Terraform changes.

### Monitoring Security

- Change default Grafana credentials.
- Restrict access to monitoring interfaces.
- Configure notification credentials securely.
- Avoid exposing monitoring endpoints unnecessarily.

### CI/CD Security

- Store deployment tokens in Jenkins Credentials.
- Restrict who can modify and execute deployment pipelines.
- Review third-party dependencies and build tools.
- Investigate security findings before declaring a build production-ready.

---

## 21. Troubleshooting

### Docker Compose Reports an Error

Validate the configuration:

```bash
docker compose config
```

Inspect container status:

```bash
docker compose ps
```

Check the relevant service logs:

```bash
docker compose logs --tail=100
```

### The Hotel Container Is Unhealthy

Inspect its health-check information:

```bash
docker inspect --format '{{json .State.Health}}' hh-app
```

Inspect its logs:

```bash
docker logs --tail=100 hh-app
```

Test the configured health endpoint:

```bash
curl -i http://localhost:3045/healthz
```

A failed health check may indicate that the endpoint is missing, the server is not responding as expected, or the health-check configuration does not match the application.

### Prometheus Cannot Scrape the Exporter

Open:

http://localhost:9090/targets

Review the exporter logs:

```bash
docker compose logs --tail=100 nginx-exporter
```

Confirm that the Nginx status endpoint and exporter configuration match.

### Grafana Shows No Metrics

Check the Prometheus target status and verify the Grafana data-source configuration.

The metrics must exist in Prometheus before Grafana can display them.

### Minikube Is Stopped

Check:

```bash
minikube status
```

Start the environment if required:

```bash
minikube start
```

If the cluster fails to start, inspect the error before changing the cluster configuration.

### Terraform Cannot Find Its Directory

The Terraform folder is currently named `terrafrom`.

Use:

```bash
terraform -chdir=terrafrom validate
```

If the directory is renamed, update the commands and any scripts that refer to the old name.

---

## 22. Challenges and Learning Outcomes

This project provides practical experience with the relationships between application development, containerization, deployment automation, infrastructure management, and monitoring.

### Containerization

Learned how a frontend application can be packaged into a Docker image and served through Nginx.

### Service Orchestration

Practised defining related services, port mappings, volumes, and networks in Docker Compose.

### CI/CD Automation

Worked with a Jenkins declarative pipeline to organize build, quality-analysis, image-building, and deployment stages.

### Monitoring

Configured a monitoring environment involving Prometheus, Grafana, Alertmanager, and the Nginx Prometheus Exporter.

### Infrastructure as Code

Practised defining infrastructure resources through Terraform configuration and validating the configuration before applying changes.

### Local Kubernetes

Worked with Minikube and kubectl to explore local Kubernetes deployment workflows.

### Troubleshooting

Gained experience investigating container health checks, service connectivity, monitoring targets, and infrastructure configuration issues.

---

## 23. Future Improvements

Planned improvements include:

- Complete health-check validation for the application container.
- Verify that all monitoring targets are reachable.
- Improve application-level observability.
- Add automated application tests to the Jenkins pipeline.
- Improve dependency and container-image security checks.
- Complete and verify the local Kubernetes deployment workflow.
- Improve Terraform networking configuration and validation.
- Separate optional cloud deployment stages from the local CI/CD workflow.
- Add clearer operational documentation and deployment diagrams.
- Introduce automated backup and recovery procedures where appropriate.
- Review Firebase Security Rules and authorization tests.
- Document verified build and deployment results.

These improvements would strengthen the project's reliability, security, and reproducibility.

---

## 24. Current Deployment Scope

The project is currently being developed and demonstrated using a local DevOps environment.

My AWS Free Tier availability has ended, so I use the local environment for development, testing, and infrastructure experiments rather than presenting the project as a currently running AWS-hosted production application.

The local environment provides an opportunity to practise:

- Docker containerization.
- Docker Compose service orchestration.
- Jenkins pipeline automation.
- Prometheus-based metrics collection.
- Grafana monitoring dashboards.
- Alertmanager configuration.
- Terraform infrastructure-as-code workflows.
- Local Kubernetes experiments using Minikube.

Some workflows depend on external services or credentials. Their operational status must be verified independently.

The project is intended to demonstrate practical DevOps learning and implementation rather than claim an active production deployment on AWS.

---

## 25. Skills Demonstrated

### Development

- React
- JavaScript
- Vite
- React Router
- Firebase Authentication
- Cloud Firestore

### DevOps

- Git and GitHub
- Docker
- Docker Compose
- Jenkins
- CI/CD pipeline configuration
- SonarQube integration
- Nginx

### Monitoring and Observability

- Prometheus
- Grafana
- Alertmanager
- Nginx Prometheus Exporter
- Metrics collection and visualization
- Monitoring troubleshooting

### Infrastructure and Orchestration

- Terraform
- Local AWS-compatible infrastructure experiments
- Minikube
- Kubernetes command-line tools
- Infrastructure-as-code validation

### Engineering Practices

- Environment-variable management
- Container troubleshooting
- Configuration management
- Source-control hygiene
- Technical documentation
- Local development and testing

---

## Academic Context

This project was developed as an academic project associated with the Department of Computer Science, Faculty of Computing and Information Technology, Lagos State University (LASU).

It also serves as a practical portfolio project for demonstrating application development and DevOps engineering skills.

---

## Author

**Ariyoola45**

GitHub: [https://github.com/Ariyoola45](https://github.com/Ariyoola45)

Project repository: [https://github.com/Ariyoola45/hotel](https://github.com/Ariyoola45/hotel)

---

## License

This project is intended for academic and portfolio demonstration.

Before redistributing the project, confirm the licensing requirements of its dependencies, assets, and any third-party components.