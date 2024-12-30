"use client";

import { useState, useEffect } from "react";
import { useParams } from 'next/navigation'; // Importing useParams hook
import { isAuthenticated, redirectToLogin } from "@/utils/auth";  // Import the auth check

export default function FormAnalytics() {
    const [analytics, setAnalytics] = useState(null);
    const { formId } = useParams(); // Using useParams to get the formId

    useEffect(() => {
        if (!isAuthenticated()) {
            redirectToLogin();  // Redirect if not authenticated
            return;
        }

        const fetchAnalytics = async () => {
            const response = await fetch(`http://localhost:8000/api/analytics/${formId}/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setAnalytics(data);
            } else {
                console.error("Error fetching analytics", data);
            }
        };
        if (formId) {
            fetchAnalytics();
        }
    }, [formId]);

    return (
        <div className="min-h-screen bg-gradient-to-r from-teal-50 to-white p-8">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-3xl font-semibold mb-6 text-center">Form Analytics</h1>
                {analytics ? (
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Overall Insights</h3>
                        <div className="space-y-4">
                            {Object.entries(analytics).map(([questionId, questionData]) => {
                                // Process each question's analytics data
                                const { type, data } = questionData;
                                return (
                                    <div key={questionId} className="p-4 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 transition">
                                        <h4 className="font-semibold">
                                            Question ID: {questionId} - Type: {type}
                                        </h4>
                                        {type === "text" ? (
                                            <div>
                                                <h5 className="font-semibold">Top Words:</h5>
                                                <ul className="list-disc ml-6">
                                                    {data.top_words.length > 0 ? (
                                                        data.top_words.map((word, i) => (
                                                            <li key={i}>
                                                                {word.word}: {word.count} times
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li>No words available</li>
                                                    )}
                                                </ul>
                                                <p>Others: {data.others}</p>
                                            </div>
                                        ) : type === "dropdown" ? (
                                            <div>
                                                <h5 className="font-semibold">Top Options:</h5>
                                                <ul className="list-disc ml-6">
                                                    {data.top_options.length > 0 ? (
                                                        data.top_options.map((option, i) => (
                                                            <li key={i}>
                                                                {option.option}: {option.count} times
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li>No options available</li>
                                                    )}
                                                </ul>
                                                <p>Others: {data.others}</p>
                                            </div>
                                        ) : (
                                            <p>Unknown type</p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <p>Loading analytics...</p>
                )}
            </div>
        </div>
    );
}
