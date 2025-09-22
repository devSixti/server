import { AsyncCustomResponse } from "../../../common/types";
import { ErrorMsg, extractPayload } from "../../../common/utils";
import { DiscountModel } from "../../../users/models";

export const activateNewDiscount = async (
  token: string
): AsyncCustomResponse => {
  try {
    const { id } = extractPayload(token);

    const discountToUpdate = await DiscountModel.findById(id);

    // 1. validate discount exist
    if (!discountToUpdate) {
      throw new ErrorMsg(
        "Discount not found. Please check the information and try again.",
        404
      );
    }

    // 2. Validate discount is active
    if (discountToUpdate.is_active) {
      throw new ErrorMsg("Discount is already active.", 400);
    }

    // 3. Activate discount
    const discountUpdated = await DiscountModel.findByIdAndUpdate(
      id,
      {
        is_active: true,
      },
      { new: true }
    );

    return {
      message: "Discount activated successfully.",
      info: { token, discountUpdated },
    };
  } catch (error) {
    throw error;
  }
};
