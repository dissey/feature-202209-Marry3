import { NextApiHandler } from "next";

const handler: NextApiHandler = (req, res) => {
  res.status(200).json({ up: true });
};

export default handler;
