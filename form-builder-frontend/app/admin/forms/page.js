"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { isAuthenticated, redirectToLogin } from "@/utils/auth"; // Import the auth check

export default function FormList() {
    const [forms, setForms] = useState([]);
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated()) {
            redirectToLogin();  // Redirect if not authenticated
            return;
        }

        const fetchForms = async () => {
            const response = await fetch("http://localhost:8000/api/forms/", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setForms(data);
            } else {
                console.error("Error fetching forms", data);
            }
        };
        fetchForms();
    }, []);

    const handleViewForm = (formId) => {
        router.push(`/admin/forms/responses/${formId}/`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-purple-50 to-white p-8">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-3xl font-semibold mb-6 text-center">Your Created Forms</h1>
                <div className="space-y-4">
                    {forms.map((form) => (
                        <div key={form.id} className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 transition">
                            <div className="flex flex-col">
                                <h2 className="font-semibold text-lg">{form.title}</h2>
                                <p className="text-sm text-gray-600">{form.description}</p>
                            </div>
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => handleViewForm(form.id)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                >
                                    View Responses
                                </button>
                                <button
                                    onClick={() => router.push(`/admin/forms/analytics/${form.id}/`)}
                                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                                >
                                    View Analytics
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
