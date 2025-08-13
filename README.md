# 🏢 Employee & Department Management System

A modern, full-stack web application for managing employees and departments with a beautiful React frontend and robust Django REST API backend.

## ✨ Features

### 🎨 **Modern UI/UX**
- **Stunning Dark Theme** with gradient backgrounds and glass morphism effects
- **Responsive Design** that works perfectly on all devices
- **Smooth Animations** and hover effects throughout the application
- **Toast Notifications** for user feedback
- **Confirmation Modals** for critical actions
![alt text](https://dennismbugua.co.ke/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2F5qghk7em%2Fblog%2Fe230ccb64fa75bd24cd43e7a72a525545f3c4d2c-1698x936.png&w=640&q=75)

### 👥 **Employee Management**
- ✅ Create, Read, Update, Delete (CRUD) operations
- 📸 Employee photo upload and management
- 🔍 Advanced search and filtering by name or department
- 🎯 Drag & drop functionality for reordering
- 📊 Real-time statistics and dashboard

### 🏢 **Department Management**
- ✅ Full CRUD operations for departments
- 🔢 Filter by department ID (numbers only)
- 📝 Filter by department name (alphanumeric)
- 📈 Department statistics and analytics
- 🎨 Beautiful card-based layout

### 🔧 **Technical Features**
- 🚀 Fast React 18 frontend with modern hooks
- 🎯 Django REST Framework for robust API
- 🎨 Tailwind CSS for beautiful styling
- 📱 Mobile-first responsive design
- 🔐 Secure authentication and data handling

## 🏗️ Project Structure

```
📦 Employee-Department-Management-System
├── 🎨 ui/tailwind-project/          # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   ├── pages/                   # Main application pages
│   │   ├── services/                # API service layer
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── utils/                   # Utility functions
│   │   ├── constants/               # App constants
│   │   └── styles/                  # Global styles
│   └── package.json
└── 🔧 api/DjangoAPI/                # Django Backend
    ├── DjangoAPI/                   # Project settings
    ├── EmployeeApp/                 # Main application
    │   ├── models.py                # Database models
    │   ├── views.py                 # API views
    │   ├── serializers.py           # Data serializers
    │   └── urls.py                  # URL routing
    ├── Photos/                      # Employee photos storage
    └── manage.py
```

## 🚀 Quick Start

### 📋 Prerequisites

Make sure you have the following installed on your machine:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download here](https://python.org/)
- **Git** - [Download here](https://git-scm.com/)

### 📥 Installation

#### 1. **Clone the Repository**

```bash
git clone https://github.com/yourusername/employee-department-management.git
cd employee-department-management
```

#### 2. **Backend Setup (Django API)**

```bash
# Navigate to the API directory
cd api/DjangoAPI

# Create a virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py makemigrations
python manage.py migrate

# Create a superuser (optional, for admin access)
python manage.py createsuperuser

# Start the Django development server
python manage.py runserver
```

The Django API will be running at: **http://127.0.0.1:8000/**

#### 3. **Frontend Setup (React App)**

```bash
# Open a new terminal and navigate to the UI directory
cd ui/tailwind-project

# Install Node.js dependencies
npm install

# Start the React development server
npm start
```

The React app will be running at: **http://localhost:3000/**

## 🎯 Usage

### 🏠 **Home Page**
- Beautiful landing page with system overview
- Quick navigation to Employee and Department management
- Real-time statistics display

### 👥 **Employee Management**
1. **View Employees**: Browse all employees in a beautiful table layout
2. **Add Employee**: Click "Add Employee" to create new records with photo upload
3. **Edit Employee**: Click the edit (blue) button to modify employee details
4. **Delete Employee**: Click the delete (red) button for removal with confirmation
5. **Search & Filter**: Use the search bar to find employees by name or department

### 🏢 **Department Management**
1. **View Departments**: See all departments in a clean, organized layout
2. **Add Department**: Create new departments with the "Add Department" button
3. **Edit Department**: Modify department information with the edit button
4. **Delete Department**: Remove departments with confirmation modal
5. **Filter Options**: 
   - Filter by ID (numbers only)
   - Filter by name (alphanumeric)

## 🔧 API Endpoints

### 👥 **Employee Endpoints**
```http
GET    /employee/              # Get all employees
POST   /employee/              # Create new employee
GET    /employee/{id}/         # Get specific employee
PUT    /employee/{id}/         # Update employee
DELETE /employee/{id}/         # Delete employee
POST   /employee/savefile/     # Upload employee photo
```

### 🏢 **Department Endpoints**
```http
GET    /department/            # Get all departments
POST   /department/            # Create new department
GET    /department/{id}/       # Get specific department
PUT    /department/{id}/       # Update department
DELETE /department/{id}/       # Delete department
```

## 🎨 Customization

### **Colors & Themes**
The application uses a beautiful dark theme with customizable colors in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#3B82F6',    // Blue
      secondary: '#10B981',   // Green
      accent: '#8B5CF6',      // Purple
    }
  }
}
```

### **Environment Variables**
Create a `.env` file in both frontend and backend directories:

**Frontend (.env)**
```env
REACT_APP_API_URL=http://127.0.0.1:8000
```

**Backend (.env)**
```env
DJANGO_SECRET_KEY=your-secret-key-here
DEBUG=True
```

## 🐛 Troubleshooting

### **Common Issues**

#### **1. CORS Issues**
Ensure `corsheaders` is properly configured in Django settings:
```python
CORS_ORIGIN_ALLOW_ALL = True
# Or specify specific origins
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
```

#### **2. Database Issues**
```bash
# Reset database
cd api/DjangoAPI
python manage.py flush
python manage.py makemigrations
python manage.py migrate
```

#### **3. Port Already in Use**
```bash
# Kill process on port 3000 (React)
npx kill-port 3000

# Kill process on port 8000 (Django)
npx kill-port 8000
```

<div align="center">

**Made with ❤️ by [Dennis Mbugua]**

⭐ **Star this repository if you found it helpful!** ⭐

</div>


## Read full article <a href="https://dennismbugua.co.ke/articles/building-a-modern-employee-management-system-with-react-js-and-django">here</a>
