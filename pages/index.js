import Header from "@/components/Header";
import Head from "next/head";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import Image from "next/image";

const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [generatedSummary, setGeneratedSummary] = useState("");

  const prompt = `Summarize this for a second-grade student:  ${text}`;

  const generateBio = async (e) => {
    e.preventDefault();
    setGeneratedSummary();
    setLoading(true);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });
    console.log("Edge function returned.");

    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedSummary((prev) => prev + chunkValue);
    }

    setLoading(false);
  };

  return (
    <>
      <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
        <Head>
          <title>Summarizer for a 2nd Grader</title>
        </Head>
        <Header />
        <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
          <h1 className="sm:text-6xl text-4xl max-w-2xl font-bold text-slate-900">
            Summarize Your Text
          </h1>
          <div className="max-w-xl w-full">
            <div className="flex mt-10 items-center space-x-3">
              <Image
                src="/process.png"
                width={30}
                height={30}
                alt="1 icon"
                className="mb-5 sm:mb-0"
              />
              <p className="text-left font-medium">Paste The Text Below .</p>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-black p-2 focus:ring-black my-5"
              placeholder={
                "Perfidious provocations of a pseudonymous purveyor of puerile pontifications."
              }
            />

            {!loading && (
              <button
                className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
                onClick={(e) => generateBio(e)}
              >
                Summarize It
              </button>
            )}
            {loading && (
              <button
                className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
                disabled
              >
                loading...
              </button>
            )}
          </div>
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{ duration: 2000 }}
          />
          <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
          <AnimatePresence mode="wait">
            <motion.div className="space-y-10 my-10">
              {generatedSummary && (
                <>
                  <div>
                    <h2 className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto">
                      Your generated Summary
                    </h2>
                  </div>
                  <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                    {generatedSummary && (
                      <div
                        className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                        onClick={() => {
                          navigator.clipboard.writeText(generatedSummary);
                          toast("Summary copied to clipboard", {
                            icon: "✂️",
                          });
                        }}
                        key={generatedSummary}
                      >
                        <p>{generatedSummary}</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </>
  );
};

export default HomePage;
