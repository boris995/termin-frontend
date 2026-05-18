export interface Season {
  id: number;
  number: number;
  name: string;
  winsToWinSeason: number;
  status: 'active' | 'completed' | 'archived';
  winnerTeamId?: number | null;
  winnerTeam?: Team | null;
}

export interface Team {
  id: number;
  name: string;
  shortName: string;
  primaryColor?: string;
  seasonId: number;
  wins?: number;
  losses?: number;
}

export interface Player {
  id: number;
  firstName: string;
  lastName: string;
  nickname?: string;
  position: 'golman' | 'igrac' | 'golman-igrac';
  shirtNumber: number;
  cardImageUrl?: string | null;
  galleryImages?: string[];
  pac: number;
  sho: number;
  pas: number;
  dri: number;
  def: number;
  phy: number;
  overallRating: number;
  goals: number;
  assists: number;
  teamId: number;
  seasonId: number;
  team?: Team;
}

export interface Match {
  id: number;
  matchNumber: number;
  homeScore: number;
  awayScore: number;
  playedAt: string;
  homeTeam: Team;
  awayTeam: Team;
  winnerTeam: Team;
  playerStats?: Array<{ player: Player; team: Team; goals: number; assists: number }>;
}

export interface CmsBlock {
  id: number;
  title: string;
  body: string;
  type: 'text' | 'news' | 'announcement';
  imageUrl?: string | null;
  sortOrder: number;
  isPublished: boolean;
}

export interface NextMatch {
  id: number;
  seasonId: number;
  homeTeamId: number;
  awayTeamId: number;
  scheduledAt: string;
  venue?: string | null;
  note?: string | null;
  status: 'scheduled' | 'cancelled';
  homeTeam: Team;
  awayTeam: Team;
  season?: Season;
}

export interface DashboardData {
  season: Season;
  teams: Team[];
  topScorers: Player[];
  topAssists: Player[];
  totalMatchesPlayed: number;
}

export interface HomeData {
  season: Season | null;
  lastMatch: Match | null;
  nextMatch: NextMatch | null;
  contentBlocks: CmsBlock[];
}
