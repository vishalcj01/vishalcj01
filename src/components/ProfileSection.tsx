"use client";

import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Progress} from '@/components/ui/progress';
import {useEffect, useState} from 'react';
import {useToast} from "@/hooks/use-toast";

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
  const {toast} = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Replace with your actual token retrieval logic
        const token = 'YOUR_AUTH_TOKEN'; // Replace with actual JWT token
        const response = await fetch('/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          if (response.status === 401) {
            toast({
              title: 'Unauthorized',
              description: 'Please log in to view your profile.',
              variant: 'destructive',
            });
            return;
          }
          if (response.status === 500) {
            toast({
              title: 'Profile Error',
              description: 'Failed to load profile data. Please try again later.',
              variant: 'destructive',
            });
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
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
      </CardContent>
    </Card>
  );
};
