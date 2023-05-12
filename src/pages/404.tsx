import Head from "next/head";
import { env } from "~/env.mjs";

const Custom404 = () => {
  return (
    <>
      <Head>
        <title>CopyPasta</title>
        <meta name="description" content="CopyPasta App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#000000] to-[#1A2F4B]">
        <div className="flex w-full flex-row items-center justify-center bg-red-600 p-2 font-sans-title font-bold text-white">
          <p>{env.NEXT_PUBLIC_BANNER_MESSAGE}</p>
        </div>
        <div className="m-auto flex w-[900px] flex-col items-center justify-center">
          <h1 className="font-sans-title text-7xl font-extrabold text-primary">
            CopyPasta{" "}
            <span className="inline text-3xl text-primary/50">BY JT</span>
          </h1>
          <h2 className="mt-5 justify-center text-center font-sans-title text-4xl font-bold text-red-500">
            Something went wrong, it doesn&apos;t look like this message exists
          </h2>
          <button
            onClick={(_) => {
              location.href = "/";
            }}
            className="mt-5 w-full rounded-lg bg-primary/80 px-5 py-2.5 font-sans-title text-lg font-bold text-[#1A2F4B] hover:bg-primary active:bg-primary/80 disabled:bg-primary/50"
          >
            CREATE NEW
          </button>
        </div>
        <div className="flex w-full flex-row items-center justify-center bg-red-600 p-2 font-sans-title font-bold text-white">
          <p>{env.NEXT_PUBLIC_BANNER_MESSAGE}</p>
        </div>
      </main>
    </>
  );
};

export default Custom404;
