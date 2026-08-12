export type ResetPasswordFieldErrors = {
  email?: string;
  newPassword?: string;
  rePassword?: string;
};

export type ResetPasswordState =
  | { status: "idle"; email?: undefined; message?: undefined; fieldErrors?: undefined }
  | { status: "error"; email: string; message: string; fieldErrors?: ResetPasswordFieldErrors }
  | { status: "success"; message: string };

export const resetPasswordErrorMessage = "We couldn't reset your password. Please try again.";
export const resetPasswordSuccessMessage =
  "Your password has been successfully reset. You can now sign in with your new credentials.";

export const initialResetPasswordState: ResetPasswordState = { status: "idle" };

