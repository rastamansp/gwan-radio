import { Helmet } from 'react-helmet-async';
import { Instagram, Youtube, MessageCircle, Radio, Music, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const socialLinks = [
  {
    name: 'Instagram',
    url: 'https://instagram.com/gwanreggaeradio',
    icon: Instagram,
    color: 'hover:text-pink-500',
  },
  {
    name: 'YouTube',
    url: 'https://youtube.com/gwanreggaeradio',
    icon: Youtube,
    color: 'hover:text-red-500',
  },
  {
    name: 'WhatsApp',
    url: 'https://wa.me/5511999999999',
    icon: MessageCircle,
    color: 'hover:text-green-500',
  },
];

const features = [
  {
    icon: Radio,
    title: 'Rádio 24/7',
    description: 'Programação ininterrupta com o melhor do reggae, dancehall, roots e dub.',
  },
  {
    icon: Music,
    title: 'Artistas Brasileiros',
    description: 'Valorizamos e divulgamos a cena reggae nacional em toda sua diversidade.',
  },
  {
    icon: Headphones,
    title: 'Sound System Culture',
    description: 'Promovemos a cultura sound system com sessions e eventos especiais.',
  },
];

const Sobre = () => {
  return (
    <>
      <Helmet>
        <title>Sobre | GWAN Reggae Radio</title>
        <meta
          name="description"
          content="Conheça a GWAN Reggae Radio, sua rádio de reggae 24 horas. Nossa missão é difundir a cultura reggae no Brasil."
        />
      </Helmet>

      <main className="pt-24 pb-32">
        <div className="container max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">
              <span className="text-gradient-reggae">GWAN</span> Reggae Radio
            </h1>
            <p className="text-xl text-muted-foreground">
              Reggae 24/7 • Dancehall • Roots • Dub
            </p>
          </div>

          {/* About Text */}
          <section className="mb-12">
            <Card className="bg-card/50">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Nossa História</h2>
                <div className="space-y-4 text-foreground/90">
                  <p>
                    A <strong className="text-primary">GWAN Reggae Radio</strong> nasceu da paixão pela música reggae e 
                    pela cultura jamaicana. Somos uma rádio online brasileira dedicada a difundir o melhor do reggae, 
                    dancehall, dub e sound system 24 horas por dia, 7 dias por semana.
                  </p>
                  <p>
                    Nossa missão é conectar fãs de reggae de todo o Brasil, promovendo artistas nacionais e 
                    internacionais, divulgando eventos e festas, e mantendo viva a cultura sound system em terras 
                    brasileiras.
                  </p>
                  <p>
                    O nome <strong className="text-primary">"GWAN"</strong> vem do patois jamaicano e significa 
                    "ir em frente", "continuar" - um chamado para seguir sempre em frente com positividade e fé. 
                    É essa energia que queremos transmitir através da nossa programação.
                  </p>
                  <p>
                    Desde São Paulo para o mundo, a GWAN Reggae Radio é sua conexão direta com as vibes positivas 
                    do reggae. <em className="text-secondary">One Love!</em>
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Features */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">O Que Fazemos</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature) => (
                <Card key={feature.title} className="text-center card-hover">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-bold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Social Links */}
          <section className="text-center">
            <h2 className="text-2xl font-bold mb-6">Conecte-se Conosco</h2>
            <p className="text-muted-foreground mb-6">
              Siga nossas redes sociais e fique por dentro de tudo que rola no mundo do reggae!
            </p>
            <div className="flex justify-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className={`gap-2 transition-colors ${social.color}`}
                  >
                    <social.icon className="h-5 w-5" />
                    {social.name}
                  </Button>
                </a>
              ))}
            </div>

            <div className="mt-8 p-6 rounded-lg bg-gradient-reggae">
              <p className="text-white font-bold text-lg">
                🎵 Ouça agora a GWAN Reggae Radio e sinta as vibes positivas! 🎵
              </p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default Sobre;
