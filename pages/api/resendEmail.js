import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { getM2MTokens } from "../../lib/tools";

const axios = require("axios").default;

export default withApiAuthRequired(async function resendEmail(req, res) {
  return new Promise(async (resolve, reject) => {
    if (req.method !== "POST") {
      res.status(error.status || 500).json({
        message: "WRONG methods passed in",
      });
      resolve();
    }
    try {
      const { user } = getSession(req, res);

      //fetch tokens
      const access_token = await getM2MTokens();

      const resendEmailOptions = {
        method: "POST",
        url: "https://kh-auth.us.auth0.com/api/v2/jobs/verification-email",
        headers: {
          authorization: `Bearer ${access_token}`,
          "content-type": "application/json",
        },
        data: {
          user_id: user.sub,
        },
      };

      const resendEmailResult = await axios.request(resendEmailOptions);
      res.status(200).json(resendEmailResult.data);
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
