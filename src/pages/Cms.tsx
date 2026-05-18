import { CalendarPlus, FilePlus, Pencil, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { api, unwrap } from '../api/client';
import { Button, Input, PageTitle, Panel, Select } from '../components/ui';
import { CmsBlock, NextMatch, Team } from '../types';

interface BlockForm {
  title: string;
  body: string;
  type: 'text' | 'news' | 'announcement';
  imageUrl?: string;
  sortOrder: number;
}

interface NextMatchForm {
  seasonId: number;
  homeTeamId: number;
  awayTeamId: number;
  scheduledAt: string;
  venue?: string;
  note?: string;
}

export const Cms = () => {
  const [blocks, setBlocks] = useState<CmsBlock[]>([]);
  const [nextMatches, setNextMatches] = useState<NextMatch[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [editingBlock, setEditingBlock] = useState<CmsBlock | null>(null);
  const [error, setError] = useState('');
  const blockForm = useForm<BlockForm>({ defaultValues: { title: '', body: '', type: 'news', imageUrl: '', sortOrder: 0 } });
  const nextForm = useForm<NextMatchForm>({ defaultValues: { seasonId: 1, homeTeamId: 0, awayTeamId: 0, scheduledAt: '', venue: '', note: '' } });

  const load = async () => {
    const [cmsBlocks, scheduled, seasonTeams] = await Promise.all([
      api.get('/cms/blocks').then(unwrap<CmsBlock[]>),
      api.get('/cms/next-matches').then(unwrap<NextMatch[]>),
      api.get('/seasons/1/teams').then(unwrap<Team[]>)
    ]);
    setBlocks(cmsBlocks);
    setNextMatches(scheduled);
    setTeams(seasonTeams);
  };

  useEffect(() => {
    load().catch(() => setError('CMS podaci nisu dostupni. Provjeri backend i seed.'));
  }, []);

  const submitBlock = async (values: BlockForm) => {
    const payload = { ...values, sortOrder: Number(values.sortOrder), isPublished: true };
    if (editingBlock) {
      await api.put(`/cms/blocks/${editingBlock.id}`, payload);
      setEditingBlock(null);
    } else {
      await api.post('/cms/blocks', payload);
    }
    blockForm.reset({ title: '', body: '', type: 'news', imageUrl: '', sortOrder: 0 });
    await load();
  };

  const startEditBlock = (block: CmsBlock) => {
    setEditingBlock(block);
    blockForm.reset({
      title: block.title,
      body: block.body,
      type: block.type,
      imageUrl: block.imageUrl || '',
      sortOrder: block.sortOrder
    });
  };

  const deleteBlock = async (block: CmsBlock) => {
    const confirmed = window.confirm(`Obrisati CMS blok "${block.title}"?`);
    if (!confirmed) return;
    await api.delete(`/cms/blocks/${block.id}`);
    await load();
  };

  const createNextMatch = async (values: NextMatchForm) => {
    const homeTeamId = Number(values.homeTeamId || teams[0]?.id);
    const awayTeamId = Number(values.awayTeamId || teams.find((team) => team.id !== homeTeamId)?.id);
    await api.post('/cms/next-matches', {
      ...values,
      seasonId: Number(values.seasonId || 1),
      homeTeamId,
      awayTeamId,
      scheduledAt: new Date(values.scheduledAt).toISOString()
    });
    nextForm.reset();
    await load();
  };

  const cancelNextMatch = async (match: NextMatch) => {
    await api.put(`/cms/next-matches/${match.id}`, { status: 'cancelled' });
    await load();
  };

  return (
    <>
      <PageTitle eyebrow="Content management" title="CMS sadrzaj za home page" />
      {error && <Panel className="mb-5 text-red-200">{error}</Panel>}
      <div className="grid gap-5 xl:grid-cols-2">
        <Panel>
          <h3 className="mb-4 text-lg font-black">{editingBlock ? 'Uredi sadrzaj' : 'Dodaj sadrzaj'}</h3>
          <form className="space-y-3" onSubmit={blockForm.handleSubmit(submitBlock)}>
            <Input placeholder="Naslov" {...blockForm.register('title', { required: true })} />
            <Select {...blockForm.register('type')}>
              <option value="news">Novost</option>
              <option value="announcement">Obavjestenje</option>
              <option value="text">Tekst</option>
            </Select>
            <Input placeholder="URL slike opcionalno" {...blockForm.register('imageUrl')} />
            <Input type="number" placeholder="Redoslijed" {...blockForm.register('sortOrder', { valueAsNumber: true })} />
            <textarea
              className="min-h-36 w-full rounded border border-white/10 bg-blue-950/80 px-3 py-2 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-orange-400"
              placeholder="Sadrzaj"
              {...blockForm.register('body', { required: true })}
            />
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                <FilePlus size={18} />
                {editingBlock ? 'Sacuvaj izmjene' : 'Objavi blok'}
              </Button>
              {editingBlock && (
                <button
                  type="button"
                  className="rounded border border-white/10 px-4 py-2 text-sm font-bold text-slate-200 hover:bg-white/10"
                  onClick={() => {
                    setEditingBlock(null);
                    blockForm.reset({ title: '', body: '', type: 'news', imageUrl: '', sortOrder: 0 });
                  }}
                >
                  Otkaži
                </button>
              )}
            </div>
          </form>
        </Panel>

        <Panel>
          <h3 className="mb-4 text-lg font-black">Najavi sljedecu utakmicu</h3>
          <form className="space-y-3" onSubmit={nextForm.handleSubmit(createNextMatch)}>
            <Input type="number" min={1} placeholder="Season ID" {...nextForm.register('seasonId', { valueAsNumber: true })} />
            <Select {...nextForm.register('homeTeamId', { valueAsNumber: true })}>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </Select>
            <Select {...nextForm.register('awayTeamId', { valueAsNumber: true })}>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </Select>
            <Input type="datetime-local" {...nextForm.register('scheduledAt', { required: true })} />
            <Input placeholder="Lokacija" {...nextForm.register('venue')} />
            <textarea
              className="min-h-24 w-full rounded border border-white/10 bg-blue-950/80 px-3 py-2 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-orange-400"
              placeholder="Napomena"
              {...nextForm.register('note')}
            />
            <Button type="submit" className="w-full">
              <CalendarPlus size={18} />
              Sacuvaj najavu
            </Button>
          </form>
        </Panel>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Panel>
          <h3 className="mb-4 text-lg font-black">Objavljeni blokovi</h3>
          <div className="space-y-3">
            {blocks.map((block) => (
              <div key={block.id} className="rounded border border-white/10 bg-blue-950/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-300">{block.type}</p>
                    <h4 className="mt-1 font-black">{block.title}</h4>
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded bg-white/10 p-2 hover:bg-white/15" onClick={() => startEditBlock(block)} title="Uredi">
                      <Pencil size={16} />
                    </button>
                    <button className="rounded bg-red-500/80 p-2 hover:bg-red-500" onClick={() => deleteBlock(block)} title="Obrisi">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-slate-400">{block.body}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <h3 className="mb-4 text-lg font-black">Najave utakmica</h3>
          <div className="space-y-3">
            {nextMatches.map((match) => (
              <div key={match.id} className="rounded border border-white/10 bg-blue-950/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-black">{match.homeTeam?.shortName} vs {match.awayTeam?.shortName}</h4>
                    <p className="mt-2 text-sm text-slate-400">{new Date(match.scheduledAt).toLocaleString('bs-BA')}</p>
                    {match.venue && <p className="text-sm text-slate-400">{match.venue}</p>}
                    <p className="mt-1 text-xs uppercase tracking-widest text-orange-300">{match.status}</p>
                  </div>
                  {match.status !== 'cancelled' && (
                    <button className="rounded bg-white/10 px-3 py-2 text-xs font-bold hover:bg-white/15" onClick={() => cancelNextMatch(match)}>
                      Otkazi
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
};
