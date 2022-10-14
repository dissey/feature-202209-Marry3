import { Prisma } from "@prisma/client";
import { ethers } from "ethers";
import moment from "moment";
import { NextApiHandler } from "next";
import { prisma } from "../../../lib/prisma";

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "GET") {
    let id = req.query.id as string;
    const data = await prisma.wedding.findFirst({
      where: {
        id: id,
      },
    });

    if (data) {
      const joiners = await prisma.wedding_join.findMany({
        where: {
          weddingId: id,
        },
      });
      res.status(200).json({
        message: "ok",
        wedding: data,
        joiners,
      });
    } else {
      res.status(404).send({
        message: "not exist id",
      });
    }
  } else {
    res.status(404).send({
      message: "not exist id",
    });
    return;
  }
};

export default handler;
