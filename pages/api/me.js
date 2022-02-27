import auth from "../../lib/auth";

export default async function me(req, res) {
  try {
    await auth.handleProfile(req, res);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).end(error.message);
  }
}
