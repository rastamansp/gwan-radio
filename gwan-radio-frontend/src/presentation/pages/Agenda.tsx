import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { MapPin, Clock, Calendar, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import eventsData from '@/shared/data/events.json';

const Agenda = () => {
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [monthFilter, setMonthFilter] = useState<string>('all');

  // Get unique cities
  const cities = useMemo(() => {
    const uniqueCities = [...new Set(eventsData.map(e => e.city))];
    return uniqueCities.sort();
  }, []);

  // Get unique months
  const months = useMemo(() => {
    const uniqueMonths = [...new Set(eventsData.map(e => {
      const date = new Date(e.date);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }))];
    return uniqueMonths.sort();
  }, []);

  // Filter events
  const filteredEvents = useMemo(() => {
    return eventsData.filter(event => {
      const matchCity = cityFilter === 'all' || event.city === cityFilter;
      const eventMonth = `${new Date(event.date).getFullYear()}-${String(new Date(event.date).getMonth() + 1).padStart(2, '0')}`;
      const matchMonth = monthFilter === 'all' || eventMonth === monthFilter;
      return matchCity && matchMonth;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [cityFilter, monthFilter]);

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
  };

  return (
    <>
      <Helmet>
        <title>Agenda | GWAN Reggae Radio</title>
        <meta
          name="description"
          content="Confira a agenda de shows e eventos de reggae, dancehall e sound system. Encontre festas e festivais perto de você."
        />
      </Helmet>

      <main className="pt-24 pb-32">
        <div className="container">
          <h1 className="text-4xl font-bold mb-4">Agenda</h1>
          <p className="text-muted-foreground mb-8">
            Encontre os melhores eventos de reggae, dancehall e sound system
          </p>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="w-48 bg-card">
                <SelectValue placeholder="Filtrar por cidade" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">Todas as cidades</SelectItem>
                {cities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={monthFilter} onValueChange={setMonthFilter}>
              <SelectTrigger className="w-48 bg-card">
                <SelectValue placeholder="Filtrar por mês" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">Todos os meses</SelectItem>
                {months.map(month => (
                  <SelectItem key={month} value={month}>
                    {formatMonth(month)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(cityFilter !== 'all' || monthFilter !== 'all') && (
              <Button
                variant="ghost"
                onClick={() => {
                  setCityFilter('all');
                  setMonthFilter('all');
                }}
              >
                Limpar filtros
              </Button>
            )}
          </div>

          {/* Events List */}
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum evento encontrado com os filtros selecionados.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredEvents.map((event, index) => (
                <Card
                  key={event.id}
                  id={event.slug}
                  className="card-hover overflow-hidden animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardContent className="p-0">
                    <div className="md:flex">
                      {/* Event Image */}
                      <div className="md:w-1/4 aspect-video md:aspect-auto overflow-hidden">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Event Details */}
                      <div className="md:w-3/4 p-6">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            {event.featured && (
                              <span className="inline-block text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground mb-2">
                                Destaque
                              </span>
                            )}
                            <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
                            <p className="text-muted-foreground mb-4">{event.description}</p>

                            {/* Event Info */}
                            <div className="grid sm:grid-cols-2 gap-3 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4 text-primary" />
                                {new Date(event.date).toLocaleDateString('pt-BR', {
                                  weekday: 'long',
                                  day: 'numeric',
                                  month: 'long'
                                })}
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock className="h-4 w-4 text-primary" />
                                {event.time}
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="h-4 w-4 text-primary" />
                                {event.venue} • {event.city}/{event.state}
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Users className="h-4 w-4 text-primary" />
                                {event.artists.slice(0, 3).join(', ')}
                                {event.artists.length > 3 && ` +${event.artists.length - 3}`}
                              </div>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <span className="text-2xl font-bold text-primary">{event.price}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Agenda;
