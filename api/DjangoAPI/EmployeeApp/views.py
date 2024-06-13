# EmployeeApp/views.py

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Departments, Employees
from .serializers import DepartmentSerializer, EmployeeSerializer
from django.core.files.storage import default_storage


@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def departmentApi(request, id=None):
    if request.method == 'GET':
        if id:
            department = Departments.objects.get(DepartmentId=id)
            serializer = DepartmentSerializer(department)
            return Response(serializer.data)
        else:
            departments = Departments.objects.all()
            serializer = DepartmentSerializer(departments, many=True)
            return Response(serializer.data)
    elif request.method == 'POST':
        serializer = DepartmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'PUT':
        department = Departments.objects.get(DepartmentId=id)
        serializer = DepartmentSerializer(department, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        department = Departments.objects.get(DepartmentId=id)
        department.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def employeeApi(request, id=None):
    if request.method == 'GET':
        if id:
            employee = Employees.objects.get(EmployeeId=id)
            serializer = EmployeeSerializer(employee)
            return Response(serializer.data)
        else:
            employees = Employees.objects.all()
            serializer = EmployeeSerializer(employees, many=True)
            return Response(serializer.data)
    elif request.method == 'POST':
        serializer = EmployeeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'PUT':
        employee = Employees.objects.get(EmployeeId=id)
        serializer = EmployeeSerializer(employee, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        employee = Employees.objects.get(EmployeeId=id)
        employee.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
def SaveFile(request):
    file = request.FILES['file']
    file_name = default_storage.save(file.name, file)
    return Response(file_name, status=status.HTTP_200_OK)
