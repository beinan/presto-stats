# Create S3 bucket for hosting UI

    AWS_REGION=us-east-1
    BUCKET=alluxio.presto-stats.ui

    aws s3api create-bucket \
        --bucket $BUCKET \
        --region $AWS_REGION 

    aws s3api delete-public-access-block \
        --bucket $BUCKET 

    aws s3api put-bucket-cors \
        --bucket $BUCKET \
        --cors-configuration file://s3-cors-config.json

    aws s3api put-bucket-website \
        --bucket $BUCKET \
        --website-configuration file://s3-website-config.json

    aws s3api put-bucket-policy \
        --bucket $BUCKET \
        --policy file://s3-bucket-policy.json

