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
    <div className="flex justify-center items-center w-full h-screen">
        <h1>Welcome to the Interview-AI</h1>
            <form onSubmit={
                (e) => {
                    e.preventDefault();

                }
            }>
            <input className='text-black' 
                type="text" name="jobTitle" 
                placeholder="Job Title" id="jobTitle" 
                value={jobTitle} 
                onChange={((e)=> setjobTitle(e.target.value))}></input>
            <select className="text-black" 
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
                const userId = createUserProfile({jobTitle: jobTitle, difficulty: difficulty});
        
                router.push("/interview-ai/${userId}")
            }}>
            Begin Interview
        </button>
    </div>
    )
}
