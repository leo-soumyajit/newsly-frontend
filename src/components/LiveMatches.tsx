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

interface Match {
  id: string;
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

const popularTeams = [
  "India", "IND", "Pakistan", "PAK", "Australia", "AUS", "England", "ENG",
  "South Africa", "RSA", "New Zealand", "NZ", "West Indies", "WI",
  "Sri Lanka", "SL", "Bangladesh", "BAN", "Afghanistan", "AFG",
  "Mumbai Indians", "Chennai Super Kings", "Royal Challengers Bangalore",
  "Kolkata Knight Riders", "Delhi Capitals", "Punjab Kings",
  "Rajasthan Royals", "Sunrisers Hyderabad"
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
  return "🏏";
};

const isPopularMatch = (team1: string, team2: string): boolean => {
  const isTeam1Popular = popularTeams.some(team =>
    team1.toLowerCase().includes(team.toLowerCase()) || team.toLowerCase().includes(team1.toLowerCase())
  );
  const isTeam2Popular = popularTeams.some(team =>
    team2.toLowerCase().includes(team.toLowerCase()) || team.toLowerCase().includes(team2.toLowerCase())
  );
  return isTeam1Popular || isTeam2Popular;
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
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get('https://api.cricapi.com/v1/cricScore', {
          params: { apikey: '21f6cb46-1ca3-4536-afb7-d1290a224dc2' }
        });

        const cricketMatches: CricketMatch[] = response.data.data || [];

        // Map to Match[]
        const allMatches = cricketMatches.map((match): Match => ({
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

        // Filter matches by their status and popularity
        const popularLive = allMatches.filter(m => m.status === 'live' && isPopularMatch(m.team1, m.team2));
        const anyLive = allMatches.filter(m => m.status === 'live');
        const popularFinished = allMatches.filter(m => m.status === 'finished' && isPopularMatch(m.team1, m.team2));
        const popularUpcoming = allMatches.filter(m => m.status === 'upcoming' && isPopularMatch(m.team1, m.team2));
        const anyUpcoming = allMatches.filter(m => m.status === 'upcoming');

        // Determine which matches to show according to the priority
        let matchesToShow: Match[] = [];

        if (popularLive.length > 0) {
          matchesToShow = popularLive;
        } else if (anyLive.length > 0) {
          matchesToShow = anyLive;
        } else if (popularFinished.length > 0) {
          matchesToShow = popularFinished;
        } else if (popularUpcoming.length > 0) {
          matchesToShow = popularUpcoming;
        } else if (anyUpcoming.length > 0) {
          matchesToShow = anyUpcoming;
        } else {
          matchesToShow = allMatches;
        }

        // Prioritize India matches & show top 2 matches
        const sortedMatches = prioritizeIndiaMatches(matchesToShow).slice(0, 2);

        setMatches(sortedMatches);

      } catch (error) {
        console.error("Error fetching cricket matches:", error);
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();

    // Refresh every 30 seconds for updated live scores
    const interval = setInterval(fetchMatches, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-card rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Live Matches</h3>
          <Badge variant="secondary" className="bg-live/10 text-live border-live/20">
            ● Loading...
          </Badge>
        </div>
        <div className="space-y-3">
          <div className="border border-border rounded-lg p-3 animate-pulse">
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-6 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Live Matches</h3>
        <Badge variant="secondary" className="bg-live/10 text-live border-live/20">
          ● Cricket
        </Badge>
      </div>

      <div className="space-y-3">
        {matches.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">No matches available</div>
        ) : (
          matches.map((match) => (
            <div
              key={match.id}
              className="border border-border rounded-lg p-3 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground font-medium">{match.sport}</span>
                <Badge
                  variant={
                    match.status === "live"
                      ? "default"
                      : match.status === "finished"
                      ? "secondary"
                      : "outline"
                  }
                  className={match.status === "live" ? "bg-live text-white" : ""}
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
                      <img
                        src={match.t1img}
                        alt={match.team1}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-lg">{match.flag1}</span>
                    )}
                    <span className="font-medium text-sm">{match.team1}</span>
                  </div>
                  <span className="font-bold text-accent">{match.score1}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {match.t2img ? (
                      <img
                        src={match.t2img}
                        alt={match.team2}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-lg">{match.flag2}</span>
                    )}
                    <span className="font-medium text-sm">{match.team2}</span>
                  </div>
                  <span className="font-bold text-accent">{match.score2}</span>
                </div>
              </div>

              {match.winner && match.status === "finished" && (
                <div className="mt-2 pt-2 border-t border-border">
                  <div className="text-center">
                    <span className="text-xs text-muted-foreground">Winner: </span>
                    <span className="text-sm font-semibold text-primary">{match.winner}</span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
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
