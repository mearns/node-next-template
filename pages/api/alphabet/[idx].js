import { StatusCodes } from "http-status-codes";
import { handler } from "../../../lib/api-utils";

export default handler((req, res) => {
  res
    .status(StatusCodes.OK)
    .json("abcdefghijklmnopqrstuvwxyz".charAt(parseInt(req.query.idx, 10)));
});
