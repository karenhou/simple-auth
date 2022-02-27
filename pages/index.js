import React from "react";
import Layout from "../components/layout/layout";
import { useFetchUser } from "../lib/user";

const Home = () => {
  const { user, loading } = useFetchUser();

  return (
    <Layout user={user} loading={loading}>
      <button type="button" className="btn btn-primary">
        Primary
      </button>
    </Layout>
  );
};

export default Home;
