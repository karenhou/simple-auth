import React from "react";
import Layout from "../components/layout/layout";
import { useFetchUser } from "../lib/user";

const Dashboard = () => {
  const { user, loading } = useFetchUser({ required: true });

  return (
    <Layout user={user} loading={loading}>
      {loading ? (
        <div>Loading... or you're not authenticated</div>
      ) : (
        <div>Dashboard</div>
      )}
    </Layout>
  );
};

export default Dashboard;
