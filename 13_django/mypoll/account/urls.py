# account/urls.py
from django.urls import path
from . import views
app_name = "account"

urlpatterns = [
    path("create", views.create, name="create"),
]
# http://127.0.0.1:8000/account/create