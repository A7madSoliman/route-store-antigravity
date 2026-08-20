export type SecurityField = "currentPassword" | "password" | "rePassword";

export type PasswordChangeState = Readonly<{
  status: "idle" | "success" | "error";
  field?: SecurityField;
  message?: string;
}>;

export const initialPasswordChangeState: PasswordChangeState = Object.freeze({
  status: "idle",
});
