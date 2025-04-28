"use client";

import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {useEffect, useState} from 'react';
import {useToast} from "@/hooks/use-toast";

export const MissionSection = () => {
  const [missions, setMissions] = useState<any[]>([]);
  const {toast} = useToast();

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        // Replace with your actual token retrieval logic
        const token = 'YOUR_AUTH_TOKEN'; // Replace with actual JWT token
        const response = await fetch('/api/missions', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          if (response.status === 401) {
            toast({
              title: 'Unauthorized',
              description: 'Please log in to view your missions.',
              variant: 'destructive',
            });
            return;
          }
          if (response.status === 500) {
            toast({
              title: 'Mission Error',
              description: 'Failed to load missions. Please try again later.',
              variant: 'destructive',
            });
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMissions(data.missions);
      } catch (error: any) {
        console.error('Failed to fetch missions:', error);
        toast({
          title: 'Error fetching missions',
          description: error.message,
          variant: 'destructive',
        });
      }
    };

    fetchMissions();
  }, [toast]);

  const handleSubmitMission = async (missionId: string) => {
    try {
      // Replace with your actual token retrieval logic
      const token = 'YOUR_AUTH_TOKEN'; // Replace with actual JWT token
      const response = await fetch('/api/missions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({missionId}),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      toast({
        title: 'Mission Completed',
        description: data.message,
      });
      // Refresh missions after submission
      setMissions(prevMissions => prevMissions.filter(mission => mission.id !== missionId));
    } catch (error: any) {
      console.error('Failed to submit mission:', error);
      toast({
        title: 'Error submitting mission',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="glassmorphism neon-border transition-smooth">
      <CardHeader>
        <CardTitle>Daily Missions</CardTitle>
        <CardDescription>Complete these missions to earn XP.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {missions.map(mission => (
          <div key={mission.id} className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">{mission.title}</h4>
              <p className="text-sm text-muted-foreground">{mission.description}</p>
              <p className="text-sm text-muted-foreground">Reward: {mission.rewardXp} XP</p>
            </div>
            <Button onClick={() => handleSubmitMission(mission.id)}>Submit Completion</Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
