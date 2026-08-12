export type SignInState = { status: "idle"; email: ""; message?: undefined } | { status: "error"; email: string; message: string };
export const initialSignInState: SignInState = { status: "idle", email: "" };
