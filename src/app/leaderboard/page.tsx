'use client';

import {useState, useEffect} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {useToast} from '@/hooks/use-toast';

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const {toast} = useToast();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/leaderboard');
        if (!response.ok) {
          let errorMessage = `HTTP error! status: ${response.status}`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            // If JSON parsing fails, use the original error message
          }
          toast({
            title: 'Leaderboard Error',
            description: errorMessage,
            variant: 'destructive',
          });
          return;
        }
        const data = await response.json();
        setLeaderboardData(data.leaderboard);
      } catch (error: any) {
        console.error('Failed to fetch leaderboard data:', error);
        toast({
          title: 'Error fetching leaderboard',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [toast]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-2xl glassmorphism neon-border transition-smooth">
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
          <CardDescription>Top players by XP.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading leaderboard...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Rank</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>XP</TableHead>
                  <TableHead>Strength</TableHead>
                  <TableHead>Intelligence</TableHead>
                  <TableHead>Wealth</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboardData.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.xp}</TableCell>
                    <TableCell>{user.strength}</TableCell>
                    <TableCell>{user.intelligence}</TableCell>
                    <TableCell>{user.wealth}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
