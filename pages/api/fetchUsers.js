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
      const accessToken = await getM2MTokens();

      const getUserOptions = {
        method: "GET",
        url: `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users`,
        headers: {
          authorization: `Bearer ${accessToken}`,
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
