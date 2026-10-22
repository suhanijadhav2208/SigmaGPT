import { useState, useEffect } from "react";
import "./App.css";

import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import AuthGate from "./AuthGate.jsx";
import { MyContext } from "./MyContext.jsx";

import { v1 as uuidv1 } from "uuid";

function App() {
    // Existing SigmaGPT chat states
    const [prompt, setPrompt] = useState("");
    const [reply, setReply] = useState(null);
    const [currThreadId, setCurrThreadId] = useState(uuidv1());
    const [prevChats, setPrevChats] = useState([]);
    const [newChat, setNewChat] = useState(true);
    const [allThreads, setAllThreads] = useState([]);

    // Authentication states
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    // Check whether the user is already logged in
    useEffect(() => {
        let cancelled = false;

        async function checkSession() {
            try {
                const response = await fetch(
                    "http://localhost:8080/api/auth/me",
                    {
                        credentials: "include",
                    }
                );

                if (!response.ok) {
                    if (!cancelled) {
                        setUser(null);
                    }
                    return;
                }

                const data = await response.json();

                if (!cancelled) {
                    setUser(data.user);
                }
            } catch (error) {
                console.error(
                    "Unable to check login session:",
                    error
                );

                if (!cancelled) {
                    setUser(null);
                }
            } finally {
                if (!cancelled) {
                    setAuthLoading(false);
                }
            }
        }

        checkSession();

        return () => {
            cancelled = true;
        };
    }, []);

    // Called after successful login or signup
    const handleAuthenticated = (authenticatedUser) => {
        setUser(authenticatedUser);

        // Start with a fresh chat interface.
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
        setNewChat(true);
        setAllThreads([]);
    };

    // Logout
    const handleLogout = async () => {
        try {
            const response = await fetch(
                "http://localhost:8080/api/auth/logout",
                {
                    method: "POST",
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error("Unable to log out.");
            }

            setUser(null);

            setPrompt("");
            setReply(null);
            setCurrThreadId(uuidv1());
            setPrevChats([]);
            setNewChat(true);
            setAllThreads([]);
        } catch (error) {
            console.error("Logout failed:", error);
            alert("Unable to log out. Please try again.");
        }
    };

    const providerValues = {
        prompt,
        setPrompt,
        reply,
        setReply,
        currThreadId,
        setCurrThreadId,
        newChat,
        setNewChat,
        prevChats,
        setPrevChats,
        allThreads,
        setAllThreads,

        // Authentication information
        user,
        onLogout: handleLogout,
    };

    // Prevent the chat from appearing before session verification.
    if (authLoading) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    background: "#212121",
                    color: "#ececec",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontFamily: "Arial, sans-serif",
                }}
            >
                Checking your session...
            </div>
        );
    }

    // Show login/signup when the user is logged out.
    if (!user) {
        return (
            <AuthGate
                onAuthenticated={handleAuthenticated}
            />
        );
    }

    // Show your existing SigmaGPT interface after login.
    return (
        <div className="app">
            <MyContext.Provider value={providerValues}>
                <Sidebar />
                <ChatWindow />
            </MyContext.Provider>
        </div>
    );
}

export default App;