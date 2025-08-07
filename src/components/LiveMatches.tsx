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
  flag1: string;
  flag2: string;
  winner?: string;
}

// Popular cricket teams to prioritize
const popularTeams = [
  "India", "IND", "Pakistan", "PAK", "Australia", "AUS", "England", "ENG", 
  "South Africa", "RSA", "New Zealand", "NZ", "West Indies", "WI", 
  "Sri Lanka", "SL", "Bangladesh", "BAN", "Afghanistan", "AFG",
  // IPL teams
  "Mumbai Indians", "Chennai Super Kings", "Royal Challengers Bangalore",
  "Kolkata Knight Riders", "Delhi Capitals", "Punjab Kings",
  "Rajasthan Royals", "Sunrisers Hyderabad"
];

const getTeamFlag = (teamName: string): string => {
  const flags: { [key: string]: string } = {
    "India": "🇮🇳", "IND": "🇮🇳",
    "Pakistan": "🇵🇰", "PAK": "🇵🇰", 
    "Australia": "🇦🇺", "AUS": "🇦🇺",
    "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "ENG": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "South Africa": "🇿🇦", "RSA": "🇿🇦",
    "New Zealand": "🇳🇿", "NZ": "🇳🇿",
    "West Indies": "🏴󠁧󠁢󠁷󠁬󠁳󠁿", "WI": "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
    "Sri Lanka": "🇱🇰", "SL": "🇱🇰",
    "Bangladesh": "🇧🇩", "BAN": "🇧🇩",
    "Afghanistan": "🇦🇫", "AFG": "🇦🇫"
  };
  
  // Check for exact match or partial match
  for (const [key, flag] of Object.entries(flags)) {
    if (teamName.includes(key)) return flag;
  }
  return "🏏"; // Default cricket emoji
};

const isPopularMatch = (team1: string, team2: string): boolean => {
  const isTeam1Popular = popularTeams.some(team => 
    team1.toLowerCase().includes(team.toLowerCase()) || 
    team.toLowerCase().includes(team1.toLowerCase())
  );
  const isTeam2Popular = popularTeams.some(team => 
    team2.toLowerCase().includes(team.toLowerCase()) || 
    team.toLowerCase().includes(team2.toLowerCase())
  );
  
  return isTeam1Popular || isTeam2Popular;
};

const prioritizeIndiaMatches = (matches: Match[]): Match[] => {
  return matches.sort((a, b) => {
    const aHasIndia = a.team1.toLowerCase().includes('india') || a.team2.toLowerCase().includes('india');
    const bHasIndia = b.team1.toLowerCase().includes('india') || b.team2.toLowerCase().includes('india');
    
    if (aHasIndia && !bHasIndia) return -1;
    if (!aHasIndia && bHasIndia) return 1;
    
    // Then prioritize live matches
    if (a.status === 'live' && b.status !== 'live') return -1;
    if (a.status !== 'live' && b.status === 'live') return 1;
    
    return 0;
  });
};

const getMatchStatus = (cricketMatch: CricketMatch): "live" | "finished" | "upcoming" => {
  const status = cricketMatch.status.toLowerCase();
  const ms = cricketMatch.ms.toLowerCase();
  
  if (status.includes('live') || ms === 'result' || cricketMatch.t1s || cricketMatch.t2s) {
    // Check if match ended recently (within 1 hour)
    const matchTime = new Date(cricketMatch.dateTimeGMT);
    const now = new Date();
    const hoursDiff = (now.getTime() - matchTime.getTime()) / (1000 * 60 * 60);
    
    if (hoursDiff <= 1 && (cricketMatch.t1s || cricketMatch.t2s)) {
      return "finished";
    }
    
    if (cricketMatch.t1s || cricketMatch.t2s) {
      return "live";
    }
  }
  
  return "upcoming";
};

const determineWinner = (t1s: string, t2s: string, team1: string, team2: string): string | undefined => {
  if (!t1s || !t2s) return undefined;
  
  // Simple score comparison for demonstration
  const score1 = parseInt(t1s.split('/')[0] || '0');
  const score2 = parseInt(t2s.split('/')[0] || '0');
  
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
          params: {
            apikey: '21f6cb46-1ca3-4536-afb7-d1290a224dc2'
          }
        });

        const cricketMatches: CricketMatch[] = response.data.data || [];
        
        // Filter for popular matches and convert format
        const popularMatches = cricketMatches
          .filter(match => isPopularMatch(match.t1, match.t2))
          .map((match): Match => ({
            id: match.id,
            team1: match.t1,
            team2: match.t2,
            score1: match.t1s || "0",
            score2: match.t2s || "0",
            status: getMatchStatus(match),
            sport: "Cricket",
            flag1: getTeamFlag(match.t1),
            flag2: getTeamFlag(match.t2),
            winner: match.t1s && match.t2s ? determineWinner(match.t1s, match.t2s, match.t1, match.t2) : undefined
          }));

        // Prioritize India matches and get top 2
        const sortedMatches = prioritizeIndiaMatches(popularMatches).slice(0, 2);
        setMatches(sortedMatches);
      } catch (error) {
        console.error('Error fetching cricket matches:', error);
        // Fallback to show at least something
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
    
    // Refresh every 30 seconds for live updates
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
          <div className="text-center py-4 text-muted-foreground">
            No popular matches available
          </div>
        ) : (
          matches.map((match) => (
            <div key={match.id} className="border border-border rounded-lg p-3 hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground font-medium">{match.sport}</span>
                <Badge 
                  variant={match.status === "live" ? "default" : match.status === "finished" ? "secondary" : "outline"}
                  className={match.status === "live" ? "bg-live text-white" : ""}
                >
                  {match.status === "live" ? "LIVE" : match.status === "finished" ? "FINISHED" : "UPCOMING"}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{match.flag1}</span>
                    <span className="font-medium text-sm">{match.team1}</span>
                  </div>
                  <span className="font-bold text-accent">{match.score1}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{match.flag2}</span>
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
      
      <Button variant="outline" className="w-full mt-4 text-accent border-accent hover:bg-accent hover:text-accent-foreground">
        More Matches
      </Button>
    </div>
  );
};