import Head from "next/head";

export default function Landing({ children }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Head>
        <title>BLNDR</title>
        <meta
          name="description"
          content="Decentralized dating that safeguards your data."
        />
      </Head>
      <section className="py-12">
        <div className="w-full md:w-8/12 text-left">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span> Welcome to <span className="text-indigo-600">BLNDR</span></span>
          </h1>
          <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
          Decentralized dating that safeguards your data.
          </p>
        </div>
      </section>
      <section className="py-12">{children}</section>
    </div>
  );
}
