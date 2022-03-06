import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { getM2MTokens } from "../../lib/tools";
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
      //fetch tokens
      const access_token = await getM2MTokens();

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
