import { CalendarClock, ChevronRight, Newspaper, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, unwrap } from '../api/client';
import { Panel } from '../components/ui';
import { fallbackHome } from '../data/fallback';
import { HomeData } from '../types';
import { setSeo } from '../utils/seo';

const formatDate = (value?: string) => {
  if (!value) return '-';
  return new Intl.DateTimeFormat('bs-BA', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
};

export const Home = () => {
  const [data, setData] = useState<HomeData>(fallbackHome);
  const [usingFallback, setUsingFallback] = useState(true);

  useEffect(() => {
    setSeo('Football Face-Off | Pocetna', 'Duel Liga rezultati, najave utakmica i novosti.');
    api
      .get('/home')
      .then(unwrap<HomeData>)
      .then((homeData) => {
        const hasAnyContent = homeData.lastMatch || homeData.nextMatch || homeData.contentBlocks.length > 0;
        if (hasAnyContent) {
          setData({
            ...fallbackHome,
            ...homeData,
            season: homeData.season || fallbackHome.season,
            contentBlocks: homeData.contentBlocks.length ? homeData.contentBlocks : fallbackHome.contentBlocks
          });
          setUsingFallback(false);
        }
      })
      .catch(() => setUsingFallback(true));
  }, []);

  const last = data.lastMatch;
  const next = data.nextMatch;

  return (
    <main className="px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="relative mb-8 overflow-hidden rounded-lg border border-white/10 bg-blue-950/70 px-5 py-8 shadow-2xl shadow-black/30 md:px-8 lg:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_25%,rgba(249,115,22,0.30),transparent_30rem)]" />
          <div className="absolute bottom-0 right-0 h-56 w-56 translate-x-16 translate-y-16 rounded-full border border-orange-300/20" />
          <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-orange-300">Football Face-Off</p>
              <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight text-white md:text-6xl">
                Duel Liga u kojoj svaki mec direktno mijenja trku za titulu.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
                {data.season?.name || 'Duel Liga'} se igra do {data.season?.winsToWinSeason || 8} pobjeda. Nema remija, nema kalkulacija, samo direktan obračun ekipa i statistika koja se prati iz kola u kolo.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link className="inline-flex items-center gap-2 rounded bg-orange-500 px-5 py-3 text-sm font-black text-blue-950 transition hover:bg-orange-400" to="/rezultati">
                  Pogledaj rezultate
                  <ChevronRight size={18} />
                </Link>
                <Link className="inline-flex items-center gap-2 rounded border border-white/15 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/15" to="/najava">
                  Najava utakmice
                </Link>
              </div>
              {usingFallback && <p className="mt-4 text-sm text-slate-400">Pocetni primjer sadrzaja. CMS podaci ce se prikazati cim backend bude spreman.</p>}
            </div>

            <div className="rounded-lg border border-white/10 bg-slate-950/55 p-5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-300">Prosli mec</p>
              {last && (
                <>
                  <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                    <div>
                      <p className="text-xs font-bold text-slate-400">{last.homeTeam.shortName}</p>
                      <h2 className="mt-1 text-2xl font-black">{last.homeTeam.name}</h2>
                    </div>
                    <div className="rounded bg-orange-500 px-4 py-3 text-4xl font-black text-blue-950">
                      {last.homeScore}:{last.awayScore}
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-400">{last.awayTeam.shortName}</p>
                      <h2 className="mt-1 text-2xl font-black">{last.awayTeam.name}</h2>
                    </div>
                  </div>
                  <p className="mt-5 text-sm text-slate-300">
                    Pobjednik: <span className="font-black text-white">{last.winnerTeam.name}</span>
                  </p>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <Panel className="p-6">
            <div className="mb-5 flex items-center gap-3 text-orange-300">
              <Trophy size={22} />
              <p className="text-sm font-black uppercase tracking-[0.18em]">Rezultat prosle utakmice</p>
            </div>
            {last ? (
              <>
                <div className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">{last.homeTeam.shortName}</p>
                    <h2 className="mt-2 text-3xl font-black">{last.homeTeam.name}</h2>
                  </div>
                  <div className="rounded border border-white/10 bg-blue-950 px-6 py-4 text-center text-5xl font-black">
                    {last.homeScore}:{last.awayScore}
                  </div>
                  <div className="md:text-right">
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">{last.awayTeam.shortName}</p>
                    <h2 className="mt-2 text-3xl font-black">{last.awayTeam.name}</h2>
                  </div>
                </div>
                <p className="mt-5 text-sm text-slate-300">
                  Pobjednik: <span className="font-black text-white">{last.winnerTeam.name}</span>
                </p>
              </>
            ) : (
              <p className="text-slate-300">Jos nema unesene prethodne utakmice.</p>
            )}
          </Panel>

          <Panel className="p-6">
            <div className="mb-5 flex items-center gap-3 text-orange-300">
              <CalendarClock size={22} />
              <p className="text-sm font-black uppercase tracking-[0.18em]">Najava sljedece utakmice</p>
            </div>
            {next ? (
              <>
                <div className="rounded border border-white/10 bg-blue-950/70 p-5">
                  <p className="text-sm font-bold text-orange-300">{formatDate(next.scheduledAt)}</p>
                  <h2 className="mt-3 text-3xl font-black">
                    {next.homeTeam.name} vs {next.awayTeam.name}
                  </h2>
                  {next.venue && <p className="mt-3 text-sm text-slate-300">Lokacija: {next.venue}</p>}
                </div>
                {next.note && <p className="mt-4 text-slate-300">{next.note}</p>}
              </>
            ) : (
              <p className="text-slate-300">Sljedeca utakmica jos nije najavljena.</p>
            )}
          </Panel>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center gap-3">
            <Newspaper className="text-orange-300" size={22} />
            <h2 className="text-2xl font-black">Novosti i sadrzaj</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {data.contentBlocks.map((block) => (
              <Panel key={block.id}>
                {block.imageUrl && <img className="mb-4 aspect-video w-full rounded object-cover" src={block.imageUrl} alt={block.title} />}
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-300">{block.type}</p>
                <h3 className="mt-2 text-2xl font-black">{block.title}</h3>
                <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-300">{block.body}</p>
              </Panel>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};
