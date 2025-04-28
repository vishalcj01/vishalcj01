"use client";

import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {useEffect, useState} from 'react';
import {useToast} from "@/hooks/use-toast";
import {submitMissionCompletion} from "@/app/actions";

export const MissionSection = () => {
  const [missions, setMissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const {toast} = useToast();

  useEffect(() => {
    const fetchMissions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/missions');
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
              description: 'Please log in to view your missions.',
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'Mission Error',
              description: errorMessage,
              variant: 'destructive',
            });
          }
          return;
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchMissions();
  }, [toast]);

  const handleMissionCompletion = async (missionId: string) => {
    const result = await submitMissionCompletion(missionId);

    if (result.success) {
      toast({
        title: 'Mission Completed',
        description: result.message,
      });
      setMissions((prevMissions) => prevMissions.filter((mission) => mission.id !== missionId));
    } else {
      toast({
        title: 'Error submitting mission',
        description: result.message || 'Failed to submit mission',
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
        {isLoading ? (
          <p>Loading missions...</p>
        ) : (
          missions.map(mission => (
            <div key={mission.id} className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">{mission.title}</h4>
                <p className="text-sm text-muted-foreground">{mission.description}</p>
                <p className="text-sm text-muted-foreground">Reward: {mission.rewardXp} XP</p>
              </div>
              <Button onClick={() => handleMissionCompletion(mission.id)}>Submit Completion</Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
