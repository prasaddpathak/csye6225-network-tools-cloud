# CSYE6225 Cloud Computing & Network structures

### This repository contains cloudformation templates to spin up AWS resources

## Pre-requisites:
- AWS Account (with admin access)
- AWS CLI

## Installation Instructions:
- Clone the repository: `git clone <repo-url>`
- Run the create command for the respective templates: `aws cloudformation create-stack <params>`


## Templates

### csye6225-infra: Cloudformation template to spin up csye6225 related infra 

Resources:
- 1 VPC
- 3 Subnets
- 1 InternetGateway
- 1 VPCGatewayAttachment
- 1 RouteTable
- 1 Route
- 3 SubnetRouteTableAssociation
- 1 EC2 Security Group
- 1 EC Instance with custom AMI

Flags
- Stack Name
- Region
- Profile
- Template Body

Parameters:
- VPC Cidr Block
- Subnet Cidr Block
- AmiId (replace with the latest AMI Id)

To create the stack use the following command 
```
aws cloudformation create-stack `
--stack-name csye6225-infra-1 `
--region us-east-1 `
--profile produser `
--template-body file://csye6225-infra.yml `
--parameters `
    ParameterKey=VpcCidrBlock,ParameterValue=10.1.0.0/16 `
    ParameterKey=SubnetCidrBlock,ParameterValue="10.1.0.0/24,10.1.1.0/24,10.1.2.0/24" `
	ParameterKey=RDSSubnetCidrBlock,ParameterValue="10.1.3.0/24,10.1.4.0/24,10.1.5.0/24" `
	ParameterKey=AmiId,ParameterValue=ami-03c5609d4f49dc6c6 `
	ParameterKey=VolumeSize,ParameterValue=12 `
	ParameterKey=myHostedZoneId,ParameterValue=Z05036842KHR1JG8039GE `
	ParameterKey=myHostedZoneName,ParameterValue=prod.prasadpathak.me `
	ParameterKey=myEnv,ParameterValue=prod `
--capabilities CAPABILITY_NAMED_IAM
```

To delete the stack use the following command
```
aws cloudformation delete-stack `
--stack-name csye6225-infra `
--profile devuser `
--region us-east-1
```