import { AsyncCustomResponse } from "../../../common/types";
import { ErrorMsg, extractPayload } from "../../../common/utils";
import { DiscountModel } from "../../../users/models";
import { findDiscountOrThrow } from "../../utils/discount.utils";

export const activateNewDiscount = async (
  token: string
): AsyncCustomResponse => {
  try {
    const { id } = extractPayload(token);

    const discountToUpdate = await findDiscountOrThrow(id);

    if (discountToUpdate.is_active) {
      throw new ErrorMsg("Discount is already active.", 400);
    }

    const discountUpdated = await DiscountModel.findByIdAndUpdate(
      id,
      { is_active: true },
      { new: true }
    );

    return {
      message: "Discount activated successfully.",
      info: { discountUpdated },
    };
  } catch (error) {
    throw error;
  }
};