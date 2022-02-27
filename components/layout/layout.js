import Head from "next/head";
import React from "react";
import Nav from "../nav";

const Layout = ({ user, loading = false, children }) => {
  return (
    <>
      <Head>
        <title>Simple Auth</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
        crossOrigin="anonymous"></link>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@300&display=swap"
        rel="stylesheet"
      />

      <Nav user={user} loading={loading} />
      <main className="container mt-header">{children}</main>
    </>
  );
};

export default Layout;
