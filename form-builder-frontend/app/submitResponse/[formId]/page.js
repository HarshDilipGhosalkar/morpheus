"use client";
import { useState, useEffect } from "react";
import { useParams,useRouter } from "next/navigation";

const FormSubmitPage = () => {
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formId, setFormId] = useState(null);
  const { formId: urlFormId } = useParams();
const router = useRouter();
  // Set formId from URL parameters
  useEffect(() => {
    if (urlFormId) {
      setFormId(parseInt(urlFormId)); // Ensure it's an integer
    }
  }, [urlFormId]);

  // Fetch questions for the form
  useEffect(() => {
    if (!formId) return;

    const fetchQuestions = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/form-questions/${formId}/`);
        const data = await response.json();

        if (response.ok) {
          setQuestions(data);
        } else {
          console.error("Error fetching questions:", data);
          throw new Error("Failed to fetch questions");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [formId]);

  const handleInputChange = (questionId, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [questionId]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const answers = Object.keys(formData).map((questionId) => {
      const question = questions.find((q) => q.id === parseInt(questionId));
      return {
        question: questionId,
        answer:
          question?.type === "checkbox"
            ? formData[questionId].split(",")
            : formData[questionId],
      };
    });

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/responses/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          form: formId,
          answers,
        }),
      });

      if (response.ok) {
        alert("Form submitted successfully!");
        router.push("/admin");
        setFormData({});
      } else {
        alert("Error submitting form");
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  if (loading) return <p className="text-center text-lg">Loading form...</p>;

  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 flex items-center justify-center px-4">
      <div className="w-6/12 max-w-6xl mx-auto p-8 bg-white shadow-xl rounded-xl space-y-6 mt-10"> {/* Increased width and margin-top */}
        <h1 className="text-3xl font-semibold text-center text-gray-800">Form Submission</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((question) => {
            if (!question.type) {
              console.error(`Question with ID ${question.id} is missing 'type'.`);
              return null;
            }

            return (
              <div key={question.order} className="space-y-4">
                <label className="block text-lg font-medium text-gray-700">{question.text}</label>

                {question.type === "text" && (
                  <input
                    type="text"
                    value={formData[question.order] || ""}
                    onChange={(e) =>
                      handleInputChange(question.order, e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                )}

                {question.type === "dropdown" && (
                  <select
                    value={formData[question.order] || ""}
                    onChange={(e) =>
                      handleInputChange(question.order, e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Select an option</option>
                    {question.options.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}

                {question.type === "checkbox" && (
                  <div className="space-y-2">
                    {question.options.map((option, index) => (
                      <label
                        key={index}
                        className="inline-flex items-center space-x-2 text-lg text-gray-700"
                      >
                        <input
                          type="checkbox"
                          value={option}
                          checked={
                            formData[question.order] &&
                            formData[question.order]
                              .split(",")
                              .includes(option)
                          }
                          onChange={(e) => {
                            const currentValue = formData[question.order] || "";
                            const newValue = e.target.checked
                              ? `${currentValue},${option}`.replace(/^,/, "")
                              : currentValue
                                  .replace(`,${option}`, "")
                                  .replace(`${option},`, "");
                            handleInputChange(question.order, newValue);
                          }}
                          className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <button
            type="submit"
            className="w-full p-4 bg-blue-600 text-white font-semibold text-lg rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormSubmitPage;
