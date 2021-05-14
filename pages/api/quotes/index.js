import fetch from "node-fetch";
import { HANSEN_CPQ_BASE_URL } from "../../../utils/constants";

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case "POST":
        const body = JSON.parse(req.body);
        const result = await fetch(`${HANSEN_CPQ_BASE_URL}/quotes`, {
          method: "POST",
          body: JSON.stringify(body),
          headers: { "Content-Type": "application/json" },
        });
        const jsonResult = await result.json();
        res.json(jsonResult);
    }
  } catch (err) {
    res.json(err);
  }
}
