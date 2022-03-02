import React from "react";
import Layout from "../components/layout/layout";
import { useFetchUser } from "../lib/user";

// const axios = require("axios").default;

// const options = {
//   method: "GET",
//   url: "https://kh-auth.us.auth0.com/api/v2/users",
//   params: { q: 'name:"OReily"', search_engine: "v3" },
//   headers: {
//     authorization: `Bearer ${process.env.NEXT_PUBLIC_YOUR_MGMT_API_ACCESS_TOKEN}`,
//   },
// };

const Profile = () => {
  const { user, loading } = useFetchUser({ required: true });

  // const fetchUserInfo = async () => {
  //   console.log("options ", options);
  //   axios
  //     .request(options)
  //     .then(function (response) {
  //       console.log("fetch token ", response.data);
  //     })
  //     .catch(function (error) {
  //       console.error(error);
  //     });
  // };

  return (
    <Layout user={user} loading={loading}>
      {loading ? (
        <div>Loading... or you're not authenticated</div>
      ) : (
        <>
          <div>Profile</div>
          <div>Name: {user.name}</div>
          <div>Email: {user.email}</div>
          <div>Nickname: {user.name}</div>
          {/* <button className="btn btn-primary" onClick={fetchUserInfo}>
            Click to call API
          </button> */}
        </>
      )}
    </Layout>
  );
};

export default Profile;
