resource "aws_vpc" "demo_vpc" {
    cidr_block = "10.0.0.0/16"
    tags = { Name = "demo-vpc" }
}
resource "aws_subnet" "demo_subnet" {
    vpc_id = aws_vpc.demo_vpc.id
    cidr_block = "10.0.1.0/24"
    availability_zone = "us-east-1a"
    tags = { Name = "demo-subnet" }

}
resource "aws_internet_gateway" "demo_igw" {
    vpc_id = aws_vpc.demo_vpc.id
    tags = { Name = "demo-igw" }
}