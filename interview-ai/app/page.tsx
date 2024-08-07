"use client"

import { api } from "@/convex/_generated/api";
import { useAction, useQuery } from "convex/react";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const handlePlayerAction = useAction(api.chat.handlePlayerAction);
  const entries =  useQuery(api.chat.getAllEntries);
  const [message, setMessage] = useState("");

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <div className="flex flex-col">
        <div className="text-black bg-white rounded-xl h-[600px] w-[500px] mb-2 p-2 overflow-y-auto">
          {entries?.map((entry, i) => (
            <div key={entry._id} className="flex flex-col gap-2 text-black">
              <p className="text-black">{entry.input}</p>
              <p className="text-black">{entry.response}</p>
            </div>
          ))}
        </div>
        <form onSubmit={
          (e) => {
            e.preventDefault();
            handlePlayerAction({ message });
            setMessage("");
          }
        }>
          <input 
            className="p-1 rounded text-black w-[430px]"
            name="message" 
            value={message} 
            onChange={(e) => setMessage(e.target.value)}>
          </input>
          <button className="p-1 rounded bg-white text-black w-[50px] active:bg-slate-200">Submit</button>
        </form>
        </div>
      </div>
    </main>
  );
}
