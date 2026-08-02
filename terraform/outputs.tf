output "vpc_id" {
  value = module.vpc.vpc_id
}

output "vpc_cidr" {
  value = module.vpc.vpc_cidr
}

output "eks_cluster_role_arn" {
  value = module.iam.cluster_role_arn
}

output "eks_node_role_arn" {
  value = module.iam.node_role_arn
}