import { Instagram, Youtube, MessageCircle } from 'lucide-react';

const socialLinks = [
  {
    name: 'Instagram',
    url: 'https://instagram.com/gwanreggaeradio',
    icon: Instagram,
  },
  {
    name: 'YouTube',
    url: 'https://youtube.com/gwanreggaeradio',
    icon: Youtube,
  },
  {
    name: 'WhatsApp',
    url: 'https://wa.me/5511999999999',
    icon: MessageCircle,
  },
];

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card pb-24">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gradient-reggae">GWAN</span>
            <span className="text-sm text-muted-foreground">Reggae Radio</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label={social.name}
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © {currentYear} GWAN Reggae Radio. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
