import type { ReactNode } from "react";
import { Header } from "./header";
import { ContentArea } from "./content-area";
import { Footer } from "./footer";

type PublicShellProps = {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
};

export function PublicShell({ children, header, footer }: PublicShellProps) {
  return (
    <div className="ds-shell-grid min-h-dvh bg-background">
      {header ?? <Header />}
      <ContentArea>{children}</ContentArea>
      {footer ?? <Footer />}
    </div>
  );
}
