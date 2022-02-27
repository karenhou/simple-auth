import React from "react";
import Layout from "../components/layout/layout";
import { useFetchUser } from "../lib/user";

const Profile = () => {
  const { user, loading } = useFetchUser({ required: true });

  return (
    <Layout user={user} loading={loading}>
      {loading ? (
        <div>Loading... or you're not authenticated</div>
      ) : (
        <div>Profile</div>
      )}
    </Layout>
  );
};

export default Profile;
