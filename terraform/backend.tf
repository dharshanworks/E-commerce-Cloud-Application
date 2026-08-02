terraform {

  backend "s3" {

    bucket         = "cloudcart-terraform-state-747848915242"
    key            = "dev/terraform.tfstate"
    region         = "ap-south-1"

    dynamodb_table = "cloudcart-terraform-lock"

    encrypt = true

  }

}