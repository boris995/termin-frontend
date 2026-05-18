import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { api, unwrap } from '../api/client';
import { Button, Input, PageTitle, Panel } from '../components/ui';
import { Team } from '../types';

export const Teams = () => {
  const { id = '1' } = useParams();
  const [teams, setTeams] = useState<Team[]>([]);
  const [error, setError] = useState('');
  const { register, handleSubmit, reset } = useForm({ defaultValues: { name: '', shortName: '', primaryColor: '#F97316' } });
  const load = async () => setTeams(unwrap<Team[]>(await api.get(`/seasons/${id}/teams`)));

  useEffect(() => {
    load().catch(() => undefined);
  }, [id]);

  const onSubmit = async (values: any) => {
    try {
      await api.post(`/seasons/${id}/teams`, values);
      reset();
      setError('');
      await load();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ekipa nije kreirana.');
    }
  };

  return (
    <>
      <PageTitle eyebrow="Duel liga" title="Upravljanje ekipama" />
      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="grid gap-4 md:grid-cols-2">
          {teams.map((team) => (
            <Panel key={team.id}>
              <div className="mb-4 h-2 rounded" style={{ backgroundColor: team.primaryColor || '#F97316' }} />
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-slate-400">{team.shortName}</p>
              <h3 className="mt-2 text-3xl font-black">{team.name}</h3>
            </Panel>
          ))}
        </div>
        <Panel>
          <h3 className="mb-4 text-lg font-black">Dodaj ekipu</h3>
          <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
            <Input placeholder="Naziv ekipe" {...register('name', { required: true })} />
            <Input maxLength={4} placeholder="Kratki naziv" {...register('shortName', { required: true })} />
            <Input type="color" {...register('primaryColor')} />
            {error && <p className="rounded border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p>}
            <Button disabled={teams.length >= 2} type="submit" className="w-full">
              <Plus size={18} />
              Dodaj
            </Button>
          </form>
        </Panel>
      </div>
    </>
  );
};
