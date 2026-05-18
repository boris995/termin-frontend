import { ArrowLeft, Trophy } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, unwrap } from '../api/client';
import { Panel } from '../components/ui';
import { fallbackMatches } from '../data/fallback';
import { Match } from '../types';
import { setSeo } from '../utils/seo';

const formatDate = (value: string) => new Intl.DateTimeFormat('bs-BA', { dateStyle: 'full', timeStyle: 'short' }).format(new Date(value));

export const PublicMatchDetail = () => {
  const { id = '1' } = useParams();
  const fallback = useMemo(() => fallbackMatches.find((match) => match.id === Number(id)) || fallbackMatches[0], [id]);
  const [match, setMatch] = useState<Match>(fallback);

  useEffect(() => {
    setSeo(`Mec #${fallback.matchNumber} | Football Face-Off`, 'Detalji utakmice, rezultat i statistika igraca.');
    api.get(`/matches/${id}`).then(unwrap<Match>).then(setMatch).catch(() => setMatch(fallback));
  }, [fallback, id]);

  return (
    <main className="px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link to="/rezultati" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-orange-300 hover:text-orange-200">
          <ArrowLeft size={17} />
          Nazad na rezultate
        </Link>
        <Panel className="p-6">
          <div className="mb-6 flex items-center gap-3 text-orange-300">
            <Trophy size={24} />
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em]">Mec #{match.matchNumber}</p>
              <p className="text-sm text-slate-400">{formatDate(match.playedAt)}</p>
            </div>
          </div>
          <div className="grid items-center gap-5 md:grid-cols-[1fr_auto_1fr]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{match.homeTeam.shortName}</p>
              <h1 className="mt-2 text-4xl font-black">{match.homeTeam.name}</h1>
            </div>
            <div className="rounded bg-orange-500 px-8 py-5 text-center text-6xl font-black text-blue-950">
              {match.homeScore}:{match.awayScore}
            </div>
            <div className="md:text-right">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{match.awayTeam.shortName}</p>
              <h1 className="mt-2 text-4xl font-black">{match.awayTeam.name}</h1>
            </div>
          </div>
          <p className="mt-6 text-center text-sm text-slate-300">
            Pobjednik: <span className="font-black text-white">{match.winnerTeam.name}</span>
          </p>
        </Panel>

        <Panel className="mt-5">
          <h2 className="mb-4 text-xl font-black">Statistika igraca</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {match.playerStats?.map((stat, index) => (
              <div key={`${stat.player.id}-${index}`} className="rounded border border-white/10 bg-blue-950/70 p-4">
                <p className="font-black">{stat.player.firstName} {stat.player.lastName}</p>
                <p className="text-sm text-slate-400">{stat.team.shortName}</p>
                <p className="mt-2 text-sm text-orange-300">{stat.goals}G / {stat.assists}A</p>
              </div>
            ))}
            {!match.playerStats?.length && <p className="text-slate-400">Nema unesene individualne statistike za ovaj mec.</p>}
          </div>
        </Panel>
      </div>
    </main>
  );
};
