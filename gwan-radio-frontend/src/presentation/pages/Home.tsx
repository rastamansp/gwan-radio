import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Play, Calendar, Music, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NowPlayingWidget } from '../components/NowPlayingWidget';
import { useRadio } from '../contexts/RadioContext';
import newsData from '@/shared/data/news.json';
import eventsData from '@/shared/data/events.json';
import artistsData from '@/shared/data/artists.json';

const HeroSection = () => {
  const { play, isPlaying } = useRadio();
  
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&h=1080&fit=crop"
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-crowd-of-young-people-partying-at-a-concert-4879-large.mp4"
            type="video/mp4"
          />
        </video>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-fade-in">
          <span className="text-gradient-reggae">GWAN</span>
          <span className="text-foreground"> Reggae Radio</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Reggae 24/7 • Dancehall • Roots • Dub
        </p>
        <Button
          size="lg"
          onClick={play}
          disabled={isPlaying}
          className="gap-2 text-lg px-8 py-6 glow-primary animate-fade-in"
          style={{ animationDelay: '0.4s' }}
        >
          <Play className="h-5 w-5" />
          {isPlaying ? 'Tocando Agora' : 'Ouvir Agora'}
        </Button>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-muted-foreground rounded-full" />
        </div>
      </div>
    </section>
  );
};

const NowPlayingSection = () => (
  <section className="py-12 bg-card border-y border-border">
    <div className="container">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
            <Music className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Tocando Agora</h2>
        </div>
        <NowPlayingWidget showListeners className="flex-1 max-w-md" />
      </div>
    </div>
  </section>
);

const NewsSection = () => {
  const featuredNews = newsData.filter(n => n.featured).slice(0, 3);
  
  return (
    <section className="py-16">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Últimas Notícias</h2>
          <Link to="/noticias" className="text-primary hover:underline flex items-center gap-1">
            Ver todas <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredNews.map((news, index) => (
            <Link key={news.id} to={`/noticias/${news.slug}`}>
              <Card className="h-full card-hover overflow-hidden animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="aspect-video overflow-hidden">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary">
                      {news.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{news.date}</span>
                  </div>
                  <CardTitle className="line-clamp-2">{news.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-2">{news.excerpt}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

const EventsSection = () => {
  const upcomingEvents = eventsData.filter(e => e.featured).slice(0, 4);
  
  return (
    <section className="py-16 bg-card">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Próximos Eventos</h2>
          <Link to="/agenda" className="text-primary hover:underline flex items-center gap-1">
            Ver todos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {upcomingEvents.map((event, index) => (
            <Link key={event.id} to={`/agenda#${event.slug}`}>
              <Card className="card-hover animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="flex gap-4 p-4">
                  {/* Date Block */}
                  <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-primary/20 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-primary">
                      {new Date(event.date).getDate()}
                    </span>
                    <span className="text-xs text-muted-foreground uppercase">
                      {new Date(event.date).toLocaleString('pt-BR', { month: 'short' })}
                    </span>
                  </div>
                  
                  {/* Event Info */}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold truncate">{event.title}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {event.venue} • {event.city}
                    </p>
                    <p className="text-sm text-primary mt-1">{event.price}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

const ArtistOfWeek = () => {
  const featuredArtist = artistsData.find(a => a.featured);
  
  if (!featuredArtist) return null;
  
  return (
    <section className="py-16">
      <div className="container">
        <h2 className="text-3xl font-bold mb-8">Artista da Semana</h2>
        
        <Card className="overflow-hidden">
          <div className="md:flex">
            {/* Artist Image */}
            <div className="md:w-1/3">
              <img
                src={featuredArtist.image}
                alt={featuredArtist.name}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
            
            {/* Artist Info */}
            <div className="md:w-2/3 p-6 md:p-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary">
                  {featuredArtist.genre}
                </span>
                <span className="text-xs text-muted-foreground">{featuredArtist.origin}</span>
              </div>
              
              <h3 className="text-3xl font-bold mb-4">{featuredArtist.name}</h3>
              
              <p className="text-muted-foreground mb-6 line-clamp-4">
                {featuredArtist.bio.split('\n')[0]}
              </p>
              
              <Link to={`/artistas/${featuredArtist.slug}`}>
                <Button className="gap-2">
                  Ver Perfil Completo <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

const Home = () => {
  return (
    <>
      <Helmet>
        <title>GWAN Reggae Radio | Reggae 24/7 • Dancehall • Roots • Dub</title>
        <meta
          name="description"
          content="GWAN Reggae Radio - Sua rádio de reggae 24 horas. Ouça o melhor do reggae, dancehall, roots e dub direto do Brasil."
        />
        <meta property="og:title" content="GWAN Reggae Radio" />
        <meta property="og:description" content="Sua rádio de reggae 24 horas. Reggae • Dancehall • Roots • Dub" />
      </Helmet>

      <main>
        <HeroSection />
        <NowPlayingSection />
        <NewsSection />
        <EventsSection />
        <ArtistOfWeek />
      </main>
    </>
  );
};

export default Home;
