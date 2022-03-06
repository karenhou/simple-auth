import { withApiAuthRequired } from "@auth0/nextjs-auth0";

const axios = require("axios").default;

export default withApiAuthRequired(async function fetchUser(req, res) {
  return new Promise(async (resolve, reject) => {
    if (req.method !== "GET") {
      res.status(error.status || 500).json({
        message: "WRONG methods passed in",
      });
      resolve();
    }
    try {
      const fetchTokenOptions = {
        method: "POST",
        url: process.env.AUTH0_ISSUER_BASE_URL + "/oauth/token",
        headers: { "content-type": "application/json" },
        data: {
          grant_type: "client_credentials",
          client_id: process.env.AUTH0_MTOM_CLIENT_ID,
          client_secret: process.env.AUTH0_MTOM_CLIENT_SECRET,
          audience: process.env.AUTH0_ISSUER_BASE_URL + "/api/v2/",
        },
      };

      const getToken = await axios.request(fetchTokenOptions);

      const { access_token } = getToken.data;
      const getUserOptions = {
        method: "GET",
        url: "https://kh-auth.us.auth0.com/api/v2/users",
        headers: {
          authorization: `Bearer ${access_token}`,
          "content-type": "application/json",
        },
      };

      const getUsers = await axios.request(getUserOptions);

      res.status(200).json(getUsers.data);
      resolve();
    } catch (error) {
      console.error(error);

      res.status(error.status || 500).json({
        code: error.code,
        error: error.message,
      });
      resolve();
    }
  });
});
