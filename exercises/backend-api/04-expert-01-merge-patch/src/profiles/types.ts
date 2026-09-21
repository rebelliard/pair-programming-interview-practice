export type Profile = {
  id: string;
  displayName: string;
  contact: {
    email: string;
    phone?: string;
    address: {
      city: string;
      country: string;
    };
  };
  preferences: {
    theme: "light" | "dark";
    marketingEmail: boolean;
  };
  tags: string[];
};

export type RouteContext = {
  params: Promise<{ id: string }>;
};

export type RouteHandler = (
  request: Request,
  context: RouteContext,
) => Promise<Response>;
