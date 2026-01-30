import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import artistsData from '@/shared/data/artists.json';

const Artistas = () => {
  return (
    <>
      <Helmet>
        <title>Artistas | GWAN Reggae Radio</title>
        <meta
          name="description"
          content="Conheça os artistas de reggae, dancehall e dub que fazem parte da programação da GWAN Reggae Radio."
        />
      </Helmet>

      <main className="pt-24 pb-32">
        <div className="container">
          <h1 className="text-4xl font-bold mb-4">Artistas</h1>
          <p className="text-muted-foreground mb-8">
            Conheça os talentos do reggae brasileiro e internacional
          </p>

          {/* Artists Grid */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {artistsData.map((artist, index) => (
              <Link
                key={artist.id}
                to={`/artistas/${artist.slug}`}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <Card className="card-hover overflow-hidden group">
                  <div className="aspect-square overflow-hidden relative">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {artist.featured && (
                      <span className="absolute top-3 right-3 text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground">
                        Destaque
                      </span>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h2 className="font-bold text-lg group-hover:text-primary transition-colors">
                      {artist.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">{artist.genre}</p>
                    <p className="text-xs text-muted-foreground mt-1">{artist.origin}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Artistas;
