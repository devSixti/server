import { DiscountModel } from "../../../users/models";
import { Discount, User } from "../../../users/types";

interface DiscountResponse {
  message: string;
  haveNewDiscount: boolean;
  newDiscount?: Discount;
}

interface GenerateDiscount {
  (params: {
    user: User;
    type: string;
    amount?: number;
    status?: boolean;
  }): Promise<DiscountResponse>;
}

export const generateDiscount: GenerateDiscount = async ({
  user,
  type,
  amount = 0.1,
  status = false,
}): Promise<DiscountResponse> => {
  try {
    let haveNewDiscount: boolean = false;

    const existingDiscount = await DiscountModel.findOne({
      user_id: user._id,
      type: type,
      // is_active: true,
    });

    if (existingDiscount) {
      if (existingDiscount.type === "emergencyContactChange")
        return {
          message:
            "User already has an active discount of type emergencyContactChange.",
          haveNewDiscount: (haveNewDiscount = false),
          // newDiscount: undefined,
        };

      if (existingDiscount.type === "emailChange")
        return {
          message: "User already has an active discount of type emailChange.",
          haveNewDiscount: (haveNewDiscount = false),
          // newDiscount: undefined,
        };

        return {
          message: "User already has a discount of this type.",
          haveNewDiscount: (haveNewDiscount = false),
        };
    }

    const newDiscount = await DiscountModel.create({
      user_id: user._id,
      type: type,
      amount: amount,
      is_active: status,
    });

    return {
      message: "Discount generated.",
      haveNewDiscount: newDiscount ? true : haveNewDiscount,
      newDiscount: newDiscount.toObject(),
    };
  } catch (error) {
    throw error;
  }
};
