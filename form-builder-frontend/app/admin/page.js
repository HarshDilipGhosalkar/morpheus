"use client";
import Link from "next/link";
import { FaClipboardList, FaPlusSquare, FaEdit } from "react-icons/fa";

export default function AdminDashboard() {
  return (
    <div className="bg-blue-50 min-h-screen">
      {/* Header */}
      <header className="bg-blue-500 text-white py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Create Form Card */}
          <Link href="/admin/create-form">
            <div className="bg-white shadow-md hover:shadow-lg rounded-lg p-6 text-center transition-transform transform hover:scale-105 cursor-pointer">
              <FaPlusSquare className="text-blue-500 text-4xl mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-gray-700">Create Form</h2>
              <p className="text-sm text-gray-500">
                Design and configure a new form for users to respond to.
              </p>
            </div>
          </Link>

          {/* View Forms Card */}
          <Link href="/admin/forms">
            <div className="bg-white shadow-md hover:shadow-lg rounded-lg p-6 text-center transition-transform transform hover:scale-105 cursor-pointer">
              <FaClipboardList className="text-blue-500 text-4xl mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-gray-700">View Forms</h2>
              <p className="text-sm text-gray-500">
                Browse and manage all forms you've created.
              </p>
            </div>
          </Link>

          {/* Respond to Form Card */}
          <Link href="/submitResponse">
            <div className="bg-white shadow-md hover:shadow-lg rounded-lg p-6 text-center transition-transform transform hover:scale-105 cursor-pointer">
              <FaEdit className="text-blue-500 text-4xl mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-gray-700">Respond to a Form</h2>
              <p className="text-sm text-gray-500">
                Preview and test user responses for your forms.
              </p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
