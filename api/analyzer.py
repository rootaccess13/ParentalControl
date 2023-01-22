import requests as req
from . serializers import RegisterSerializer, URLSerializer
import logging


class Analyzer:
    def __init__(self, api_key):
        self.api_key = api_key
        self.api_url = 'https://www.virustotal.com/vtapi/v2/url/report'

    def analyze(self, url, serializer):
        res = req.get(self.api_url, params={'apikey': self.api_key, 'resource': url, 'scan': 1})
        res = res.json()
        print(res)
        if res['positives'] > 0:
            serializer.save(is_secure=False)
        scan_data = res['scans']
        for key, value in scan_data.items():
            if value['detected'] == True:
                print(key, value['result'])
                logging.warning(f'{key} - { value["result"] }')
        return res