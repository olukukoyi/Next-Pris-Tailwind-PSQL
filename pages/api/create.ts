import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { title, content } = req.body;
  if (req.method === "POST") {
    try {
      await prisma.note.create({
        data: {
          title,
          content,
        },
      });
    } catch (error) {
      console.log("Failed");
      res.status(500).json(error);
    }
  }
  res.status(200).json({ name: "John Doe" });
}
