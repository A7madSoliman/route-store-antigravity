export type SignUpState =
  | { status: "idle"; name: string; email: string; phone: string; message?: undefined }
  | { status: "error"; name: string; email: string; phone: string; message: string }
  | { status: "account-created"; name: string; email: string; phone: string; message: string };

export const initialSignUpState: SignUpState = {
  status: "idle",
  name: "",
  email: "",
  phone: "",
};
