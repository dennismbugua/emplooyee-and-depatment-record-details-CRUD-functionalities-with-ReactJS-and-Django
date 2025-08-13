from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import Departments, Employees

# Custom Admin Site Configuration
admin.site.site_header = "🏢 Employee Management System"
admin.site.site_title = "EMS Admin Portal"
admin.site.index_title = "Welcome to Employee Management Dashboard"

@admin.register(Departments)
class DepartmentsAdmin(admin.ModelAdmin):
    list_display = ('department_id_display', 'department_name_display', 'employee_count', 'created_info')
    list_display_links = ('department_name_display',)
    search_fields = ('DepartmentName',)
    list_per_page = 20
    list_filter = ('DepartmentName',)
    
    def department_id_display(self, obj):
        return format_html(
            '<span style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); '
            'color: white; padding: 4px 8px; border-radius: 6px; font-weight: bold; '
            'font-size: 12px;"># {}</span>',
            obj.DepartmentId
        )
    department_id_display.short_description = "ID"
    
    def department_name_display(self, obj):
        return format_html(
            '<div style="display: flex; align-items: center;">'
            '<span style="background: #e3f2fd; color: #1976d2; padding: 6px 12px; '
            'border-radius: 8px; font-weight: 500; border-left: 4px solid #1976d2;">'
            '🏢 {}</span></div>',
            obj.DepartmentName
        )
    department_name_display.short_description = "Department Name"
    
    def employee_count(self, obj):
        count = Employees.objects.filter(Department=obj.DepartmentName).count()
        if count > 0:
            url = reverse('admin:EmployeeApp_employees_changelist') + f'?Department__exact={obj.DepartmentName}'
            return format_html(
                '<a href="{}" style="background: linear-gradient(135deg, #4caf50 0%, #45a049 100%); '
                'color: white; padding: 4px 12px; border-radius: 6px; text-decoration: none; '
                'font-weight: bold; display: inline-block; transition: all 0.3s;">'
                '👥 {} Employee{}</a>',
                url, count, 's' if count != 1 else ''
            )
        return format_html(
            '<span style="background: #ffebee; color: #c62828; padding: 4px 12px; '
            'border-radius: 6px; font-weight: 500;">👥 No Employees</span>'
        )
    employee_count.short_description = "Employees"
    
    def created_info(self, obj):
        return format_html(
            '<span style="color: #666; font-size: 12px;">📅 ID: {}</span>',
            obj.DepartmentId
        )
    created_info.short_description = "Info"

@admin.register(Employees)
class EmployeesAdmin(admin.ModelAdmin):
    list_display = ('employee_id_display', 'employee_photo', 'employee_name_display', 
                   'department_display', 'date_of_joining_display', 'tenure_display')
    list_display_links = ('employee_name_display',)
    search_fields = ('EmployeeName', 'Department', 'EmployeeId')
    list_filter = ('Department', 'DateOfJoining')
    list_per_page = 20
    date_hierarchy = 'DateOfJoining'
    ordering = ('-EmployeeId',)
    
    fieldsets = (
        ('👤 Employee Information', {
            'fields': ('EmployeeName', 'Department'),
            'classes': ('wide',),
        }),
        ('📅 Employment Details', {
            'fields': ('DateOfJoining',),
            'classes': ('wide',),
        }),
        ('📸 Profile Photo', {
            'fields': ('PhotoFileName',),
            'classes': ('wide',),
            'description': 'Upload or specify the filename for the employee photo'
        }),
    )
    
    def employee_id_display(self, obj):
        return format_html(
            '<span style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%); '
            'color: white; padding: 4px 8px; border-radius: 6px; font-weight: bold; '
            'font-size: 12px;"># {}</span>',
            obj.EmployeeId
        )
    employee_id_display.short_description = "ID"
    
    def employee_photo(self, obj):
        if obj.PhotoFileName and obj.PhotoFileName != 'anonymous.jpg':
            return format_html(
                '<img src="/Photos/{}" style="width: 40px; height: 40px; '
                'border-radius: 50%; object-fit: cover; border: 2px solid #ddd; '
                'box-shadow: 0 2px 4px rgba(0,0,0,0.1);" />',
                obj.PhotoFileName
            )
        return format_html(
            '<div style="width: 40px; height: 40px; border-radius: 50%; '
            'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); '
            'display: flex; align-items: center; justify-content: center; '
            'color: white; font-weight: bold; font-size: 14px;">👤</div>'
        )
    employee_photo.short_description = "Photo"
    
    def employee_name_display(self, obj):
        return format_html(
            '<div style="display: flex; flex-direction: column;">'
            '<span style="font-weight: 600; color: #333; font-size: 14px;">👤 {}</span>'
            '<span style="color: #666; font-size: 12px;">Employee #{}</span>'
            '</div>',
            obj.EmployeeName, obj.EmployeeId
        )
    employee_name_display.short_description = "Employee Name"
    
    def department_display(self, obj):
        dept_count = Employees.objects.filter(Department=obj.Department).count()
        return format_html(
            '<div style="background: #f3e5f5; color: #7b1fa2; padding: 6px 12px; '
            'border-radius: 8px; border-left: 4px solid #7b1fa2; display: inline-block;">'
            '<div style="font-weight: 600;">🏢 {}</div>'
            '<div style="font-size: 11px; opacity: 0.8;">{} member{}</div>'
            '</div>',
            obj.Department, dept_count, 's' if dept_count != 1 else ''
        )
    department_display.short_description = "Department"
    
    def date_of_joining_display(self, obj):
        return format_html(
            '<span style="background: #e8f5e8; color: #2e7d32; padding: 4px 8px; '
            'border-radius: 6px; font-weight: 500;">📅 {}</span>',
            obj.DateOfJoining.strftime('%b %d, %Y')
        )
    date_of_joining_display.short_description = "Joined"
    
    def tenure_display(self, obj):
        from datetime import date
        today = date.today()
        tenure = today - obj.DateOfJoining
        years = tenure.days // 365
        months = (tenure.days % 365) // 30
        
        if years > 0:
            tenure_text = f"{years}y {months}m"
            color = "#1976d2" if years >= 2 else "#ff9800"
        elif months > 0:
            tenure_text = f"{months}m"
            color = "#4caf50"
        else:
            tenure_text = f"{tenure.days}d"
            color = "#9c27b0"
            
        return format_html(
            '<span style="background: {}20; color: {}; padding: 4px 8px; '
            'border-radius: 6px; font-weight: 500; font-size: 12px;">⏱️ {}</span>',
            color, color, tenure_text
        )
    tenure_display.short_description = "Tenure"
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related()
