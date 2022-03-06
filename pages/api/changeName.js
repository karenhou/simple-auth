import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

const axios = require("axios").default;

export default withApiAuthRequired(async function changeName(req, res) {
  return new Promise(async (resolve, reject) => {
    const { user } = getSession(req, res);

    const { name } = JSON.parse(req.body);

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

      const chanegNameOptions = {
        method: "PATCH",
        url: `https://kh-auth.us.auth0.com/api/v2/users/${user.sub}`,
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${access_token}`,
        },
        data: {
          name: name,
        },
      };

      const results = await axios.request(chanegNameOptions);
      console.log("results ", results);
      res.status(results.status || 200).json(results.data);
      resolve();
    } catch (error) {
      console.log(error);
      res.status(error.status || 500).json({
        code: error.code,
        error: error.message,
      });
      resolve();
    }
  });
});
