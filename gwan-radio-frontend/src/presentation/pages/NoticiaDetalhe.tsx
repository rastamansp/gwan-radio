import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import newsData from '@/shared/data/news.json';

const NoticiaDetalhe = () => {
  const { slug } = useParams<{ slug: string }>();
  const news = newsData.find(n => n.slug === slug);

  if (!news) {
    return (
      <main className="pt-24 pb-32">
        <div className="container text-center">
          <h1 className="text-4xl font-bold mb-4">Notícia não encontrada</h1>
          <Link to="/noticias">
            <Button>Voltar às Notícias</Button>
          </Link>
        </div>
      </main>
    );
  }

  const relatedNews = newsData
    .filter(n => n.id !== news.id && n.category === news.category)
    .slice(0, 3);

  return (
    <>
      <Helmet>
        <title>{news.title} | GWAN Reggae Radio</title>
        <meta name="description" content={news.excerpt} />
        <meta property="og:title" content={news.title} />
        <meta property="og:description" content={news.excerpt} />
        <meta property="og:image" content={news.image} />
      </Helmet>

      <main className="pt-24 pb-32">
        <article className="container max-w-4xl">
          {/* Back Button */}
          <Link to="/noticias" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Voltar às Notícias
          </Link>

          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm px-3 py-1 rounded bg-primary/20 text-primary">
                {news.category}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{news.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {news.author}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(news.date).toLocaleDateString('pt-BR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
          </header>

          {/* Featured Image */}
          <div className="aspect-video overflow-hidden rounded-lg mb-8">
            <img
              src={news.image}
              alt={news.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            {news.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-foreground/90 mb-4 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Related News */}
          {relatedNews.length > 0 && (
            <section className="mt-16 pt-8 border-t border-border">
              <h2 className="text-2xl font-bold mb-6">Notícias Relacionadas</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {relatedNews.map((related) => (
                  <Link
                    key={related.id}
                    to={`/noticias/${related.slug}`}
                    className="group"
                  >
                    <div className="aspect-video overflow-hidden rounded-lg mb-3">
                      <img
                        src={related.image}
                        alt={related.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                      {related.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </main>
    </>
  );
};

export default NoticiaDetalhe;
