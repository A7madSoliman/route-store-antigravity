export type VerifyResetCodeState =
  | { status: "idle"; message?: undefined }
  | { status: "error"; message: string }
  | { status: "success"; message: string };

export const verifyResetCodeValidationMessage = "Enter the reset code.";
export const verifyResetCodeErrorMessage = "We couldn't verify that reset code. Please try again.";
export const verifyResetCodeSuccessMessage = "Reset code verified.";

export const initialVerifyResetCodeState: VerifyResetCodeState = {
  status: "idle",
};
