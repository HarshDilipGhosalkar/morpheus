"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // Importing useParams hook
import { isAuthenticated, redirectToLogin } from "@/utils/auth"; // Import the auth check
import { Bar, Pie } from "react-chartjs-2"; // Import charts
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function FormAnalytics() {
    const [analytics, setAnalytics] = useState(null);
    const { formId } = useParams(); // Using useParams to get the formId

    useEffect(() => {
        if (!isAuthenticated()) {
            redirectToLogin(); // Redirect if not authenticated
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

    const generateChartData = (data) => {
        const labels = data.map((item) => item.word || item.option);
        const counts = data.map((item) => item.count);
        return {
            labels,
            datasets: [
                {
                    label: "Occurrences",
                    data: counts,
                    backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#4BC0C0",
                        "#9966FF",
                        "#FF9F40",
                    ],
                },
            ],
        };
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-teal-50 to-white p-8">
            <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-4xl font-semibold mb-6 text-center text-blue-600">Form Analytics</h1>
                {analytics ? (
                    <div>
                        <h3 className="font-semibold text-2xl mb-6 text-gray-800">Overall Insights</h3>
                        <div className="space-y-6">
                            {Object.entries(analytics).map(([questionId, questionData]) => {
                                const { type, data } = questionData;
                                const chartData = type === "text" ? data.top_words : data.top_options;

                                return (
                                    <div
                                        key={questionId}
                                        className="p-4 bg-gradient-to-br from-gray-50 to-gray-200 rounded-md shadow-md max-w-md mx-auto"
                                    >

                                        <h4 className="font-semibold text-xl text-gray-700 mb-4">
                                            Question ID: {questionId} - Type: {type}
                                        </h4>
                                        {chartData.length > 0 ? (
                                            <>
                                                {type === "text" ? (
                                                    <div>
                                                        <h5 className="font-semibold text-lg mb-2">Top Words:</h5>
                                                        <Bar
                                                            data={generateChartData(chartData)}
                                                            options={{
                                                                responsive: true,
                                                                plugins: {
                                                                    legend: {
                                                                        position: "top",
                                                                    },
                                                                },
                                                            }}
                                                        />
                                                        <p className="mt-4 text-sm text-gray-600">
                                                            Others: {data.others}
                                                        </p>
                                                    </div>
                                                ) : type === "dropdown" ? (
                                                    <div>
                                                        <h5 className="font-semibold text-lg mb-2">Top Options:</h5>
                                                        <Pie
                                                            data={generateChartData(chartData)}
                                                            options={{
                                                                responsive: true,
                                                                plugins: {
                                                                    legend: {
                                                                        position: "top",
                                                                    },
                                                                },
                                                            }}
                                                        />
                                                        <p className="mt-4 text-sm text-gray-600">
                                                            Others: {data.others}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <p>Unknown type</p>
                                                )}
                                            </>
                                        ) : (
                                            <p className="text-gray-500">No data available for this question.</p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-600 text-center">Loading analytics...</p>
                )}
            </div>
        </div>
    );
}
