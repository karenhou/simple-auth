import { useUser } from "@auth0/nextjs-auth0";
import React from "react";
import Layout from "../components/layout/layout";

const Home = () => {
  const { user, error, isLoading } = useUser();

  return (
    <Layout user={user} loading={isLoading}>
      <h2 className="pt-3">Home page nothing to see here</h2>
    </Layout>
  );
};

export default Home;
