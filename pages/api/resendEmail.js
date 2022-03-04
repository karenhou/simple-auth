import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

const axios = require("axios").default;

export default withApiAuthRequired(async function resendEmail(req, res) {
  return new Promise(async (resolve, reject) => {
    try {
      const { user } = getSession(req, res);

      const fetchTokenOptions = {
        method: "POST",
        url: process.env.NEXT_PUBLIC_AUTH0_DOMAIN + "/oauth/token",
        headers: { "content-type": "application/json" },
        data: {
          grant_type: "client_credentials",
          client_id: process.env.AUTH0_MTOM_CLIENT_ID,
          client_secret: process.env.AUTH0_MTOM_CLIENT_SECRET,
          audience: process.env.NEXT_PUBLIC_AUTH0_DOMAIN + "/api/v2/",
        },
      };

      const getToken = await axios.request(fetchTokenOptions);

      const { access_token } = getToken.data;
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
      console.log("resendEmailResult ", resendEmailResult);
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
