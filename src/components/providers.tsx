import { type ReactNode } from "react";
import { HelmetProvider } from "react-helmet-async";

export const Providers = ({ children }: { children: ReactNode }) => {
  return <HelmetProvider>{children}</HelmetProvider>;
};
