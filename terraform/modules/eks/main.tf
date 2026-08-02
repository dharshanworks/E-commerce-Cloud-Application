resource "aws_eks_cluster" "this" {

  name = "${var.project_name}-${var.environment}-eks"

  role_arn = var.cluster_role_arn

  version = "1.33"

  vpc_config {

    subnet_ids = var.private_subnet_ids

    endpoint_private_access = true
    endpoint_public_access  = true
  }

  tags = {

    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

resource "aws_eks_node_group" "this" {

  cluster_name    = aws_eks_cluster.this.name
  node_group_name = "${var.project_name}-${var.environment}-node-group"

  node_role_arn = var.node_role_arn

  subnet_ids = var.private_subnet_ids

  instance_types = ["t3.medium"]

  capacity_type = "ON_DEMAND"

  scaling_config {

    desired_size = 2
    min_size     = 2
    max_size     = 3
  }

  update_config {
    max_unavailable = 1
  }

  depends_on = [
    aws_eks_cluster.this
  ]

  tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}