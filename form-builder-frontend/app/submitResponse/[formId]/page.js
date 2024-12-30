"use client";
import { useState, useEffect } from 'react';
import { useRouter,useParams } from 'next/navigation';

const FormSubmitPage = () => {
  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { formId } = useParams();

  useEffect(() => {
    if (!formId) return;

    // Fetch form data by formId
    const fetchFormData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/forms/${formId}/`);
        if (!response.ok) {
          throw new Error('Failed to fetch form');
        }
        const formData = await response.json();
        setForm(formData);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchFormData();
  }, [formId]);

  const handleInputChange = (questionId, value) => {
    setFormData(prevState => ({
      ...prevState,
      [questionId]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare the data to be sent to the backend
    const answers = Object.keys(formData).map(questionId => {
      const question = form.questions.find(q => q.id === parseInt(questionId));
      return {
        question: questionId,
        answer: question.type === 'checkbox' ? formData[questionId].split(',') : formData[questionId]
      };
    });

    const response = await fetch(`http://127.0.0.1:8000/api/responses/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        form: formId,
        answers,
      }),
    });

    if (response.ok) {
      alert('Form submitted successfully!');
      setFormData({});
    } else {
      alert('Error submitting form');
    }
  };

  if (loading) return <p>Loading form...</p>;

  if (error) return <p>{error}</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{form.title}</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formDescription}>{form.description}</div>
        
        {form.questions.map((question) => (
          <div key={question.id} style={styles.questionContainer}>
            <label style={styles.questionText}>{question.text}</label>
            {question.type === 'text' && (
              <input
                type="text"
                value={formData[question.id] || ''}
                onChange={(e) => handleInputChange(question.id, e.target.value)}
                style={styles.input}
              />
            )}

            {question.type === 'dropdown' && (
              <select
                value={formData[question.id] || ''}
                onChange={(e) => handleInputChange(question.id, e.target.value)}
                style={styles.input}
              >
                <option value="">Select an option</option>
                {question.options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}

            {question.type === 'checkbox' && (
              <div style={styles.checkboxGroup}>
                {question.options.map((option, index) => (
                  <label key={index} style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      value={option}
                      checked={formData[question.id] && formData[question.id].split(',').includes(option)}
                      onChange={(e) => {
                        const currentValue = formData[question.id] || '';
                        const newValue = e.target.checked
                          ? `${currentValue},${option}`.replace(/^,/, '') // Add option to selected list
                          : currentValue.replace(`,${option}`, '').replace(`${option},`, ''); // Remove option
                        handleInputChange(question.id, newValue);
                      }}
                      style={styles.checkbox}
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
        
        <button type="submit" style={styles.submitButton}>Submit</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    margin: '20px auto',
    padding: '20px',
    maxWidth: '600px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  title: {
    textAlign: 'center',
    fontSize: '28px',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formDescription: {
    marginBottom: '20px',
    fontStyle: 'italic',
    color: '#555',
  },
  questionContainer: {
    marginBottom: '20px',
  },
  questionText: {
    fontSize: '18px',
    marginBottom: '10px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    width: '100%',
  },
  checkboxGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  checkboxLabel: {
    marginBottom: '5px',
    fontSize: '16px',
  },
  checkbox: {
    marginRight: '10px',
  },
  submitButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '20px',
    transition: 'background-color 0.3s',
  },
};

export default FormSubmitPage;
