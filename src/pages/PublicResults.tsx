import { ListOrdered } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, unwrap } from '../api/client';
import { PageTitle, Panel } from '../components/ui';
import { SeasonSelector } from '../components/SeasonSelector';
import { fallbackMatches } from '../data/fallback';
import { Match } from '../types';
import { setSeo } from '../utils/seo';

const formatDate = (value: string) => new Intl.DateTimeFormat('bs-BA', { dateStyle: 'medium' }).format(new Date(value));

export const PublicResults = () => {
  const [matches, setMatches] = useState<Match[]>(fallbackMatches);
  const [teamFilter, setTeamFilter] = useState('all');
  const [seasonId, setSeasonId] = useState(1);

  useEffect(() => {
    setSeo('Rezultati | Football Face-Off', 'Svi odigrani mecevi, pobjednici i rezultat po sezonama.');
    api.get(`/seasons/${seasonId}/matches`).then(unwrap<Match[]>).then((items) => setMatches(items.length ? items : fallbackMatches)).catch(() => undefined);
  }, [seasonId]);

  const teams = Array.from(new Map(matches.flatMap((match) => [match.homeTeam, match.awayTeam]).map((team) => [team.id, team])).values());
  const filteredMatches = matches.filter((match) => teamFilter === 'all' || String(match.homeTeam.id) === teamFilter || String(match.awayTeam.id) === teamFilter);

  return (
    <main className="px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <PageTitle eyebrow="Rezultati" title="Svi odigrani mecevi" />
        <Panel>
          <div className="mb-5">
            <div className="flex flex-wrap gap-3">
              <SeasonSelector value={seasonId} onChange={setSeasonId} />
              <select className="rounded border border-white/10 bg-blue-950/80 px-3 py-2 text-sm text-white outline-none focus:border-orange-400" value={teamFilter} onChange={(event) => setTeamFilter(event.target.value)}>
                <option value="all">Sve ekipe</option>
                {teams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}
              </select>
            </div>
          </div>
          <div className="mb-5 flex items-center gap-3 text-orange-300">
            <ListOrdered size={22} />
            <h2 className="text-xl font-black text-white">Match log</h2>
          </div>
          <div className="space-y-4">
            {filteredMatches.map((match) => (
              <Link key={match.id} to={`/rezultati/${match.id}`} className="grid gap-4 rounded border border-white/10 bg-blue-950/70 p-4 transition hover:border-orange-300/50 md:grid-cols-[1fr_auto_1fr_auto] md:items-center">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Mec #{match.matchNumber}</p>
                  <h3 className="mt-1 text-xl font-black">{match.homeTeam.name}</h3>
                </div>
                <div className="rounded bg-white/10 px-5 py-3 text-center text-3xl font-black">
                  {match.homeScore}:{match.awayScore}
                </div>
                <div className="md:text-right">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-300">Pobjednik: {match.winnerTeam.shortName}</p>
                  <h3 className="mt-1 text-xl font-black">{match.awayTeam.name}</h3>
                </div>
                <p className="text-sm text-slate-400 md:text-right">{formatDate(match.playedAt)}</p>
              </Link>
            ))}
          </div>
        </Panel>
      </div>
    </main>
  );
};

