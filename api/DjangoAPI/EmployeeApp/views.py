# EmployeeApp/views.py

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Departments, Employees
from .serializers import DepartmentSerializer, EmployeeSerializer
from django.core.files.storage import default_storage
from django.http import Http404
import logging

logger = logging.getLogger(__name__)

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def departmentApi(request, id=None):
    if request.method == 'GET':
        if id:
            try:
                department = Departments.objects.get(DepartmentId=id)
                logger.debug(f"GET request for department with id={id}")
            except Departments.DoesNotExist:
                logger.error(f"Department with id={id} not found")
                raise Http404("Department not found")
            serializer = DepartmentSerializer(department)
            return Response(serializer.data)
        else:
            departments = Departments.objects.all()
            logger.debug("GET request for all departments")
            serializer = DepartmentSerializer(departments, many=True)
            return Response(serializer.data)
    
    elif request.method == 'POST':
        logger.debug(f"POST request with data={request.data}")
        serializer = DepartmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            logger.debug(f"Department created: {serializer.data}")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        logger.error(f"Validation errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'PUT':
        if id is None:
            logger.error("PUT request with id=None")
            return Response({"error": "Department id is required for update"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            department = Departments.objects.get(DepartmentId=id)
            logger.debug(f"PUT request for department with id={id}")
        except Departments.DoesNotExist:
            logger.error(f"Department with id={id} not found")
            raise Http404("Department not found")

        serializer = DepartmentSerializer(department, data=request.data)
        if serializer.is_valid():
            serializer.save()
            logger.debug(f"Department updated: {serializer.data}")
            return Response(serializer.data)
        logger.error(f"Validation errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        if id is None:
            logger.error("DELETE request with id=None")
            return Response({"error": "Department id is required for delete"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            department = Departments.objects.get(DepartmentId=id)
            logger.debug(f"DELETE request for department with id={id}")
        except Departments.DoesNotExist:
            logger.error(f"Department with id={id} not found")
            raise Http404("Department not found")
        department.delete()
        logger.debug(f"Department with id={id} deleted")
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def employeeApi(request, id=None):
    if request.method == 'GET':
        if id:
            try:
                employee = Employees.objects.get(EmployeeId=id)
                logger.debug(f"GET request for employee with id={id}")
            except Employees.DoesNotExist:
                logger.error(f"Employee with id={id} not found")
                raise Http404("Employee not found")
            serializer = EmployeeSerializer(employee)
            return Response(serializer.data)
        else:
            employees = Employees.objects.all()
            logger.debug("GET request for all employees")
            serializer = EmployeeSerializer(employees, many=True)
            return Response(serializer.data)
    
    elif request.method == 'POST':
        logger.debug(f"POST request with data={request.data}")
        serializer = EmployeeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            logger.debug(f"Employee created: {serializer.data}")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        logger.error(f"Validation errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'PUT':
        if id is None:
            logger.error("PUT request with id=None")
            return Response({"error": "Employee id is required for update"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            employee = Employees.objects.get(EmployeeId=id)
            logger.debug(f"PUT request for employee with id={id}")
        except Employees.DoesNotExist:
            logger.error(f"Employee with id={id} not found")
            raise Http404("Employee not found")

        serializer = EmployeeSerializer(employee, data=request.data)
        if serializer.is_valid():
            serializer.save()
            logger.debug(f"Employee updated: {serializer.data}")
            return Response(serializer.data)
        logger.error(f"Validation errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        if id is None:
            logger.error("DELETE request with id=None")
            return Response({"error": "Employee id is required for delete"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            employee = Employees.objects.get(EmployeeId=id)
            logger.debug(f"DELETE request for employee with id={id}")
        except Employees.DoesNotExist:
            logger.error(f"Employee with id={id} not found")
            raise Http404("Employee not found")
        employee.delete()
        logger.debug(f"Employee with id={id} deleted")
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
def SaveFile(request):
    file = request.FILES['file']
    logger.debug(f"File upload request: {file.name}")
    file_name = default_storage.save(file.name, file)
    logger.debug(f"File saved as: {file_name}")
    return Response(file_name, status=status.HTTP_200_OK)
