import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import {v1 as uuidv1} from "uuid";

function Sidebar() {
    const {allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats,user} = useContext(MyContext);

const getAllThreads = async () => {
    try {
        const response = await fetch(
            "http://localhost:8080/api/thread",
            {
                method: "GET",
                credentials: "include"
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch chat history");
        }

        const data = await response.json();

        setAllThreads(
            data.map((thread) => ({
                threadId: thread.threadId,
                title: thread.title
            }))
        );
    } catch (err) {
        console.error("Error fetching chat history:", err);
    }
};

    useEffect(() => {
        if (user){
            getAllThreads();
        }else{
            setAllThreads([]);
    }
}, [user]);


    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    }

const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);

    try {
        const response = await fetch(
            `http://localhost:8080/api/thread/${newThreadId}`,
            {
                method: "GET",
                credentials: "include"
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                errorData.error || "Failed to load conversation"
            );
        }

        const messages = await response.json();

        console.log("Loaded conversation messages:", messages);

        setPrevChats(messages);
        setNewChat(false);
        setReply(null);
        setPrompt("");
    } catch (error) {
        console.error("Error loading conversation:", error);
    }
}; 

    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, {method: "DELETE"});
            const res = await response.json();
            console.log(res);

            //updated threads re-render
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

            if(threadId === currThreadId) {
                createNewChat();
            }

        } catch(err) {
            console.log(err);
        }
    }

    return (
        <section className="sidebar">
            <button onClick={createNewChat}>
                <img src="src/assets/blacklogo.png" alt="gpt logo" className="logo"></img>
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>


            <ul className="history">
                {
                    allThreads?.map((thread, idx) => (
                        <li key={idx} 
                            onClick={(e) => changeThread(thread.threadId)}
                            className={thread.threadId === currThreadId ? "highlighted": " "}
                        >
                            {thread.title}
                            <i className="fa-solid fa-trash"
                                onClick={(e) => {
                                    e.stopPropagation(); //stop event bubbling
                                    deleteThread(thread.threadId);
                                }}
                            ></i>
                        </li>
                    ))
                }
            </ul>
 
            <div className="sign">
                <p>By ApnaCollege &hearts;</p>
            </div>
        </section>
    )
}

export default Sidebar;
