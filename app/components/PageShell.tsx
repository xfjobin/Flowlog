import { ReactNode } from "react";

type PageShellProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

export default function PageShell({ title, description, children }: PageShellProps) {
  return (
    <main className="min-h-screen bg-white text-zinc-900 p-8">
      <h1 className="text-3xl font-semibold">{title}</h1>
      {description && <p className="mt-2 text-zinc-600">{description}</p>}
      {children}
    </main>
  );
}
