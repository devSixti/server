import { DiscountModel } from "../models";
import { ErrorMsg } from "../../common/utils";

export const findDiscountOrThrow = async (id: string) => {
  const discount = await DiscountModel.findById(id);
  if (!discount) {
    throw new ErrorMsg("Discount not found. Please check the information and try again.", 404);
  }
  return discount;
};

export const userHasDiscountOfType = async (userId: string, type: string) => {
  return await DiscountModel.findOne({ user_id: userId, type });
};