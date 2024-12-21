import { Sidebar } from "./Sidebar";
import { useTheme } from "../../contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-16 px-6 border-b border-purple-500/20 flex items-center justify-end bg-background/80 backdrop-blur-sm">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full w-10 h-10 hover:bg-purple-500/10"
            title={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
          >
            {theme === 'dark' ? (
              <Sun className="h-[1.4rem] w-[1.4rem] rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0" />
            ) : (
              <Moon className="absolute h-[1.4rem] w-[1.4rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            )}
            <span className="sr-only">Alternar tema</span>
          </Button>
        </header>
        <main className="flex-1 p-8 gradient-background overflow-auto">
          {children}
        </main>
        <footer className="p-4 text-center text-muted-foreground bg-background/40 backdrop-blur-sm border-t border-purple-500/20">
          Desenvolvido por Plazer® {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}
