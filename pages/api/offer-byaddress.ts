import { Prisma } from "@prisma/client";
import { ethers } from "ethers";
import { NextApiHandler } from "next";
import { prisma } from "../../lib/prisma";
import { verifyMarried } from "../../lib/verify";

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "GET") {
    try {
      const address = req.query.address as string;
      const offer = await prisma.offers.findFirst({
        where: {
          OR: [
            {
              Aaddress: address.toLowerCase(),
              status: 2,
              type: 0,
            },
            {
              Baddress: address.toLowerCase(),
              status: 2,
              type: 0,
            },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      if (!offer) {
        return res.status(400).json({
          message: "no offer",
        });
      } else {
        delete offer.Asignature;
        delete offer.Bsignature;
        res.status(200).json(offer);
      }
    } catch (e) {
      console.error(e);
      res.status(400).json({
        message: "get offer error",
      });
      return;
    }
  } else {
    res.status(404).send({
      message: "error",
    });
    return;
  }
};

export default handler;
