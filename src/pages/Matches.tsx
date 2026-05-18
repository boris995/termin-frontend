import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api, unwrap } from '../api/client';
import { PageTitle, Panel } from '../components/ui';
import { Match } from '../types';

export const Matches = () => {
  const { id = '1' } = useParams();
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    api.get(`/seasons/${id}/matches`).then(unwrap<Match[]>).then(setMatches).catch(() => undefined);
  }, [id]);

  return (
    <>
      <PageTitle eyebrow="Match log" title="Odigrani mečevi" />
      <div className="space-y-4">
        {matches.map((match) => (
          <Panel key={match.id}>
            <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Meč #{match.matchNumber}</p>
                <h3 className="mt-1 text-xl font-black">{match.homeTeam.name}</h3>
              </div>
              <div className="rounded border border-white/10 bg-slate-950 px-6 py-3 text-center text-3xl font-black">
                {match.homeScore} : {match.awayScore}
              </div>
              <div className="md:text-right">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-300">Pobjednik: {match.winnerTeam.shortName}</p>
                <h3 className="mt-1 text-xl font-black">{match.awayTeam.name}</h3>
              </div>
            </div>
            {!!match.playerStats?.length && (
              <div className="mt-4 grid gap-2 border-t border-white/10 pt-4 md:grid-cols-2">
                {match.playerStats.map((stat, index) => (
                  <p key={`${match.id}-${index}`} className="text-sm text-slate-300">
                    <span className="font-bold text-white">{stat.player.firstName} {stat.player.lastName}</span>
                    {' '}({stat.team.shortName}) - {stat.goals}G / {stat.assists}A
                  </p>
                ))}
              </div>
            )}
          </Panel>
        ))}
      </div>
    </>
  );
};
