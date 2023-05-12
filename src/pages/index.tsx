import { timeLog } from "console";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const [pasta, setPasta] = useState("");
  const [ttl, setTtl] = useState(1);
  const save = api.copypasta.save.useMutation();
  const stats = api.copypasta.stats.useQuery();
  const textarearef = useRef<HTMLTextAreaElement>(null);
  const timeref = useRef<HTMLSelectElement>(null);
  const savePasta = async () => {
    const savedData = await save.mutateAsync({
      text: pasta,
      ttl: ttl,
    });
    location.href = `/pasta/${savedData.id}`;
  };

  useEffect(() => {
    if (textarearef.current) {
      textarearef.current.value = "";
    }
    if (timeref.current) {
      timeref.current.value = "1";
    }
  }, []);

  const statsText = () => {
    if (stats.data) {
      const writesFormatted = new Intl.NumberFormat("en-GB").format(
        stats.data.writes
      );
      const readsFormatted = new Intl.NumberFormat("en-GB").format(
        stats.data.reads
      );
      return (
        <h2 className="font-sans-title text-2xl font-extrabold text-secondary">
          {writesFormatted} Shared messages, viewed {readsFormatted} times
        </h2>
      );
    } else {
      <h2>Loading stats...</h2>;
    }
  };

  return (
    <>
      <Head>
        <title>CopyPasta</title>
        <meta name="description" content="CopyPasta App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#000000] to-[#1A2F4B]">
        <div className="flex w-full flex-row items-center justify-center bg-red-600 p-2 font-sans-title font-bold text-white">
          <p>SOME MESSAGE</p>
        </div>
        <div className="m-auto flex w-[900px] flex-col items-center justify-center">
          <h1 className="font-sans-title text-7xl font-extrabold text-primary">
            CopyPasta
          </h1>
          {statsText()}
          <textarea
            ref={textarearef}
            rows={20}
            className="mt-5 block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 font-sans text-base text-white placeholder-gray-400 focus:border-gray-600 focus:ring-gray-600"
            placeholder="What would you like to share?"
            onChange={(e) => setPasta(e.target.value)}
          ></textarea>
          <div className="mt-5 flex w-full flex-row gap-2">
            <button
              onClick={savePasta}
              disabled={pasta.length == 0}
              className="w-full rounded-lg bg-primary/80 px-5 py-2.5 font-sans-title text-lg font-bold text-[#1A2F4B] hover:bg-primary active:bg-primary/80 disabled:bg-primary/50"
            >
              SAVE
            </button>
            <select
              ref={timeref}
              onChange={(e) => setTtl(parseInt(e.target.value))}
              className="rounded-lg border border-gray-600 bg-gray-700 p-2.5 font-sans-title text-lg text-white placeholder-gray-400"
            >
              <option value={1}>1 Minute</option>
              <option value={60}>1 Hour</option>
              <option value={1_440}>1 Day</option>
            </select>
          </div>
        </div>
        <div className="flex w-full flex-row items-center justify-center bg-red-600 p-2 font-sans-title font-bold text-white">
          <p>SOME MESSAGE</p>
        </div>
      </main>
    </>
  );
};

export default Home;
