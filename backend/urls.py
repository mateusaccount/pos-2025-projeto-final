from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from backend.api.views import TarefaViewSet

router = DefaultRouter()
router.register(r'tarefas', TarefaViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]