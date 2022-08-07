import { Prisma } from "@prisma/client";
import { ethers } from "ethers";
import { NextApiHandler } from "next";
import { prisma } from "../../../lib/prisma";
import { verifyMarried } from "../../../lib/verify";

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "POST") {
    try {
      // @todo 首先去合约中检查是否已经结婚
      // verify signature
      if (!req.body.nonce || !req.body.signature) {
        return res.status(400).json({
          message: "no valid signature",
        });
      }

      const hash = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(["string"], [req.body.nonce])
      );

      const message = ethers.utils.arrayify(hash);
      const verfiyAddress = ethers.utils.verifyMessage(
        message,
        req.body.signature
      );
      if (verfiyAddress != req.body.Aaddress) {
        return res.status(400).json({
          message: "error signature",
        });
      }

      const data = {
        Aaddress: req.body.Aaddress.toLowerCase(),
        Asignature: req.body.signature,
        type: 1,
      };
      const married = await verifyMarried(data.Aaddress);

      if (!married) {
        return res.status(400).json({
          message: "you have not married",
        });
      }

      // one offer one day
      const result = await prisma.offers.findFirst({
        where: {
          Aaddress: data.Aaddress,
          status: {
            not: -1,
          },
          type: 1,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      console.log("result", result);
      if (result) {
        return res.status(400).json({
          message: "you have not finished offer",
        });
      }
      // create offer
      const offer = await prisma.offers.create({
        data: data,
      });
      if (offer) {
        delete offer.Asignature;
        delete offer.Bsignature;
        res.status(200).json(offer);
      }
    } catch (e) {
      console.error(e);
      res.status(400).json({
        message: "create offer error",
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
