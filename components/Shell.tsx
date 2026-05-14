import AppLayout from "./AppLayout";

interface ShellProps {
  children: React.ReactNode;
  loggedIn?: boolean;
}

export default function Shell({ children, loggedIn = false }: ShellProps) {
  return <AppLayout loggedIn={loggedIn}>{children}</AppLayout>;
}
