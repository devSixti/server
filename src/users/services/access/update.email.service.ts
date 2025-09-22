import { updateEmailBody } from "../../../common/email";
import { AsyncCustomResponse } from "../../../common/types";
import { ErrorMsg, generateJWT } from "../../../common/utils";
import { UserModel } from "../../../users/models";
import { User } from "../../../users/types";
import { discountsServices, commonServices } from "..";
import { verifyEmailBody } from "../../../users/emails";

export const updateEmail = async (
  id: string,
  updateEmailInfo: any
): AsyncCustomResponse => {
  try {
    let isEmailSended = false;
    let isSendNotification = false;
    let token: string | undefined;
    let emailVerificationToken: string | undefined;

    const { email, emailConfirmation } = updateEmailInfo;

    // 1. Email validation

    if (email !== emailConfirmation) {
      throw new ErrorMsg(
        "Email and email confirmation do not match. Please check and try again.",
        400
      );
    }

    // 2. User id validation

    const userToUpdate = (await UserModel.findById(id).populate(
      "discounts"
    )) as User;
    if (!userToUpdate) {
      throw new ErrorMsg(
        "User not found. Please check the information and try again.",
        404
      );
    }

    // 3. Update user email

    const userUpdated = await UserModel.findByIdAndUpdate(
      id,
      {
        email: {
          address: email,
          status: false,
        }
      },
      { new: true }
    ).populate("device") as User;

    if (!userUpdated) {
      throw new ErrorMsg(
        "Failed to update the user's email. Please try again.",
        500
      );
    }

    // 4. Add discount for first-time update

    const { message, haveNewDiscount, newDiscount } =
      await discountsServices.generateDiscount({
        user: userToUpdate,
        type: "emailChange",
        amount: 0.15,
        status: false,
      });

    // Generate token for email verification
    emailVerificationToken = (await generateJWT({ id: userUpdated._id }, 2592000)) as string;

    // Send email for email verification
    await commonServices.sendEmail({
      to: email,
      subject: "Verify your email address",
      htmlBody: verifyEmailBody({ email: email, token: emailVerificationToken }),
    });

    // 5. Generate JWT token for new discount

    if (newDiscount) {
      token = (await generateJWT({ id: newDiscount._id }, 2592000)) as string;

      // 6. Send email confirmation

      isEmailSended = await commonServices.sendEmail({
        to: email,
        subject: "Email validation: Your Email Has Been Successfully Updated",
        htmlBody: updateEmailBody({ email: email, token: token }),
      });



      // 7. Send push notification

      isSendNotification = await commonServices.sendNotificationToDevice({
        tokenDevice: userUpdated.device ? userUpdated.device?.token : "",
        title: "Email validation",
        description: "We send you a email to validate your email address.",
      });
    }

    // 8. Return response

    return {
      message: [
        `User email successfully updated to ${userUpdated?.email}.`,
        message,
      ],
      info: {
        isSendNotification,
        isEmailSended,
        haveNewDiscount,
        discountToken: token,
        userUpdated,
        emailVerificationToken,
      },
    };
  } catch (error) {
    throw error;
  }
};
