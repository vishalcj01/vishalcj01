"use client";

import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Progress} from '@/components/ui/progress';

const user = {
  name: 'CyberPunk',
  rank: 'Warrior',
  title: 'Master',
  strength: 75,
  intelligence: 90,
  wealth: 50,
  level: 15,
  avatarUrl: 'https://picsum.photos/id/237/200/300', // Placeholder image
};

export const ProfileSection = () => {
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
