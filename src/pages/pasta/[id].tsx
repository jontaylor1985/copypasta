import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { env } from "~/env.mjs";

const Pasta: NextPage = () => {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const stats = api.copypasta.stats.useQuery();
  const [ttl, setTtl] = useState(0);
  const id = router.query.id as string;
  const [copied, setCopied] = useState(false);

  const copyPastaQuery = api.copypasta.retrieve.useQuery(
    { id: id },
    {
      enabled: router.isReady && !loaded,
      retry: false,
    }
  );

  if (copyPastaQuery.isError) {
    location.href = "/404";
  }

  const bannerMessage = () => {
    if (copied) {
      return (
        <div className="flex w-full flex-row items-center justify-center bg-primary p-2 font-sans-title font-bold text-[#1A2F4B] ">
          <p>COPIED</p>
        </div>
      );
    } else {
      return (
        <div className="flex w-full flex-row items-center justify-center bg-red-600 p-2 font-sans-title font-bold text-white">
          <p>{env.NEXT_PUBLIC_BANNER_MESSAGE}</p>
        </div>
      );
    }
  };

  const statsText = () => {
    if (stats.data) {
      const writesFormatted = new Intl.NumberFormat("en-GB").format(
        stats.data.writes
      );
      const readsFormatted = new Intl.NumberFormat("en-GB").format(
        stats.data.reads
      );
      return (
        <h2 className="mt-5 font-sans-title text-2xl font-extrabold text-secondary">
          {writesFormatted} Shared messages, viewed {readsFormatted} times
        </h2>
      );
    } else {
      <h2 className="mt-5 font-sans-title text-2xl font-extrabold text-secondary">
        Loading stats...
      </h2>;
    }
  };

  useEffect(() => {
    if (ttl <= 0) return;
    const interval = setInterval(() => {
      setTtl(ttl - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [ttl]);

  if (copyPastaQuery.data && !loaded) {
    setLoaded(true);
    setTtl(Number(copyPastaQuery.data.ttl));
  }

  const copyToClipboard = () => {
    if (copyPastaQuery.data) {
      navigator.clipboard
        .writeText(String(copyPastaQuery.data.text))
        .catch(() => {
          // Ignore errors here
        })
        .then(() => {
          setCopied(true);
        })
        .finally(() => {
          // do nothing
        });
    }
  };

  useEffect(() => {
    if (!copied) return;
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  }, [copied]);

  const ttlDisplay = () => {
    if (loaded) {
      if (ttl <= 0) {
        return (
          <p className="mt-5 font-sans font-bold text-red-500">
            This message has expired and can no longer be shared
          </p>
        );
      } else {
        const hours = Math.floor(ttl / 3_600);
        const minutes = Math.floor((ttl - hours * 3_600) / 60);
        const seconds = ttl - hours * 3_600 - minutes * 60;

        return (
          <p className="mt-5 font-sans font-bold text-secondary">
            Expires in {String(hours).padStart(2, "0")}:
            {String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")}
          </p>
        );
      }
    } else {
      return (
        <p className="mt-5 font-sans font-bold text-secondary">
          Loading expiry time...
        </p>
      );
    }
  };

  return (
    <main className=" flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#000000] to-[#1A2F4B]">
      {bannerMessage()}
      <div className="m-auto flex w-[900px] flex-col items-center justify-center">
        <h1 className="font-sans-title text-7xl font-extrabold text-primary">
          CopyPasta{" "}
          <span className="inline text-3xl text-primary/50">BY JT</span>
        </h1>
        {statsText()}
        {ttlDisplay()}
        <pre
          onClick={copyToClipboard}
          className="mt-5 block w-full whitespace-pre-wrap rounded-lg border border-gray-600 bg-gray-700 p-2.5 font-sans text-base text-white placeholder-gray-400 focus:border-gray-600 focus:ring-gray-600"
        >
          {copyPastaQuery.data?.text}
        </pre>
        <button
          onClick={(_) => {
            location.href = "/";
          }}
          className="mt-5 w-full rounded-lg bg-primary/80 px-5 py-2.5 font-sans-title text-lg font-bold text-[#1A2F4B] hover:bg-primary active:bg-primary/80 disabled:bg-primary/50"
        >
          CREATE NEW
        </button>
      </div>
      {bannerMessage()}
    </main>
  );
};

export default Pasta;
