import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //global vars
  const noteID = req.query.id; //ID
  const { title, content } = req.body; // REQ VALS
  //

  if (req.method === "PUT") {
    try {
      const updatedNote = await prisma.note.update({
        where: { id: Number(noteID) },
        data: {
          title: title,
          content: content,
        },
      });
      res.status(200).json({ message: "Updated" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Unable to update" });
    }
  }
}
