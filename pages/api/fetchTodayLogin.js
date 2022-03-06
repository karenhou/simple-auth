import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import moment from "moment";
const axios = require("axios").default;

export default withApiAuthRequired(async function fetchTodayLogin(req, res) {
  return new Promise(async (resolve, reject) => {
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

      const todayDate = moment(new Date()).format("YYYY-MM-DD");

      const { access_token } = getToken.data;
      const queryUserInfoOption = {
        method: "GET",
        url: "https://kh-auth.us.auth0.com/api/v2/users",
        headers: {
          authorization: `Bearer ${access_token}`,
          "content-type": "application/json",
        },
        params: {
          q: `last_login:[${todayDate} TO ${todayDate}]`,
        },
      };

      const queryTodayUser = await axios.request(queryUserInfoOption);

      res.status(200).json(queryTodayUser.data);
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
