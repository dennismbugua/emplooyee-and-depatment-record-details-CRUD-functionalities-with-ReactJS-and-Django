from django.urls import re_path as url
from EmployeeApp import views
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    url(r'^department$', views.departmentApi, name='departmentApi'),
    url(r'^department/([0-9]+)$', views.departmentApi, name='departmentApi'),

    url(r'^employee$', views.employeeApi, name='employeeApi'),
    url(r'^employee/([0-9]+)$', views.employeeApi, name='employeeApi'),

    url(r'^employee/savefile$', views.SaveFile, name='saveFile')
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
