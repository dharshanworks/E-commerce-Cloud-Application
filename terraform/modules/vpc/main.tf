resource "aws_vpc" "this" {

  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "cloudcart-${var.environment}-vpc"
  }
}

#################################################
# Internet Gateway
#################################################

resource "aws_internet_gateway" "this" {

  vpc_id = aws_vpc.this.id

  tags = {
    Name = "cloudcart-igw"
  }
}

#################################################
# Public Subnet 1
#################################################

resource "aws_subnet" "public_1" {

  vpc_id                  = aws_vpc.this.id
  cidr_block              = var.public_subnet_1_cidr
  availability_zone       = var.availability_zone_1
  map_public_ip_on_launch = true

  tags = {
    Name = "public-subnet-1"

    "kubernetes.io/role/elb" = "1"
  }
}

#################################################
# Public Subnet 2
#################################################

resource "aws_subnet" "public_2" {

  vpc_id                  = aws_vpc.this.id
  cidr_block              = var.public_subnet_2_cidr
  availability_zone       = var.availability_zone_2
  map_public_ip_on_launch = true

  tags = {
    Name = "public-subnet-2"

    "kubernetes.io/role/elb" = "1"
  }
}

#################################################
# Private Subnet 1
#################################################

resource "aws_subnet" "private_1" {

  vpc_id            = aws_vpc.this.id
  cidr_block        = var.private_subnet_1_cidr
  availability_zone = var.availability_zone_1

  tags = {
    Name = "private-subnet-1"

    "kubernetes.io/role/internal-elb" = "1"
  }
}

#################################################
# Private Subnet 2
#################################################

resource "aws_subnet" "private_2" {

  vpc_id            = aws_vpc.this.id
  cidr_block        = var.private_subnet_2_cidr
  availability_zone = var.availability_zone_2

  tags = {
    Name = "private-subnet-2"

    "kubernetes.io/role/internal-elb" = "1"
  }
}

#################################################
# Elastic IP
#################################################

resource "aws_eip" "nat" {

  domain = "vpc"

  tags = {
    Name = "cloudcart-nat-eip"
  }
}

#################################################
# NAT Gateway
#################################################

resource "aws_nat_gateway" "this" {

  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public_1.id

  depends_on = [
    aws_internet_gateway.this
  ]

  tags = {
    Name = "cloudcart-nat"
  }
}

#################################################
# Public Route Table
#################################################

resource "aws_route_table" "public" {

  vpc_id = aws_vpc.this.id

  route {

    cidr_block = "0.0.0.0/0"

    gateway_id = aws_internet_gateway.this.id
  }

  tags = {
    Name = "public-route-table"
  }
}

#################################################
# Private Route Table
#################################################

resource "aws_route_table" "private" {

  vpc_id = aws_vpc.this.id

  route {

    cidr_block = "0.0.0.0/0"

    nat_gateway_id = aws_nat_gateway.this.id
  }

  tags = {
    Name = "private-route-table"
  }
}

#################################################
# Route Table Associations
#################################################

resource "aws_route_table_association" "public_1" {

  subnet_id      = aws_subnet.public_1.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "public_2" {

  subnet_id      = aws_subnet.public_2.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "private_1" {

  subnet_id      = aws_subnet.private_1.id
  route_table_id = aws_route_table.private.id
}

resource "aws_route_table_association" "private_2" {

  subnet_id      = aws_subnet.private_2.id
  route_table_id = aws_route_table.private.id
}