"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userRole = localStorage.getItem("role"); // Assume 'role' stores either 'admin' or 'user'

        if (token) {
            setIsLoggedIn(true);
            if (userRole === "admin") {
                setIsAdmin(true);
            }
        } else {
            setIsLoggedIn(false);
            router.push("/login");
        }
    }, [router]);

    return (
        <nav className="bg-gray-800 text-white py-4 px-8 flex justify-between items-center">
            <h1 className="text-xl font-bold">Form Builder</h1>
            <ul className="flex space-x-6">
                {isLoggedIn && (
                    <>
                        {isAdmin ? (
                            <>
                                <li>
                                    <Link href="/create-form">
                                        <a className="hover:underline">Create Form</a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/admin-analytics">
                                        <a className="hover:underline">Analytics</a>
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <li>
                                <Link href="/respond-form">
                                    <a className="hover:underline">Respond to Form</a>
                                </Link>
                            </li>
                        )}
                        <li>
                            <button
                                onClick={() => {
                                    localStorage.clear();
                                    router.push("/login");
                                }}
                                className="hover:underline"
                            >
                                Logout
                            </button>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
}
