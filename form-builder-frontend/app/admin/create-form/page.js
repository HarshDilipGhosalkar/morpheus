"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateForm() {
    const [formTitle, setFormTitle] = useState("");
    const [formDescription, setFormDescription] = useState("");
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState({
        text: "",
        type: "text",
        options: [],
    });
    const router = useRouter();

    // Check authentication
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
        }
    }, [router]);

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
        };

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/login");
                return;
            }

            // Save form
            const formResponse = await fetch("http://localhost:8000/api/forms/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (formResponse.ok) {
                const formResult = await formResponse.json();

                // Save questions
                if (questions.length > 0) {
                    const questionsWithFormId = questions.map((q, idx) => ({
                        ...q,
                        form: formResult.id,
                        order: idx + 1,
                    }));

                    const questionsResponse = await fetch("http://localhost:8000/api/questions/", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify(questionsWithFormId),
                    });

                    if (questionsResponse.ok) {
                        alert("Form and questions saved successfully!");
                    } else {
                        console.error(await questionsResponse.json());
                        alert("Form saved but failed to save questions.");
                    }
                } else {
                    alert("Form saved successfully!");
                    router.push("/admin");
                }
            } else if (formResponse.status === 401) {
                router.push("/login");
            } else {
                console.error(await formResponse.json());
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
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 flex items-center justify-center px-4">
            <div className="max-w-4xl w-full bg-white shadow-xl rounded-xl p-10 flex flex-col gap-6">
                <h1 className="text-3xl font-bold text-gray-800 text-center">Create Your Form</h1>

                {/* Form Title */}
                <div>
                    <label className="block text-gray-700 font-medium">Title</label>
                    <input
                        type="text"
                        placeholder="Enter form title"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
                    />
                </div>

                {/* Form Description */}
                <div>
                    <label className="block text-gray-700 font-medium">Description</label>
                    <textarea
                        placeholder="Enter form description"
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
                    />
                </div>

                {/* Add Questions */}
                <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                    <h2 className="text-lg font-semibold text-gray-800">Add Questions</h2>
                    <input
                        type="text"
                        placeholder="Enter question text"
                        value={newQuestion.text}
                        onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                        className="w-full mt-3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
                    />
                    <select
                        value={newQuestion.type}
                        onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value })}
                        className="w-full mt-3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
                    >
                        <option value="text">Text</option>
                        <option value="checkbox">Checkbox</option>
                        <option value="dropdown">Dropdown</option>
                    </select>

                    {newQuestion.type !== "text" && (
                        <div className="mt-4">
                            <input
                                type="text"
                                placeholder="Add option (Press Enter)"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && e.target.value.trim() !== "") {
                                        handleAddOption(e.target.value);
                                        e.target.value = "";
                                    }
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
                            />
                            <div className="flex flex-wrap gap-2 mt-2">
                                {newQuestion.options.map((option, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm"
                                    >
                                        {option}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    <button
                        onClick={addQuestion}
                        className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                    >
                        Add Question
                    </button>
                </div>

                {/* Questions List */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">Questions</h2>
                    <ul className="space-y-3 mt-3">
                        {questions.map((q, idx) => (
                            <li
                                key={idx}
                                className="p-3 border border-blue-200 bg-blue-50 rounded-lg shadow-sm"
                            >
                                <strong>Q{idx + 1}:</strong> {q.text} <em>({q.type})</em>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Save Form */}
                <button
                    onClick={saveForm}
                    className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600"
                >
                    Save Form
                </button>
            </div>
        </div>
    );
}
