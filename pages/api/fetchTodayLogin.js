import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import moment from "moment";
import { getM2MTokens } from "../../lib/tools";

const axios = require("axios").default;

export default withApiAuthRequired(async function fetchTodayLogin(req, res) {
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

      const todayDate = moment(new Date()).format("YYYY-MM-DD");
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
