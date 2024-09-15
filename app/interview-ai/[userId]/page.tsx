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
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24 bg-gray-100">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <div className="flex flex-col w-full">
          <div className="text-black bg-white rounded-xl h-[400px] md:h-[600px] w-full md:w-[500px] mb-4 p-4 overflow-y-auto shadow-lg">
            {entries?.map((entry, i) => (
              <div key={entry._id} className="flex flex-col gap-2 text-black mb-4">
                <div className="text-black font-semibold">{entry.input}</div>
                <div className="text-gray-700">{entry.response}</div>
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
              className="p-2 rounded text-black w-full md:w-[430px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button className="p-2 rounded bg-blue-500 text-white w-full md:w-[100px] hover:bg-blue-600 active:bg-blue-700 transition-colors">
              Submit
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
