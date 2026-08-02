FROM jenkins/jenkins:lts-jdk21

USER root

# --------------------------------
# Update package index
# --------------------------------

RUN apt-get update

# --------------------------------
# Install required packages
# --------------------------------

RUN apt-get install -y \
    git \
    curl \
    unzip \
    wget \
    gnupg \
    lsb-release \
    ca-certificates \
    apt-transport-https

# --------------------------------
# Install Docker CLI
# --------------------------------

RUN curl -fsSL https://download.docker.com/linux/debian/gpg | \
    gpg --dearmor -o /usr/share/keyrings/docker.gpg

RUN echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker.gpg] https://download.docker.com/linux/debian \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
    > /etc/apt/sources.list.d/docker.list

RUN apt-get update && \
    apt-get install -y docker-ce-cli

# --------------------------------
# Install AWS CLI v2
# --------------------------------

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" \
    -o awscliv2.zip && \
    unzip awscliv2.zip && \
    ./aws/install && \
    rm -rf aws awscliv2.zip

# --------------------------------
# Install Trivy
# --------------------------------

RUN wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | \
    gpg --dearmor -o /usr/share/keyrings/trivy.gpg

RUN echo \
    "deb [signed-by=/usr/share/keyrings/trivy.gpg] https://aquasecurity.github.io/trivy-repo/deb $(. /etc/os-release && echo "$VERSION_CODENAME") main" \
    > /etc/apt/sources.list.d/trivy.list

RUN apt-get update && \
    apt-get install -y trivy

# --------------------------------
# Install Jenkins Plugins
# --------------------------------

COPY plugins.txt /usr/share/jenkins/ref/plugins.txt

RUN jenkins-plugin-cli \
    --plugin-file /usr/share/jenkins/ref/plugins.txt

USER jenkins