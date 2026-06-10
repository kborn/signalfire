export type AdminLoginRequest = {
  email: string;
  password: string;
};

export type AdminSessionResponse = {
  authenticated: true;
  adminUser: {
    id: number;
    email: string;
  };
};
