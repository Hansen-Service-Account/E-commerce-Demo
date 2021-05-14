import fetch from "node-fetch";
import { HANSEN_CPQ_BASE_URL } from "../../../../../utils/constants";

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case "GET":
        const result = await fetch(
          `${HANSEN_CPQ_BASE_URL}/quotes/${req.query.quoteId}/items/${req.query.itemId}?include=${req.query.include}`
        );
        const jsonResult = await result.json();
        res.json(jsonResult);
        break;
      case "DELETE":
        const deleteResult = await (
          await fetch(
            `${HANSEN_CPQ_BASE_URL}/quotes/${req.query.quoteId}/items/${req.query.itemId}`,
            { method: "DELETE" }
          )
        ).json();
        res.json(deleteResult);
        break;
    }
  } catch (err) {
    console.log(err);
    res.status(err.httpStatus).json(err);
  }
}
