"use client"

import { api } from "@/convex/_generated/api"
import { useMutation } from "convex/react"
import { useRouter } from "next/navigation"
import { useState } from "react";

export default function Main(){
    const createUserProfile = useMutation(api.user_profiles.createUserProfile)
    const router = useRouter();

    const [jobTitle, setjobTitle] = useState("");
    const [difficulty, setDifficulty] = useState("Easy");
    
    return (
    <div className="flex flex-col justify-center items-center w-full h-screen p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <h1 className="text-center mb-4 text-4xl font-bold">Welcome to Interview-AI</h1>
        <form onSubmit={
            (e) => {
                e.preventDefault();
            }
        }
        className="flex flex-col gap-4 w-full max-w-md bg-white p-6 rounded-lg shadow-lg"
        >
            <input className='text-black p-2 rounded border border-gray-300'
                type="text" name="jobTitle" 
                placeholder="Job Title" id="jobTitle" 
                value={jobTitle} 
                onChange={((e)=> setjobTitle(e.target.value))}></input>
            <select className="text-black p-2 rounded border border-gray-300" 
                name="difficulty" 
                id="difficulty" 
                value={difficulty}
                onChange={((e)=> setDifficulty(e.target.value))}>
                <option value="Easy">Easy</option>
                <option value="Normal">Normal</option>
                <option value="Hard">Hard</option>
            </select>
        </form>
        <button
            onClick={async(e) => {
                const userId = await createUserProfile({jobTitle: jobTitle, difficulty: difficulty},);
                console.log(userId);
        
                router.push(`/interview-ai/${userId}`)
            }}
            className="mt-4 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition duration-300"
            >
            Begin Interview
        </button>
    </div>
    )
}
