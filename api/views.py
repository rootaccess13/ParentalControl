from django.shortcuts import render
from django.http import HttpResponse
from .models import UrlType, Profile, URLBlacklist
from . serializers import RegisterSerializer, URLSerializer, ProfileSerializer, URLBlacklistSerializer
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

API_KEY = 'f731b826fc12e56e88bdfc0af7d473de62f7569bc683e02d6f988458eb1b5472'

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

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        url = serializer.validated_data['url']
        Analyzer(API_KEY).analyze(url, serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
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

