import fetch from "node-fetch";
import { HANSEN_CPQ_BASE_URL } from "../../../../utils/constants";

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case "GET":
        const result = await fetch(
          `${HANSEN_CPQ_BASE_URL}/quotes/${req.query.quoteId}?include=quotePricing,pricing`
        );
        const jsonResult = await result.json();
        res.json(jsonResult);
        break;
    }
  } catch (err) {
    res.json(err);
  }
}
