import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { api, unwrap } from '../api/client';
import { Button, Input, PageTitle, Panel } from '../components/ui';
import { Season } from '../types';

export const Seasons = () => {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const { register, handleSubmit, reset } = useForm({ defaultValues: { number: 2, name: 'Sezona 2', winsToWinSeason: 10 } });
  const load = async () => setSeasons(unwrap<Season[]>(await api.get('/seasons')));

  useEffect(() => {
    load().catch(() => undefined);
  }, []);

  const onSubmit = async (values: any) => {
    await api.post('/seasons', { ...values, number: Number(values.number), winsToWinSeason: Number(values.winsToWinSeason) });
    reset();
    await load();
  };

  return (
    <>
      <PageTitle eyebrow="Arhiva" title="Sezone" />
      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="grid gap-4 md:grid-cols-2">
          {seasons.map((season) => (
            <Panel key={season.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-300">Race to {season.winsToWinSeason}</p>
                  <h3 className="mt-2 text-2xl font-black">{season.name}</h3>
                  <p className="mt-2 text-sm text-slate-400">Status: {season.status}</p>
                </div>
                <span className="rounded bg-white/10 px-3 py-1 text-xs font-black">#{season.number}</span>
              </div>
              <div className="mt-5 flex gap-2">
                <Link className="rounded bg-white/10 px-3 py-2 text-sm font-bold hover:bg-white/15" to={`/seasons/${season.id}/teams`}>Timovi</Link>
                <Link className="rounded bg-white/10 px-3 py-2 text-sm font-bold hover:bg-white/15" to={`/seasons/${season.id}/players`}>Igrači</Link>
                <Link className="rounded bg-white/10 px-3 py-2 text-sm font-bold hover:bg-white/15" to={`/seasons/${season.id}/matches`}>Mečevi</Link>
              </div>
            </Panel>
          ))}
        </div>
        <Panel>
          <h3 className="mb-4 text-lg font-black">Nova sezona</h3>
          <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
            <Input type="number" placeholder="Broj" {...register('number', { required: true })} />
            <Input placeholder="Naziv" {...register('name', { required: true })} />
            <Input type="number" min={1} placeholder="Cilj pobjeda" {...register('winsToWinSeason', { required: true })} />
            <Button type="submit" className="w-full">
              <Plus size={18} />
              Kreiraj
            </Button>
          </form>
        </Panel>
      </div>
    </>
  );
};
