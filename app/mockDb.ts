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
  user: {
    email: string;
    name: string;
    id: string;
  };
} = {
  company: "",
  state: null,
  token: null,
  user: {
    email: "zachary.goldberg@meetnirvana.com",
    name: "Zachary Goldberg",
    id: "zhg123",
  },
};
