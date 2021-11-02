import withSession from "../../middleware/session";
import User from "../../models/user";
import { dbConnect } from "../../middleware/db";
import fetch from "../../utils/nodeFetchJson";
import { HANSEN_CPQ_V2_BASE_URL } from "../../utils/constants";

export default withSession(async (req, res) => {
  try {
    await dbConnect();

    const userId = req.session.get("userId");
    if (!userId) {
      return res.status(401).json({
        error: {
          field: "user",
          message: "Please log in to submit any orders.",
        },
      });
    }
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(401).json({
        error: {
          field: "user",
          message: "User does not exist in the system.",
        },
      });
    }

    const { quoteId } = req.body;
    const result = await fetch(
      `${HANSEN_CPQ_V2_BASE_URL}/orders/${quoteId}/submit`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );
    req.session.set("orderId", result.orderId);
    await req.session.save();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.data.httpStatus).json(error.data);
  }
});
