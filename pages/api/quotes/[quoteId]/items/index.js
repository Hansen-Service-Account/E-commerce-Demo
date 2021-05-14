import fetch from "node-fetch";
import { HANSEN_CPQ_BASE_URL } from "../../../../../utils/constants";

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case "POST":
        const result = await fetch(
          `${HANSEN_CPQ_BASE_URL}/quotes/${req.query.quoteId}/items`,
          {
            method: "POST",
            body: JSON.stringify(req.body),
            headers: { "Content-Type": "application/json" },
          }
        );
        const jsonResult = await result.json();
        res.json(jsonResult);
        break;
    }
  } catch (err) {
    console.log(err);
    res.json(err);
  }
}
