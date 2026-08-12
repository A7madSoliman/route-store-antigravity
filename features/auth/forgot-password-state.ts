export type ForgotPasswordState =
  | { status: "idle"; email: ""; message?: undefined }
  | { status: "error"; email: string; message: string }
  | { status: "success"; email: ""; message: string };

export const forgotPasswordConfirmation =
  "If an account exists for this email, reset instructions will be sent.";

export const initialForgotPasswordState: ForgotPasswordState = {
  status: "idle",
  email: "",
};
