"use client"

import { api } from "@/convex/_generated/api";
import { useAction, useQuery } from "convex/react";
import Image from "next/image";
import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel"; // Add this import

export default function InterviewAI(props: { params: { userId: string } }) {
  const handlePlayerAction = useAction(api.chat.handlePlayerAction);
  const entries = useQuery(api.chat.getUserEntry, {
    userId: props.params.userId,
  });
  const [message, setMessage] = useState("");

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <div className="flex flex-col w-full">
          <div className="text-black bg-white rounded-xl h-[400px] md:h-[600px] w-full md:w-[500px] mb-2 p-2 overflow-y-auto">
            {entries?.map((entry, i) => (
              <div key={entry._id} className="flex flex-col gap-2 text-black">
                <div className="text-black">{entry.input}</div>
                <div className="text-black">{entry.response}</div>
              </div>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handlePlayerAction({ 
                message, 
                userId: props.params.userId as Id<"user_profiles"> // Type conversion
              });
              setMessage("");
            }}
            className="flex flex-col md:flex-row gap-2"
          >
            <input
              className="p-1 rounded text-black w-full md:w-[430px]"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button className="p-1 rounded bg-white text-black w-full md:w-[50px] active:bg-slate-200">
              Submit
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
