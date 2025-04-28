"use client";

import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';

const dailyMissions = [
  {
    id: 1,
    type: 'Fitness',
    title: 'Morning Run',
    description: 'Go for a 30-minute run.',
    rewardXp: 150,
  },
  {
    id: 2,
    type: 'Knowledge',
    title: 'Read a Book',
    description: 'Read a chapter of a book.',
    rewardXp: 120,
  },
  {
    id: 3,
    type: 'Wealth',
    title: 'Track Expenses',
    description: 'Record your expenses for the day.',
    rewardXp: 100,
  },
];

export const MissionSection = () => {
  return (
    <Card className="glassmorphism neon-border transition-smooth">
      <CardHeader>
        <CardTitle>Daily Missions</CardTitle>
        <CardDescription>Complete these missions to earn XP.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {dailyMissions.map(mission => (
          <div key={mission.id} className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">{mission.title}</h4>
              <p className="text-sm text-muted-foreground">{mission.description}</p>
              <p className="text-sm text-muted-foreground">Reward: {mission.rewardXp} XP</p>
            </div>
            <Button>Submit Completion</Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
