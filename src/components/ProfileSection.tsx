
"use client";

import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Progress} from '@/components/ui/progress';
import {useEffect, useState} from 'react';
import {useToast} from "@/hooks/use-toast";
import {Button} from "@/components/ui/button";
import Link from 'next/link';

export const ProfileSection = () => {
  const [user, setUser] = useState<any>({
    name: 'Loading...',
    level: 0,
    title: '...',
    rank: '...',
    strength: 0,
    intelligence: 0,
    wealth: 0,
    avatarUrl: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const {toast} = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true); // Start loading

      try {
        // Replace with actual JWT token retrieval logic
        const token = 'test-token'; 
        const response = await fetch('/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          let errorMessage = `HTTP error! status: ${response.status}`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            // If JSON parsing fails, use the original error message
          }

          if (response.status === 401) {
            toast({
              title: 'Unauthorized',
              description: 'Please log in to view your profile.',
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'Profile Error',
              description: errorMessage,
              variant: 'destructive',
            });
          }
          return;
        }

        const data = await response.json();
        setUser(data.user);
      } catch (error: any) {
        console.error('Failed to fetch profile:', error);
        toast({
          title: 'Error fetching profile',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false); // End loading
      }
    };

    fetchProfile();
  }, [toast]);

  return (
    <Card className="w-full md:w-80 glassmorphism neon-border transition-smooth">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Your stats and achievements</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {isLoading ? (
          <p>Loading profile...</p>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <p className="text-muted-foreground">Level {user.level} {user.title}</p>
                <p className="text-muted-foreground">Rank: {user.rank}</p>
              </div>
            </div>
            <div>
              <h4 className="mb-2 font-semibold">Stats</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Strength</span>
                  <Progress value={user.strength} />
                </div>
                <div className="flex items-center justify-between">
                  <span>Intelligence</span>
                  <Progress value={user.intelligence} />
                </div>
                <div className="flex items-center justify-between">
                  <span>Wealth</span>
                  <Progress value={user.wealth} />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Link href="/missions">
                <Button>View Missions</Button>
              </Link>
              <Link href="/leaderboard">
                <Button>View Leaderboard</Button>
              </Link>
              <Link href="/payments">
                <Button>Manage Payments</Button>
              </Link>
              <Link href="/achievements">
                <Button>View Achievements</Button>
              </Link>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
