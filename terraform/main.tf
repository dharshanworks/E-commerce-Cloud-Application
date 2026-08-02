module "vpc" {

  source = "./modules/vpc"

  environment = var.environment

  vpc_cidr = var.vpc_cidr

  public_subnet_1_cidr = var.public_subnet_1_cidr
  public_subnet_2_cidr = var.public_subnet_2_cidr

  private_subnet_1_cidr = var.private_subnet_1_cidr
  private_subnet_2_cidr = var.private_subnet_2_cidr

  availability_zone_1 = var.availability_zone_1
  availability_zone_2 = var.availability_zone_2
}
module "iam" {

  source = "./modules/iam"

  project_name = var.project_name
  environment  = var.environment
}

module "eks" {

  source = "./modules/eks"

  project_name = var.project_name
  environment  = var.environment

  cluster_role_arn = module.iam.cluster_role_arn
  node_role_arn    = module.iam.node_role_arn

  private_subnet_ids = module.vpc.private_subnet_ids
}