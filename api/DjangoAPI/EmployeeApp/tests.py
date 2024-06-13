from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from .models import Departments, Employees
import json
import tempfile


class DepartmentApiTests(TestCase):

    def setUp(self):
        self.client = Client()
        self.department = Departments.objects.create(DepartmentName="Finance")

    def test_get_all_departments(self):
        response = self.client.get(reverse('departmentApi'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_single_department(self):
        response = self.client.get(
            reverse('departmentApi', args=[self.department.DepartmentId]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_department(self):
        data = {"DepartmentName": "Marketing"}
        response = self.client.post(reverse('departmentApi'), data=json.dumps(
            data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_update_department(self):
        data = {"DepartmentName": "Human Resources"}
        response = self.client.put(reverse('departmentApi', args=[
                                   self.department.DepartmentId]), data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_department(self):
        response = self.client.delete(
            reverse('departmentApi', args=[self.department.DepartmentId]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class EmployeeApiTests(TestCase):

    def setUp(self):
        self.client = Client()
        self.department = Departments.objects.create(DepartmentName="IT")
        self.employee = Employees.objects.create(
            EmployeeName="John Doe", Department=self.department.DepartmentName, DateOfJoining="2022-01-01", PhotoFileName="john_doe.jpg")

    def test_get_all_employees(self):
        response = self.client.get(reverse('employeeApi'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_single_employee(self):
        response = self.client.get(
            reverse('employeeApi', args=[self.employee.EmployeeId]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_employee(self):
        data = {"EmployeeName": "Jane Doe", "Department": "IT",
                "DateOfJoining": "2022-01-01", "PhotoFileName": "jane_doe.jpg"}
        response = self.client.post(reverse('employeeApi'), data=json.dumps(
            data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_update_employee(self):
        data = {"EmployeeName": "John Smith", "Department": "IT",
                "DateOfJoining": "2022-01-01", "PhotoFileName": "john_smith.jpg"}
        response = self.client.put(reverse('employeeApi', args=[
                                   self.employee.EmployeeId]), data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_employee(self):
        response = self.client.delete(
            reverse('employeeApi', args=[self.employee.EmployeeId]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class SaveFileTests(TestCase):

    def setUp(self):
        self.client = Client()
        self.test_file = tempfile.NamedTemporaryFile(suffix=".jpg")

    def tearDown(self):
        self.test_file.close()

    def test_save_file(self):
        with open(self.test_file.name, 'rb') as testfile:
            response = self.client.post(
                reverse('saveFile'), {'file': testfile})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
