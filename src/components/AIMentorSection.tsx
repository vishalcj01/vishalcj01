"use client";

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {useEffect, useState} from 'react';
import {getMotivationalQuote} from '@/ai/flows/motivational-anime-quotes';
import {Button} from "@/components/ui/button";
import {suggestMissions} from "@/ai/flows/ai-mission-suggestions";
import Link from "next/link";

export const AIMentorSection = () => {
  const [quote, setQuote] = useState<string>('');
  const [suggestedMissions, setSuggestedMissions] = useState<any[]>([]);

  useEffect(() => {
    const fetchQuote = async () => {
      const motivationalQuote = await getMotivationalQuote({
        userClass: 'Warrior',
        missionType: 'Fitness',
        missionDescription: 'Run 5km'
      });
      setQuote(motivationalQuote.quote);
    };

    const fetchMissions = async () => {
      const missions = await suggestMissions({
        userClass: 'Warrior',
        strength: 75,
        intelligence: 90,
        wealth: 50,
        preferredMissionTypes: ['Fitness', 'Knowledge']
      });
      setSuggestedMissions(missions.suggestedMissions);
    };

    fetchQuote();
    fetchMissions();
  }, []);

  return (
    <Card className="glassmorphism neon-border transition-smooth">
      <CardHeader>
        <CardTitle>AI Mentor</CardTitle>
        <CardDescription>Get personalized mission suggestions and motivational quotes.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="font-semibold">Motivational Quote:</p>
          <p className="text-sm text-muted-foreground">{quote || 'Loading quote...'}</p>
        </div>
        <div>
          <p className="font-semibold">Suggested Missions:</p>
          {suggestedMissions.length > 0 ? (
            <ul>
              {suggestedMissions.map((mission, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  {mission.title} - {mission.description} (Reward: {mission.rewardXp} XP)
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Loading missions...</p>
          )}
        </div>
        <Link href="/ai-mentor-chat">
          <Button className="mt-4">AI Mentor Chat</Button>
        </Link>
      </CardContent>
    </Card>
  );
};
