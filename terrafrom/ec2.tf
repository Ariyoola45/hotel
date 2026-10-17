resource "aws_security_group" "demo_sg" {
    name = "demo-sg"
    description = "Allow basic inbound traffic"
    vpc_id = aws_vpc.demo_vpc.id
    
    ingress {
    from_port = 22
    to_port  = 22
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    }
    ingress {
    from_port = 80
    to_port = 80
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    }
}
resource "aws_instance" "demo_instance" {
    ami = "ami-df5de72bdb3b1f7cf"
    instance_type = "t2.micro"
    subnet_id = aws_subnet.demo_subnet.id
    vpc_security_group_ids = [aws_security_group.demo_sg.id]
    tags = { Name = "demo-react-app-instance" }
}

output "instance_id" { value = aws_instance.demo_instance.id }
output "vpc_id" { value = aws_vpc.demo_vpc.id }