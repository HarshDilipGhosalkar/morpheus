"use client";

import { useState } from "react";

export default function CreateForm() {
    const [formTitle, setFormTitle] = useState("");
    const [formDescription, setFormDescription] = useState("");
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState({
        text: "",
        type: "text",
        options: [],
    });

    const addQuestion = () => {
        if (newQuestion.text.trim() !== "") {
            setQuestions([...questions, { ...newQuestion }]);
            setNewQuestion({ text: "", type: "text", options: [] });
        }
    };

    const saveForm = async () => {
        const formData = {
            title: formTitle,
            description: formDescription,
            questions,
        };

        try {
            const response = await fetch("http://localhost:8000/api/forms/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                alert("Form saved successfully!");
            } else {
                console.error(await response.json());
                alert("Failed to save form.");
            }
        } catch (error) {
            console.error("Error saving form:", error);
            alert("An error occurred.");
        }
    };

    const handleAddOption = (option) => {
        setNewQuestion({
            ...newQuestion,
            options: [...newQuestion.options, option],
        });
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 flex items-center justify-center px-4">
      <div className="max-w-3xl w-full bg-white shadow-2xl rounded-3xl p-10 flex flex-col gap-8">
        {/* Form Header */}
        <h1 className="text-4xl font-extrabold text-gray-800 text-center">
          🌟 Create Your Form 🌟
        </h1>
    
        {/* Form Title */}
        <div className="flex flex-col gap-2">
          <label htmlFor="formTitle" className="text-lg font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="formTitle"
            placeholder="Enter your form title"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            className="block w-full px-6 py-3 text-gray-800 bg-gray-50 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition"
          />
        </div>
    
        {/* Form Description */}
        <div className="flex flex-col gap-2">
          <label htmlFor="formDescription" className="text-lg font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="formDescription"
            placeholder="Enter your form description"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            rows={4}
            className="block w-full px-6 py-3 text-gray-800 bg-gray-50 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-4 focus:ring-pink-300 focus:border-pink-500 transition"
          ></textarea>
        </div>
    
        {/* Add Questions Section */}
        <div className="bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 p-6 rounded-2xl shadow-md flex flex-col gap-6">
          <h2 className="text-xl font-semibold text-gray-700">Add Questions</h2>
          <input
            type="text"
            placeholder="Enter question text"
            value={newQuestion.text}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, text: e.target.value })
            }
            className="w-full px-6 py-3 text-gray-800 bg-gray-50 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition"
          />
          <select
            value={newQuestion.type}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, type: e.target.value })
            }
            className="w-full px-6 py-3 bg-gray-50 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
          >
            <option value="text">Text</option>
            <option value="checkbox">Checkbox</option>
            <option value="dropdown">Dropdown</option>
          </select>
    
          {/* Options for Dropdown or Checkbox */}
          {newQuestion.type !== "text" && (
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Add an option (Press Enter)"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value.trim() !== "") {
                    handleAddOption(e.target.value);
                    e.target.value = "";
                  }
                }}
                className="w-full px-6 py-3 text-gray-800 bg-gray-50 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
              />
              <div className="flex flex-wrap gap-3">
                {newQuestion.options.map((option, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm shadow-md hover:bg-blue-600 cursor-pointer"
                  >
                    {option}
                  </span>
                ))}
              </div>
            </div>
          )}
    
          <button
            onClick={addQuestion}
            className="w-full px-6 py-3 bg-purple-500 text-white font-bold rounded-xl shadow-lg hover:bg-purple-600 hover:scale-105 transition"
          >
            ➕ Add Question
          </button>
        </div>
    
        {/* Display Questions */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-700">Questions</h2>
          {questions.map((q, idx) => (
            <div
              key={idx}
              className="p-4 bg-gradient-to-r from-blue-50 via-pink-50 to-purple-50 rounded-xl shadow-md hover:shadow-xl transition-transform transform hover:scale-105"
            >
              <p className="text-lg text-gray-800 font-medium">
                <strong>Q{idx + 1}:</strong> {q.text}{" "}
                <span className="text-sm text-gray-500">({q.type})</span>
              </p>
              {q.options.length > 0 && (
                <ul className="mt-2 text-gray-600 list-disc list-inside">
                  {q.options.map((opt, i) => (
                    <li key={i}>{opt}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
    
        {/* Save Form Button */}
        <button
          onClick={saveForm}
          className="w-full px-6 py-3 bg-green-500 text-white font-extrabold rounded-xl shadow-lg hover:bg-green-600 hover:scale-105 transition"
        >
          💾 Save Form
        </button>
      </div>
    </div>
    
    
    );
}
