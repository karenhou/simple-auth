import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { getM2MTokens } from "../../lib/tools";
const axios = require("axios").default;

export default withApiAuthRequired(async function changeName(req, res) {
  return new Promise(async (resolve, reject) => {
    if (req.method !== "PATCH") {
      res.status(error.status || 500).json({
        message: "WRONG methods passed in",
      });
      resolve();
    }

    const { user } = getSession(req, res);
    const { name } = JSON.parse(req.body);

    try {
      //fetch tokens
      const access_token = await getM2MTokens();

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
