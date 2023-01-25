from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .models import UrlType, Profile, URLBlacklist, ReportURL, Devices
from . serializers import *
from rest_framework import status
from rest_framework.generics import (
    ListCreateAPIView, RetrieveUpdateDestroyAPIView)
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework import generics
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .serializers import MyTokenObtainPairSerializer
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
import requests as req
from . analyzer import Analyzer
import logging
from rest_framework import viewsets
from rest_framework.decorators import action

API_KEY = '3480df0af8678f7e71c72bc119a4815ca6740222067fdb439569c9cfbb7b3454'

def index(request):
    return HttpResponse("{'message': 'Hello, world!'}")

class MyObtainTokenPairView(TokenObtainPairView):
    permission_classes = (AllowAny,)
    serializer_class = MyTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

class AnalyzeURLView(generics.CreateAPIView):
    permission_classes = (AllowAny,)
    queryset = UrlType.objects.all()
    serializer_class = URLSerializer
    analyzer = Analyzer(API_KEY)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        url = serializer.validated_data['url']
        result = self.analyzer.analyze(url, serializer)
        if result['status'] == 'redirect':
            return Response({'message': 'Invalid URL'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.data, status=status.HTTP_200_OK)

            

        
class URLListView(generics.ListAPIView):
    queryset = UrlType.objects.all()
    serializer_class = URLSerializer
    permission_classes = (IsAuthenticated,)

class ProfileViewSet(viewsets.ModelViewSet):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.filter(username=self.request.user)

    @action(detail=False, methods=['get'])
    def get(self, request):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return Response(serializer.data)

class URLBlacklistList(viewsets.ModelViewSet):
    queryset = URLBlacklist.objects.all()
    serializer_class = URLBlacklistSerializer
    permission_classes = (AllowAny,)

    @action(detail=False, methods=['get'])
    def get(self, request):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return Response(serializer.data)

class ReportURLView(viewsets.ModelViewSet):
    permission_classes = (AllowAny,)
    queryset = ReportURL.objects.all()
    serializer_class = ReportSerializer

    @action(detail=False, methods=['get'])
    def get(self, request):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class SaveDevicesView(viewsets.ModelViewSet):
    permission_classes = (AllowAny,)
    serializer_class = DeviceSerializer

    @action(detail=False, methos=['post'])
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        device = Devices.objects.filter(
            user=serializer.validated_data['user'],
            device_name=serializer.validated_data['device_name']
        )
        if device.exists():
            return Response({"messages":"Device already exists"}, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class GetStatsView(APIView):
    permission_classes = (AllowAny,)

    def get(self, request, user):
        url_list = ReportURL.objects.all()
        data = []
        for record in url_list:
            data.append({
                'type':record.type,
                'url':record.url,
                'user':record.user
            })

        return JsonResponse(data, safe=False)

class CreateReminder(viewsets.ModelViewSet):
    permission_classes = (AllowAny,)
    queryset = Reminder.objects.all()
    serializer_class = ReminderSerializer

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"data":serializer.data, "message":"created"}, status=status.HTTP_201_CREATED)
class GetReminder(viewsets.ModelViewSet):
    permission_classes = (AllowAny,)
    queryset = Reminder.objects.all()
    serializer_class = ReminderSerializer

    def get(self,request, users, devices):
        queryset = self.get_queryset().filter(device=devices, user=users).order_by('-date')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

