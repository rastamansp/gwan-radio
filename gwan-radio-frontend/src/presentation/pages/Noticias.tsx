import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import newsData from '@/shared/data/news.json';

const Noticias = () => {
  const featuredNews = newsData.filter(n => n.featured);
  const regularNews = newsData.filter(n => !n.featured);

  return (
    <>
      <Helmet>
        <title>Notícias | GWAN Reggae Radio</title>
        <meta
          name="description"
          content="Fique por dentro das últimas notícias do mundo do reggae, dancehall e sound system. Notícias atualizadas sobre artistas, festivais e cultura."
        />
      </Helmet>

      <main className="pt-24 pb-32">
        <div className="container">
          <h1 className="text-4xl font-bold mb-8">Notícias</h1>

          {/* Featured News */}
          {featuredNews.length > 0 && (
            <section className="mb-12">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Main Featured */}
                <Link to={`/noticias/${featuredNews[0].slug}`} className="lg:row-span-2">
                  <Card className="h-full card-hover overflow-hidden">
                    <div className="aspect-video lg:aspect-[4/3] overflow-hidden">
                      <img
                        src={featuredNews[0].image}
                        alt={featuredNews[0].title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary">
                          {featuredNews[0].category}
                        </span>
                        <span className="text-xs text-muted-foreground">{featuredNews[0].date}</span>
                      </div>
                      <CardTitle className="text-2xl">{featuredNews[0].title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{featuredNews[0].excerpt}</p>
                    </CardContent>
                  </Card>
                </Link>

                {/* Secondary Featured */}
                {featuredNews.slice(1, 3).map((news) => (
                  <Link key={news.id} to={`/noticias/${news.slug}`}>
                    <Card className="h-full card-hover overflow-hidden">
                      <div className="flex h-full">
                        <div className="w-1/3 overflow-hidden">
                          <img
                            src={news.image}
                            alt={news.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="w-2/3 p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary">
                              {news.category}
                            </span>
                          </div>
                          <h3 className="font-semibold line-clamp-2 mb-2">{news.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{news.excerpt}</p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* All News Grid */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Todas as Notícias</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsData.map((news, index) => (
                <Link
                  key={news.id}
                  to={`/noticias/${news.slug}`}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <Card className="h-full card-hover overflow-hidden">
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
                      <CardTitle className="text-lg line-clamp-2">{news.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">{news.excerpt}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default Noticias;
