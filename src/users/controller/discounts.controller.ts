import { ExpressController, QueriesParametes } from "../../common/types";
import { discountsServices } from "../../users/services";

export const activateDiscount: ExpressController = async (req, res, next) => {
  try {
    const { discountToken = "" } = req.query as QueriesParametes;
    res
      .status(200)
      .json(await discountsServices.activateNewDiscount(discountToken));
  } catch (error) {
    next(error);
  }
};
