"use client"

import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const handlePlayerAction = useAction(api.chat.handlePlayerAction);
  const [message, setMessage] = useState("");

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <div className="flex flex-col">
        <div className="text-black bg-white rounded-xl h-[600px] w-[500px]"></div>
        <form onSubmit={
          (e) => {
            e.preventDefault();
            handlePlayerAction({ message });
          }
        }>
          <input 
            className="p-1 rounded text-black w-[430px]"
            name="message" 
            value={message} 
            onChange={(e) => setMessage(e.target.value)}>
          </input>
          <button className="p-1 rounded bg-white text-black">Submit</button>
        </form>
        </div>
      </div>
    </main>
  );
}
