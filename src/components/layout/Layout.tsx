import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-8 bg-gradient-to-br from-purple-900 via-gray-900 to-black">
          {children}
        </main>
        <footer className="p-4 text-center text-white/60 bg-black/40 backdrop-blur-sm border-t border-white/10">
          Desenvolvido por Plazer® {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}
