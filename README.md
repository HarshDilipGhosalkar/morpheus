
# **Form Builder Application Setup and API Testing Guide**

## **Project Overview**

The **Form Builder Application** allows admins to create forms with multiple question types and gather responses. End users can submit responses to forms anonymously, and both admins and users can access analytics.

This project is built using Django Rest Framework for the backend and Next.js for the frontend. The database used is SQLite.

---

## **Table of Contents**

- [**Prerequisites**](#prerequisites)
- [**Setting up the Backend**](#setting-up-the-backend)
  - [Installing Dependencies](#installing-dependencies)
  - [Setting up the Database](#setting-up-the-database)
  - [Running the Backend](#running-the-backend)
- [**Setting up the Frontend**](#setting-up-the-frontend)
- [**Testing the Backend APIs**](#testing-the-backend-apis)
  - [Testing Form Creation](#testing-form-creation)
  - [Testing Response Submission](#testing-response-submission)
  - [Testing Analytics Retrieval](#testing-analytics-retrieval)
- [**Troubleshooting**](#troubleshooting)

---

## **Prerequisites**

Before setting up the project, ensure that you have the following installed:
- **Python 3.x**
- **Django 5.x**
- **Django Rest Framework**
- **SQLite (default database)**
- **Node.js and npm/yarn** (for the frontend setup)
- **Virtual Environment** (optional, but recommended)

---

## **Setting up the Backend**

### **Installing Dependencies**

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/your-username/form-builder-app.git
   cd form-builder-app/backend
   ```

2. Create and activate a virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scriptsctivate
   ```

3. Install the required Python packages:

   ```bash
   pip install -r requirements.txt
   ```

   **`requirements.txt` includes:**
   - `Django==5.1.4`
   - `djangorestframework==3.14.0`
   - etc.

---

### **Setting up the Database**

1. Make sure you're in the backend directory and that the virtual environment is activated.

2. Run migrations to set up the database:

   ```bash
   python manage.py migrate
   ```

---

### **Running the Backend**

1. Start the Django development server:

   ```bash
   python manage.py runserver
   ```

2. The backend should now be running at `http://127.0.0.1:8000/`.

---

## **Setting up the Frontend**

1. Navigate to the frontend directory:

   ```bash
   cd ../frontend
   ```

2. Install the required frontend dependencies:

   ```bash
   npm install  # Or yarn install
   ```

3. Start the frontend development server:

   ```bash
   npm run dev  # Or yarn dev
   ```

4. The frontend should now be running at `http://localhost:3000/`.

---

## **Testing the Backend APIs**

### **Testing Form Creation**

1. **Endpoint**: `POST /api/forms/`

2. **Description**: Allows admins to create a new form. This endpoint requires authentication.

3. **Sample Input**:

   ```json
   {
     "title": "Survey on User Preferences"
   }
   ```

4. **Sample Output**:

   ```json
   {
     "id": 1,
     "title": "Survey on User Preferences",
     "created_by": 1,
     "created_at": "2024-12-30T12:00:00Z"
   }
   ```

5. **Testing**:
   - Use Postman or CURL to send a `POST` request to `http://127.0.0.1:8000/api/forms/`.
   - Include the Authorization header with a valid token for an authenticated user.

---

### **Testing Response Submission**

1. **Endpoint**: `POST /api/responses/`

2. **Description**: Allows end users to submit responses to a form. No authentication is required.

3. **Sample Input**:

   ```json
   {
     "form": 1,
     "answers": [
       {
         "question": 1,
         "answer": "John Doe"
       },
       {
         "question": 2,
         "answer": "Male"
       }
     ]
   }
   ```

4. **Sample Output**:

   ```json
   {
     "id": 1,
     "submitted_at": "2024-12-30T12:10:00Z",
     "form": 1,
     "answers": [
       {
         "question": 1,
         "answer": "John Doe"
       },
       {
         "question": 2,
         "answer": "Male"
       }
     ]
   }
   ```

5. **Testing**:
   - Use Postman or CURL to send a `POST` request to `http://127.0.0.1:8000/api/responses/`.
   - Ensure the response is saved and returned with the correct data.

---

### **Testing Analytics Retrieval**

1. **Endpoint**: `GET /api/analytics/{form_id}/`

2. **Description**: Allows both admins and users to view the analytics of a specific form.

3. **Sample Input**:
   - No input required; just pass the `form_id` in the URL.
   - Example: `GET http://127.0.0.1:8000/api/analytics/1/`

4. **Sample Output**:

   ```json
   {
     "form": {
       "id": 1,
       "title": "Survey on User Preferences"
     },
     "analytics": {
       "text_question": {
         "most_common_words": {
           "John": 3,
           "Doe": 2,
           "Others": 5
         }
       },
       "checkbox_question": {
         "top_option_combinations": {
           "Apple, Banana": 3,
           "Others": 2
         }
       },
       "dropdown_question": {
         "most_selected_option": "Male"
       }
     }
   }
   ```

5. **Testing**:
   - Use Postman or CURL to send a `GET` request to `http://127.0.0.1:8000/api/analytics/1/`.
   - Verify that the analytics data is returned correctly for the form.

---

## **Troubleshooting**

### **404 Not Found**:
- Ensure that you have the correct URL and that the Django server is running.
- Check that the API endpoint exists and is correctly defined in the `urls.py`.
- Ensure that your request contains the correct parameters and headers.

---

**End of README**

