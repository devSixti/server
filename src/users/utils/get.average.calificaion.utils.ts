import { ErrorMsg } from "../../common/utils";
import { Califications, User } from "../types";

export const getAverageCalification = (user: User): number => {

  if (!user) {
    throw new ErrorMsg("User not found.", 404);
  }

  const { califications } = user;

  if (!califications || califications.length === 0) {
    return 5;
  }

  const total = califications.reduce((acc, calification) => acc + calification.rating, 0);
  
  const average = total / califications.length;

  return average;
};
