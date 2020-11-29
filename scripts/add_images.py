import boto3
import os
from dotenv import load_dotenv
load_dotenv()


s3 = boto3.resource('s3',
endpoint_url = os.environ.get('ENDPOINT_URL'),
aws_access_key_id = os.environ.get('B2_KEY_ID'),
aws_secret_access_key = os.environ.get('B2_APP_KEY'))

ROOT_DIR = os.path.dirname(os.path.abspath(__file__)) + '/images'

for filename in os.listdir(ROOT_DIR):
    s3.meta.client.upload_file('images/' + filename, 'shoeproject', filename)