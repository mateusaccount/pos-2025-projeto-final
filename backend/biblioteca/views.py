from django.shortcuts import render
from rest_framework import viewsets
from .models import Livro, Comentario
from .serializers import LivroSerializer, ComentarioSerializer

class LivroViewSet(viewsets.ModelViewSet):
    queryset = Livro.objects.all().order_by('-criado_em')
    serializer_class = LivroSerializer

class ComentarioViewSet(viewsets.ModelViewSet):
    queryset = Comentario.objects.all()
    serializer_class = ComentarioSerializer