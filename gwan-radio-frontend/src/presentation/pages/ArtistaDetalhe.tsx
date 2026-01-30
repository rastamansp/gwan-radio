import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Instagram, Youtube, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import artistsData from '@/shared/data/artists.json';

const ArtistaDetalhe = () => {
  const { slug } = useParams<{ slug: string }>();
  const artist = artistsData.find(a => a.slug === slug);

  if (!artist) {
    return (
      <main className="pt-24 pb-32">
        <div className="container text-center">
          <h1 className="text-4xl font-bold mb-4">Artista não encontrado</h1>
          <Link to="/artistas">
            <Button>Voltar aos Artistas</Button>
          </Link>
        </div>
      </main>
    );
  }

  const relatedArtists = artistsData
    .filter(a => a.id !== artist.id && a.genre === artist.genre)
    .slice(0, 4);

  return (
    <>
      <Helmet>
        <title>{artist.name} | GWAN Reggae Radio</title>
        <meta name="description" content={artist.bio.substring(0, 160)} />
        <meta property="og:title" content={artist.name} />
        <meta property="og:description" content={artist.bio.substring(0, 160)} />
        <meta property="og:image" content={artist.image} />
      </Helmet>

      <main className="pt-24 pb-32">
        <div className="container max-w-4xl">
          {/* Back Button */}
          <Link to="/artistas" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Voltar aos Artistas
          </Link>

          {/* Artist Header */}
          <div className="md:flex gap-8 mb-8">
            {/* Artist Image */}
            <div className="md:w-1/3 mb-6 md:mb-0">
              <div className="aspect-square overflow-hidden rounded-lg">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Artist Info */}
            <div className="md:w-2/3">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm px-3 py-1 rounded bg-primary/20 text-primary">
                  {artist.genre}
                </span>
                {artist.featured && (
                  <span className="text-sm px-3 py-1 rounded bg-secondary text-secondary-foreground">
                    Artista em Destaque
                  </span>
                )}
              </div>

              <h1 className="text-4xl font-bold mb-2">{artist.name}</h1>
              <p className="text-muted-foreground mb-6">{artist.origin}</p>

              {/* Social Links */}
              <div className="flex gap-3">
                {artist.instagram && (
                  <a
                    href={artist.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" className="gap-2">
                      <Instagram className="h-4 w-4" />
                      Instagram
                    </Button>
                  </a>
                )}
                {artist.youtube && (
                  <a
                    href={artist.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" className="gap-2">
                      <Youtube className="h-4 w-4" />
                      YouTube
                    </Button>
                  </a>
                )}
                {artist.spotify && (
                  <a
                    href={artist.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" className="gap-2">
                      <Music className="h-4 w-4" />
                      Spotify
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Biografia</h2>
            <div className="prose prose-invert max-w-none">
              {artist.bio.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-foreground/90 mb-4 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>

          {/* Related Artists */}
          {relatedArtists.length > 0 && (
            <section className="pt-8 border-t border-border">
              <h2 className="text-2xl font-bold mb-6">Artistas Relacionados</h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                {relatedArtists.map((related) => (
                  <Link
                    key={related.id}
                    to={`/artistas/${related.slug}`}
                    className="group"
                  >
                    <Card className="card-hover overflow-hidden">
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={related.image}
                          alt={related.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-semibold group-hover:text-primary transition-colors">
                          {related.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">{related.origin}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
};

export default ArtistaDetalhe;
