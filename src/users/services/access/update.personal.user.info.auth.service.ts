import { User } from "../../../users/types";
import { AsyncCustomResponse } from "../../../common/types";
import { ErrorMsg,  } from "../../../common/utils";
import { UserModel } from "../../../users/models";
import { discountsServices } from "..";

interface UpdatePersonalUserInfoAuthDto {
  name: string;
  lastName: string;
  nickName: string;
  birthDate: string;
  emergencyContact: {
    name: string;
    number: string;
  };
  imageUrl: string;
  address: string;
  phone: {
    number: string;
    code: string;
  };
}

export const updatePersonalUserInfoAuth = async (
  id: string,
  updateUserInfo: UpdatePersonalUserInfoAuthDto
): AsyncCustomResponse => {
  try {
    const { name, lastName, nickName, birthDate, emergencyContact, imageUrl, address, phone } =
      updateUserInfo;

    // 1. User id validation

    const userToUpdate = (await UserModel.findById(id).populate(
      "discounts"
    )) as User;

    if (!userToUpdate) {
      throw new ErrorMsg(
        "User not found. Please check the information and try again.",
        404
      );
    }

    // 2. Nickname validation

    const userByNickname = await UserModel.findOne({ nick_name: nickName });

    if (userByNickname) {
      throw new ErrorMsg(
        `User with nickname ${nickName} all ready exist. Please check the information and try again.`,
        404
      );
    }

    // 3. Emergency contact validation

    if (emergencyContact.number == userToUpdate.phone?.number) {
      throw new ErrorMsg(
        `The emergency contact number cannot be the same as the user's primary phone number. Please provide a different emergency contact number.`,
        400
      );
    }

    // 4. Prevent updating phone number if it is already set

    if (phone.number !== userToUpdate?.phone?.number) {
      throw new ErrorMsg(
        `Phone number cannot be updated as it is already registered. Please contact support for changes.`,
        400
      );
    }

    // 4. Update user

    const userUpdated = await UserModel.findByIdAndUpdate(
      id,
      {
        first_name: name,
        last_name: lastName,
        nick_name: nickName,
        birth_date: birthDate ? new Date(birthDate) : userToUpdate.birth_date,
        emergency_contact: emergencyContact,
        picture: imageUrl,
        address: address,
        phone:  phone ? phone : userToUpdate.phone ,

      },
      { new: true }
    );

    // 5. Add discount for uptate  fist time

    const { message, haveNewDiscount } = await discountsServices.generateDiscount({
      user: userToUpdate,
      type: "emergencyContactChange",
      status: true,
    });

    return {
      message: message ? [`update user auth.`, message] : `update user auth.`,
      info: {
        haveNewDiscount,
        user: userUpdated,
      },
    };
  } catch (error) {
    throw error;
  }
};
