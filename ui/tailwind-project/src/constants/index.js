// API Configuration
export const API_CONFIG = {
  BASE_URL: "http://127.0.0.1:8000/",
  ENDPOINTS: {
    EMPLOYEES: "employee",
    DEPARTMENTS: "department",
    UPLOAD: "employee/savefile"
  },
  PHOTO_URL: "http://127.0.0.1:8000/Photos/"
};

// Application Constants
export const APP_CONSTANTS = {
  DRAG_TYPES: {
    EMPLOYEE: "EMPLOYEE",
    DEPARTMENT: "DEPARTMENT",
    ROW: "ROW"
  },
  DEFAULT_PHOTO: "anonymous.jpg",
  MESSAGES: {
    SUCCESS: {
      CREATE: "Record created successfully",
      UPDATE: "Record updated successfully", 
      DELETE: "Record deleted successfully"
    },
    ERROR: {
      CREATE: "Failed to create record",
      UPDATE: "Failed to update record",
      DELETE: "Failed to delete record",
      FETCH: "Failed to fetch data",
      UPLOAD: "Failed to upload image"
    },
    CONFIRM: {
      DELETE: "Are you sure you want to delete this record?"
    }
  }
};

// UI Constants
export const UI_CONSTANTS = {
  ANIMATIONS: {
    DURATION: "300ms",
    EASING: "ease-in-out"
  },
  COLORS: {
    PRIMARY: "blue",
    SECONDARY: "green", 
    DANGER: "red",
    WARNING: "yellow",
    INFO: "purple"
  },
  BREAKPOINTS: {
    SM: "640px",
    MD: "768px", 
    LG: "1024px",
    XL: "1280px"
  }
};
