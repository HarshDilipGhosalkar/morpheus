"use client";

import { useState, useEffect } from "react";
import { isAuthenticated, redirectToLogin } from "@/utils/auth";
import { useParams } from 'next/navigation';

export default function FormResponses() {
    const [responses, setResponses] = useState([]);
    const [formId, setFormId] = useState(null);
    const { formId: urlFormId } = useParams();

    // Debugging: Log the formId and params
    useEffect(() => {
        if (urlFormId) {
            setFormId(parseInt(urlFormId));  // Set formId state if available
        }
    }, [urlFormId]);

    // Fetch the responses
    useEffect(() => {
        if (formId === null) return;  // Wait until formId is set

        if (!isAuthenticated()) {
            redirectToLogin();
            return;
        }

        const fetchResponses = async () => {
            const response = await fetch(`http://127.0.0.1:8000/api/responses/?form=${formId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            const data = await response.json();

            // Debugging: Log the API response
            console.log("Fetched responses:", data);

            if (response.ok) {
                // Ensure the data is an array of objects
                if (Array.isArray(data)) {
                    setResponses(data);
                } else {
                    console.error("Expected an array but got:", data);
                }
            } else {
                console.error("Error fetching responses:", data);
            }
        };

        fetchResponses();
    }, [formId]);

    return (
        <div className="min-h-screen bg-gradient-to-r from-indigo-50 to-white p-8">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-3xl font-semibold mb-6 text-center">Form Responses</h1>
                <div className="space-y-4">
                    {/* Check if responses is an array and not empty */}
                    {Array.isArray(responses) && responses.length > 0 ? (
                        responses.map((response, index) => (
                            <div key={response.id} className="p-4 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 transition">
                                <h3 className="font-semibold text-lg mb-2">Response {index + 1}</h3>
                                <ul className="space-y-2">
                                    {/* Render response details */}
                                    <li>
                                        <strong>Response ID:</strong> {response.id}
                                    </li>
                                    <li>
                                        <strong>Submitted At:</strong> {new Date(response.submitted_at).toLocaleString()}
                                    </li>
                                    <li>
                                        <strong>Form ID:</strong> {response.form}
                                    </li>
                                </ul>
                            </div>
                        ))
                    ) : (
                        <p>No responses available.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
