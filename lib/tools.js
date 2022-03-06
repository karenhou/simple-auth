const axios = require("axios");

export const getM2MTokens = async () => {
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

  return getToken.data.access_token;
};
