import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";

interface CricketMatch {
  id: string;
  dateTimeGMT: string;
  matchType: string;
  status: string;
  ms: string;
  t1: string;
  t2: string;
  t1s: string;
  t2s: string;
  t1img?: string;
  t2img?: string;
  series: string;
}

interface FootballAPIResponseMatch {
  id: number;
  status: number; // 1 = live, 0 = not started, etc.
  status_name: string;
  status_period: string | null;
  teams: {
    home: {
      id: number;
      name: string;
      short_code: string;
      img: string;
    };
    away: {
      id: number;
      name: string;
      short_code: string;
      img: string;
    };
  };
  scores: {
    home_score: string;
    away_score: string;
    ht_score: string | null;
    ft_score: string | null;
    et_score: string | null;
    ps_score: string | null;
  };
  league: {
    id: number;
    name: string;
    country_id: string;
    country_name: string;
    country_code: string;
    country_flag: string;
  };
  time: {
    datetime: string;
    date: string;
    time: string;
    minute: string;
    timestamp: number;
    timezone: string;
  };
}

interface Match {
  id: string | number;
  team1: string;
  team2: string;
  score1: string;
  score2: string;
  status: "live" | "finished" | "upcoming";
  sport: string;
  flag1: string; // emoji fallback if no image
  flag2: string; // emoji fallback if no image
  t1img?: string;
  t2img?: string;
  winner?: string;
}

// Popular cricket teams as before
const popularCricketTeams = [
  "India", "IND", "Pakistan", "PAK", "Australia", "AUS", "England", "ENG",
  "South Africa", "RSA", "New Zealand", "NZ", "West Indies", "WI",
  "Sri Lanka", "SL", "Bangladesh", "BAN", "Afghanistan", "AFG",
  "Mumbai Indians", "Chennai Super Kings", "Royal Challengers Bangalore",
  "Kolkata Knight Riders", "Delhi Capitals", "Punjab Kings",
  "Rajasthan Royals", "Sunrisers Hyderabad"
];

// Popular football teams from earlier
const popularFootballTeams = [
  "Manchester United", "Man United", "Chelsea", "Liverpool", "Arsenal", "Manchester City",
  "Barcelona", "Real Madrid", "Paris Saint-Germain", "PSG", "Bayern Munich", "Juventus",
  "Inter Milan", "AC Milan", "Tottenham", "Atletico Madrid", "Ajax", "Borussia Dortmund",
  "Napoli", "Roma", "Leicester", "Porto", "Benfica", "Sevilla"
];

const teamEmojiFlags: { [key: string]: string } = {
  India: "🇮🇳", IND: "🇮🇳",
  Pakistan: "🇵🇰", PAK: "🇵🇰",
  Australia: "🇦🇺", AUS: "🇦🇺",
  England: "🏴", ENG: "🏴",
  "South Africa": "🇿🇦", RSA: "🇿🇦",
  "New Zealand": "🇳🇿", NZ: "🇳🇿",
  "West Indies": "🏴", WI: "🏴",
  "Sri Lanka": "🇱🇰", SL: "🇱🇰",
  Bangladesh: "🇧🇩", BAN: "🇧🇩",
  Afghanistan: "🇦🇫", AFG: "🇦🇫"
};

const getTeamEmojiFlag = (teamName: string): string => {
  for (const key in teamEmojiFlags) {
    if (teamName.includes(key)) {
      return teamEmojiFlags[key];
    }
  }
  return "🏟";
};

const isPopularCricketMatch = (team1: string, team2: string): boolean => {
  return popularCricketTeams.some(team =>
    team1.toLowerCase().includes(team.toLowerCase()) ||
    team2.toLowerCase().includes(team.toLowerCase())
  );
};

const isPopularFootballMatch = (team1: string, team2: string): boolean => {
  return popularFootballTeams.some(team =>
    team1?.toLowerCase().includes(team.toLowerCase()) ||
    team2?.toLowerCase().includes(team.toLowerCase())
  );
};

const prioritizeIndiaMatches = (matches: Match[]): Match[] => {
  return matches.sort((a, b) => {
    const aHasIndia = a.team1.toLowerCase().includes('india') || a.team2.toLowerCase().includes('india');
    const bHasIndia = b.team1.toLowerCase().includes('india') || b.team2.toLowerCase().includes('india');

    if (aHasIndia && !bHasIndia) return -1;
    if (!aHasIndia && bHasIndia) return 1;
    if (a.status === 'live' && b.status !== 'live') return -1;
    if (a.status !== 'live' && b.status === 'live') return 1;
    return 0;
  });
};

const getMatchStatus = (cricketMatch: CricketMatch): "live" | "finished" | "upcoming" => {
  const status = cricketMatch.status.toLowerCase();
  const ms = cricketMatch.ms.toLowerCase();
  const hasScore = cricketMatch.t1s || cricketMatch.t2s;
  if (status.includes('live') || ms === 'result' || hasScore) {
    const matchTime = new Date(cricketMatch.dateTimeGMT);
    const now = new Date();
    const hoursDiff = (now.getTime() - matchTime.getTime()) / (1000 * 60 * 60);
    if (hoursDiff <= 1 && hasScore) {
      return "finished";
    }
    if (hasScore) {
      return "live";
    }
  }
  return "upcoming";
};

const determineWinner = (t1s: string, t2s: string, team1: string, team2: string): string | undefined => {
  if (!t1s || !t2s) return undefined;
  const score1 = parseInt(t1s.split('/')[0] || '0', 10);
  const score2 = parseInt(t2s.split('/')[0] || '0', 10);
  if (score1 > score2) return team1;
  if (score2 > score1) return team2;
  return undefined;
};

export const LiveMatches = () => {
  const [cricketMatches, setCricketMatches] = useState<Match[]>([]);
  const [footballMatches, setFootballMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch football matches from SoccersAPI endpoint
  const fetchFootballMatches = async (): Promise<Match[]> => {
    const USERNAME = "banerjeesoumyajit2005";
    const TOKEN = "dfe05d176ad97f543bffd7fed65bde8d";
    const url = `https://api.soccersapi.com/v2.2/livescores/?user=${USERNAME}&token=${TOKEN}&t=today`;

    try {
      const res = await fetch(url);
      const json = await res.json();
      const raw: FootballAPIResponseMatch[] = json.data || [];

      // Map to Match[]
      return raw.map(m => ({
        id: m.id,
        team1: m.teams.home.name,
        team2: m.teams.away.name,
        score1: m.scores.home_score || "0",
        score2: m.scores.away_score || "0",
        status: m.status_name.toLowerCase() === "inplay"
          ? "live"
          : m.status_name.toLowerCase() === "notstarted"
          ? "upcoming" : "finished",
        sport: "Football",
        flag1: "",
        flag2: "",
        t1img: m.teams.home.img,
        t2img: m.teams.away.img,
        winner: undefined // not provided in API
      }));
    } catch (err) {
      console.error("Football API fetch error:", err);
      return [];
    }
  };

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        // Fetch cricket matches
        const cricketRes = await axios.get('https://api.cricapi.com/v1/cricScore', {
          params: { apikey: '21f6cb46-1ca3-4536-afb7-d1290a224dc2' }
        });
        const cricketData: CricketMatch[] = cricketRes.data.data || [];
        const mappedCricket = cricketData.map(match => ({
          id: match.id,
          team1: match.t1,
          team2: match.t2,
          score1: match.t1s || "0",
          score2: match.t2s || "0",
          status: getMatchStatus(match),
          sport: "Cricket",
          flag1: match.t1img ? "" : getTeamEmojiFlag(match.t1),
          flag2: match.t2img ? "" : getTeamEmojiFlag(match.t2),
          t1img: match.t1img,
          t2img: match.t2img,
          winner: (match.t1s && match.t2s) ? determineWinner(match.t1s, match.t2s, match.t1, match.t2) : undefined
        }));

        let cricketToShow =
          mappedCricket.filter(m => m.status === 'live' && isPopularCricketMatch(m.team1, m.team2));
        if (cricketToShow.length === 0) {
          cricketToShow = mappedCricket.filter(m => m.status === 'live');
        }
        if (cricketToShow.length === 0) {
          cricketToShow = mappedCricket;
        }
        cricketToShow = prioritizeIndiaMatches(cricketToShow).slice(0, 2);
        setCricketMatches(cricketToShow);

        // Fetch football matches
        const footballData = await fetchFootballMatches();
        let popularFootballLive = footballData.filter(m => isPopularFootballMatch(m.team1, m.team2) && m.status === 'live');
        if (popularFootballLive.length === 0) {
          popularFootballLive = footballData.filter(m => m.status === 'live');
        }
        if (popularFootballLive.length === 0) {
          // No live popular, show any finished popular matches
          popularFootballLive = footballData.filter(m => isPopularFootballMatch(m.team1, m.team2) && m.status === 'finished');
        }
        if (popularFootballLive.length === 0) {
          // Otherwise show any matches finished or upcoming
          popularFootballLive = footballData.filter(m => m.status !== 'live');
        }
        setFootballMatches(popularFootballLive.slice(0, 2));

      } catch (err) {
        console.error(err);
        setCricketMatches([]);
        setFootballMatches([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
    const interval = setInterval(fetchMatches, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-card rounded-lg p-4 shadow-sm">
        <h3 className="font-semibold text-foreground mb-4">Live Matches</h3>
        <div className="space-y-3">
          <div className="border border-border rounded-lg p-3 animate-pulse">
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-6 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const renderMatch = (match: Match) => (
    <div key={match.id} className="border border-border rounded-lg p-3 hover:bg-muted/50 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground font-medium">{match.sport}</span>
        <Badge
          variant="default"
          className={
            match.status === "live"
              ? (match.sport === "Football" ? "bg-blue-600 text-white" : "bg-live text-white")
              : match.status === "finished"
              ? "secondary"
              : "outline"
          }
        >
          {match.status === "live"
            ? "LIVE"
            : match.status === "finished"
            ? "FINISHED"
            : "UPCOMING"}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {match.t1img ? (
              <img src={match.t1img} alt={match.team1} className="w-6 h-6 rounded-full object-cover" />
            ) : (
              <span className="text-lg">{match.flag1}</span>
            )}
            <span className="font-medium text-sm">{match.team1}</span>
          </div>
          <span className={`font-bold ${match.sport === "Football" ? "text-blue-600" : "text-accent"}`}>{match.score1}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {match.t2img ? (
              <img src={match.t2img} alt={match.team2} className="w-6 h-6 rounded-full object-cover" />
            ) : (
              <span className="text-lg">{match.flag2}</span>
            )}
            <span className="font-medium text-sm">{match.team2}</span>
          </div>
          <span className={`font-bold ${match.sport === "Football" ? "text-blue-600" : "text-accent"}`}>{match.score2}</span>
        </div>
      </div>

      {match.winner && match.status === "finished" && (
        <div className="mt-2 pt-2 border-t border-border text-center">
          <span className="text-xs text-muted-foreground">Winner: </span>
          <span className="text-sm font-semibold text-primary">{match.winner}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm space-y-10">
      {/* Cricket Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Live Cricket</h3>
          <Badge variant="secondary" className="bg-live/10 text-live border-live/20">
            ● Cricket
          </Badge>
        </div>
        <div className="space-y-3">
          {cricketMatches.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">No matches available</div>
          ) : (
            cricketMatches.map(renderMatch)
          )}
        </div>
      </div>

      {/* Football Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Live Football</h3>
          <Badge variant="secondary" className="bg-blue-600/10 text-blue-600 border-blue-600/20">
            ● Football
          </Badge>
        </div>
        <div className="space-y-3">
          {footballMatches.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">No matches available</div>
          ) : (
            footballMatches.map(renderMatch)
          )}
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full mt-4 text-accent border-accent hover:bg-accent hover:text-accent-foreground"
      >
        More Matches
      </Button>
    </div>
  );
};
