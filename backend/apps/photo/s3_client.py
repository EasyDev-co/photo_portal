import boto3

from django.conf import settings


def get_s3_client():
    session = boto3.session.Session()
    s3_client = session.client(
        service_name='s3',
        region_name=settings.YC_REGION,
        endpoint_url=settings.YC_S3_ENDPOINT,
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    )
    return s3_client
