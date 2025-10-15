import { DiscountModel } from "../../../users/models";
import { Discount, User } from "../../../users/types";
import { userHasDiscountOfType } from "../../utils/discount.utils";
import { generateTokens } from "../../../common/utils/generate.jwt.utils";

interface DiscountResponse {
  message: string;
  haveNewDiscount: boolean;
  newDiscount?: Discount;
  token?: string;
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
    const existingDiscount = await userHasDiscountOfType(user._id, type);

    if (existingDiscount) {
      if (existingDiscount.type === "emergencyContactChange")
        return {
          message: "User already has an active discount of type emergencyContactChange.",
          haveNewDiscount: false,
        };

      if (existingDiscount.type === "emailChange")
        return {
          message: "User already has an active discount of type emailChange.",
          haveNewDiscount: false,
        };

      return {
        message: "User already has a discount of this type.",
        haveNewDiscount: false,
      };
    }

    const newDiscount = await DiscountModel.create({
      user_id: user._id,
      type: type,
      amount: amount,
      is_active: status,
    });
    const { accessToken: token } = generateTokens(
      { id: newDiscount._id },
      { accessExpiresIn: "15m" }
    );

    return {
      message: "Discount generated.",
      haveNewDiscount: true,
      newDiscount: newDiscount.toObject(),
      token,
    };
  } catch (error) {
    throw error;
  }
};