import { Calendar, User, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">EventHub</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/events" className="text-foreground hover:text-primary transition-colors">
              Eventos
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              Sobre
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="gap-2">
                <LogIn className="w-4 h-4" />
                Entrar
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="sm" className="gap-2 bg-gradient-primary hover:opacity-90 shadow-button">
                <User className="w-4 h-4" />
                Cadastrar
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
