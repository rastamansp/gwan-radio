import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/noticias', label: 'Notícias' },
  { path: '/agenda', label: 'Agenda' },
  { path: '/artistas', label: 'Artistas' },
  { path: '/sobre', label: 'Sobre' },
];

const Logo = () => (
  <Link to="/" className="flex items-center gap-2">
    <span className="text-2xl font-bold text-gradient-reggae">GWAN</span>
    <span className="hidden sm:inline text-sm text-muted-foreground">Reggae Radio</span>
  </Link>
);

const NavLinks = ({ onClick }: { onClick?: () => void }) => {
  const location = useLocation();
  
  return (
    <>
      {navLinks.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          onClick={onClick}
          className={`text-sm font-medium transition-colors hover:text-primary ${
            location.pathname === link.path 
              ? 'text-primary' 
              : 'text-muted-foreground'
          }`}
        >
          {link.label}
        </Link>
      ))}
      <Link
        to="/testar-chatbot"
        onClick={onClick}
        className={`text-sm font-medium transition-colors hover:text-primary ${
          location.pathname === '/testar-chatbot' 
            ? 'text-primary' 
            : 'text-muted-foreground'
        }`}
      >
        Chatbot
      </Link>
    </>
  );
};

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logout realizado com sucesso!');
      navigate('/');
      setIsOpen(false);
    } catch (error) {
      toast.error('Erro ao fazer logout');
    }
  };

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between">
        <Logo />

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <NavLinks />
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-accent transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                    {getUserInitials()}
                  </div>
                  <span className="text-sm font-medium text-foreground">{user?.name || 'Usuário'}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.name || 'Usuário'}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                    {isAdmin && (
                      <Badge variant="secondary" className="text-xs w-fit mt-1">
                        Admin
                      </Badge>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Entrar</Link>
            </Button>
          )}
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] bg-background">
            <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
            <div className="flex flex-col gap-6 mt-8">
              <NavLinks onClick={() => setIsOpen(false)} />
              
              {isAuthenticated ? (
                <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                  <div className="flex items-center space-x-3 px-2 py-2">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                      {getUserInitials()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-foreground truncate">{user?.name || 'Usuário'}</p>
                        {isAdmin && (
                          <Badge variant="secondary" className="text-xs">
                            Admin
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-destructive hover:text-destructive/80 transition-colors py-2 flex items-center text-left"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 pt-4">
                  <Button variant="ghost" size="sm" className="w-full" asChild>
                    <Link to="/login" onClick={() => setIsOpen(false)}>Entrar</Link>
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
};

export default Navbar;
