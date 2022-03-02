import React from "react";
import Layout from "../components/layout/layout";
import { useFetchUser } from "../lib/user";

const Home = () => {
  const { user, loading } = useFetchUser();

  return (
    <Layout user={user} loading={loading}>
      <h2 className="pt-3">Home page nothing to see here</h2>
    </Layout>
  );
};

export default Home;
