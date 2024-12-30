
# Backend Setup and API Testing Guide

This guide provides detailed instructions on setting up the backend for the Form Builder application, testing APIs, and troubleshooting common issues.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Setting up the Backend](#setting-up-the-backend)
  - [Install Dependencies](#install-dependencies)
  - [Setting up the Database](#setting-up-the-database)
  - [Running the Backend](#running-the-backend)
- [Testing the Backend APIs](#testing-the-backend-apis)
  - [Form Creation](#testing-form-creation)
  - [Response Submission](#testing-response-submission)
  - [Analytics Retrieval](#testing-analytics-retrieval)
  - [Question Creation](#testing-question-creation)
  - [Answer Creation](#testing-answer-creation)
- [Troubleshooting](#troubleshooting)

## Prerequisites

1. **Python 3.10 or higher**
2. **Node.js and npm** (if you plan to work on the frontend later)
3. **Postman or CURL** for testing API endpoints

## Setting up the Backend

### Install Dependencies

1. Create and activate a virtual environment:

    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

2. Install the required Python packages:

    ```bash
    pip install -r requirements.txt
    ```

    `requirements.txt` includes:
    - Django==5.1.4
    - djangorestframework==3.14.0
    - etc.

### Setting up the Database

1. Run migrations to set up the database:

    ```bash
    python manage.py migrate
    ```

### Running the Backend

1. Start the Django development server:

    ```bash
    python manage.py runserver
    ```

    The backend should now be running at `http://127.0.0.1:8000/`.

## Testing the Backend APIs

### Testing Form Creation
- **Endpoint:** `POST /api/forms/`
- **Description:** Allows admins to create a new form. This endpoint requires authentication.
  
#### Sample Input:
```json
{
  "title": "Survey on User Preferences"
}
```

#### Sample Output:
```json
{
  "id": 1,
  "title": "Survey on User Preferences",
  "created_by": 1,
  "created_at": "2024-12-30T12:00:00Z"
}
```

#### Testing:
Use Postman or CURL to send a `POST` request to `http://127.0.0.1:8000/api/forms/`.
Include the Authorization header with a valid token for an authenticated user.

### Testing Response Submission
- **Endpoint:** `POST /api/responses/`
- **Description:** Allows end users to submit responses to a form. No authentication is required.

#### Sample Input:
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

#### Sample Output:
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

#### Testing:
Use Postman or CURL to send a `POST` request to `http://127.0.0.1:8000/api/responses/`.
Ensure the response is saved and returned with the correct data.

### Testing Analytics Retrieval
- **Endpoint:** `GET /api/analytics/{form_id}/`
- **Description:** Allows both admins and users to view the analytics of a specific form.

#### Sample Input:
No input required; just pass the form_id in the URL.

#### Example:
`GET http://127.0.0.1:8000/api/analytics/1/`

#### Sample Output:
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

#### Testing:
Use Postman or CURL to send a `GET` request to `http://127.0.0.1:8000/api/analytics/1/`.
Verify that the analytics data is returned correctly for the form.

### Testing Question Creation
- **Endpoint:** `POST /api/questions/`
- **Description:** Allows admins to add questions to a form. Requires authentication.

#### Sample Input:
```json
{
  "form": 1,
  "question_text": "What is your favorite color?",
  "question_type": "text"
}
```

#### Sample Output:
```json
{
  "id": 1,
  "form": 1,
  "question_text": "What is your favorite color?",
  "question_type": "text"
}
```

#### Testing:
Use Postman or CURL to send a `POST` request to `http://127.0.0.1:8000/api/questions/`.

### Testing Answer Creation
- **Endpoint:** `POST /api/answers/`
- **Description:** Allows users to submit answers to a specific question. No authentication required.

#### Sample Input:
```json
{
  "question": 1,
  "answer": "Blue"
}
```

#### Sample Output:
```json
{
  "id": 1,
  "question": 1,
  "answer": "Blue"
}
```

#### Testing:
Use Postman or CURL to send a `POST` request to `http://127.0.0.1:8000/api/answers/`.

## Troubleshooting

### 404 Not Found:
- Ensure the server is running.
- Verify the endpoint URL.
- Check if the required form or question exists in the database.
