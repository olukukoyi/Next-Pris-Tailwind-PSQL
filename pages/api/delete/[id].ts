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
  if (req.method === "DELETE") {
    const note = await prisma.note.delete({
      where: {
        id: Number(noteID),
      },
    });
    res.json(note);
  } else {
    console.log("Unable to delete");
  }
}
