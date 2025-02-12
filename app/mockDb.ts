export const mockDb: {
  company: string;
  state: string | null;
  token: {
    access_token: string;
    token_type: "Bearer";
    refresh_token: string;
    expires_in: number;
    scope: "signature";
  } | null;
} = {
  company: "",
  state: null,
  token: null,
};
