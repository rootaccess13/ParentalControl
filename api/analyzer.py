import requests as req
from django.shortcuts import render, redirect
from . serializers import RegisterSerializer, URLSerializer
import logging
from . models import UrlType
from rest_framework.response import Response
import concurrent.futures
from rest_framework import status
class Analyzer:
    def __init__(self, api_key):
        self.api_key = api_key
        self.api_url = 'https://www.virustotal.com/vtapi/v2/url/report'

    def analyze(self, url, serializer):
        check_url = UrlType.objects.filter(url=url)
        if check_url:
            return {"status": "redirect"}
        else:
            res = req.get(self.api_url, params={'apikey': self.api_key, 'resource': url, 'scan': 1})
            if res.status_code != 200:
                raise Exception("Error with the request: ", res.status_code)
            data = res.json()
            if data['positives'] > 0:
                serializer.save(is_secure=False)

            scan_data = data['scans']
            for key, value in scan_data.items():
                if value['detected'] == True:
                    serializer.save(type=value['result'])
                    logging.warning(f'{key} - { value["result"] } - {url}')
            return data

    def analyze_urls(self, urls, serializer):
        with concurrent.futures.ThreadPoolExecutor() as executor:
            results = [executor.submit(self.analyze, url, serializer) for url in urls]
            for f in concurrent.futures.as_completed(results):
                data = f.result()
                print(data)


# # Usage:
# analyzer = Analyzer(api_key)
# urls_to_analyze = ['https://example.com', 'https://example2.com']
# analyzer.analyze_urls(urls_to_analyze, serializer)



# class Analyzer:
#     def __init__(self, api_key):
#         self.api_key = api_key
#         self.api_url = 'https://www.virustotal.com/vtapi/v2/url/report'

#     def analyze(self, url, serializer):
#         check_url = UrlType.objects.filter(url=url)

#         res = req.get(self.api_url, params={'apikey': self.api_key, 'resource': url, 'scan': 1})
#         if res.status_code != 200:
#             raise Exception("Error with the request: ", res.status_code)
#         data = res.json()
#         print(data['positives'])
#         if data['positives'] > 0:
#             serializer.save(is_secure=False)

#         scan_data = data['scans']
#         for key, value in scan_data.items():
#             if value['detected'] == True:
#                 logging.warning(f'{key} - { value["result"] } - {url}')
#         return data
