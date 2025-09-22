import { Role } from "../../../users/types";
import { AsyncCustomResponse } from "../../../common/types";
import { capitalizeFirstLetter } from "../../../common/utils";
import { RoleModel, UserModel } from "../../models";
import { generateNickname, generateUserToken } from "../../utils";

export const authOrCreateNewUserFirstTime = async (userInfo: any): AsyncCustomResponse => {
  try {
    // 2. Destructure user information from the input object.
    const {
      name = "",
      lastName = "",
      phone,
      email,
      currentLocation,
    } = userInfo;

    // 3. Extract latitude and longitude from the current location.
    const latitude = currentLocation?.latitude || 0;
    const longitude = currentLocation?.longitude || 0;

    // 4. Create search criteria based on phone number and email.
    const searchCriteria: any = [];
    if (phone?.number) {
      searchCriteria.push({ "phone.number": phone.number });
    }

    if (email) {
      searchCriteria.push({ "email.address": email });
    }


    // 5. Search for an existing user based on the search criteria.
    const existingUser = await UserModel.findOne({
      $or: searchCriteria,
    })
      .populate("role")
      .populate("device")
      .populate("driver").lean();

    // 6. If no existing user is found, create a new user.
    if (!existingUser) {

      const role = await RoleModel.findOne({ name: Role.PASSENGER });

      const newUser = await UserModel.create({
        first_name: name,
        last_name: lastName,
        nick_name: generateNickname(name, lastName),
        phone: phone.number === "" ? undefined : phone,
        email: {
          address: email === "" ? undefined : email,
          verified: false,
        },
        role_id: role?._id,
        current_location: {
          type: "Point",
          coordinates: [latitude, longitude],
        },
        is_active: true,
      });

      // 7. Generate a token for the new user.
      const token = await generateUserToken(newUser);
      newUser.role_name = role?.name;

      // Add role_name to the newUser object
      const newUserResponse = {
        ...newUser.toObject(),
        role_name: role?.name,
      };

      return {
        message: `Welcome${capitalizeFirstLetter(
          `${newUser.first_name} ${newUser.last_name}`
        )}! Your account has been successfully created.`,
        info: { token, user: newUserResponse },
      };
    }

    // 9. If an existing user is found, generate a token for the user.
    const token = await generateUserToken(existingUser);

    // 10. Update the user's current location and save the changes.

    await UserModel.updateOne(
      { _id: existingUser._id },
      {
        current_location: {
          type: "Point",
          coordinates: [latitude, longitude],
        },
      }
    );

    const { role, ...userToResponse} = existingUser

    userToResponse.role_name = role?.name;
    // 11. Return a success message and user information.
    return {
      message: `Welcome, ${capitalizeFirstLetter(
        `${userToResponse.first_name} ${userToResponse.last_name}`
      )}! You are now logged in.`,
      info: { token, user: userToResponse },
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
