export type ProfileField = "name" | "email" | "phone";

export type ProfileUpdateState = Readonly<{
  status: "idle" | "success" | "error";
  field?: ProfileField;
  message?: string;
  updatedValue?: string;
}>;

export const initialProfileUpdateState: ProfileUpdateState = Object.freeze({
  status: "idle",
});
