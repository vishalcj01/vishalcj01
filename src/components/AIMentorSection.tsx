
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
  const [userClass, setUserClass] = useState<string>('Warrior'); // Default user class
  const [strength, setStrength] = useState<number>(75);
  const [intelligence, setIntelligence] = useState<number>(90);
  const [wealth, setWealth] = useState<number>(50);
  const [preferredMissionTypes, setPreferredMissionTypes] = useState<string[]>(['Fitness', 'Knowledge']);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const motivationalQuote = await getMotivationalQuote({
          userClass: userClass,
          missionType: 'Fitness',
          missionDescription: 'Run 5km'
        });
        setQuote(motivationalQuote.quote);
      } catch (error) {
        console.error("Failed to fetch motivational quote:", error);
        setQuote("Failed to load quote.");
      }
    };

    const fetchMissions = async () => {
      try {
        const missions = await suggestMissions({
          userClass: userClass,
          strength: strength,
          intelligence: intelligence,
          wealth: wealth,
          preferredMissionTypes: preferredMissionTypes
        });
        setSuggestedMissions(missions.suggestedMissions);
      } catch (error) {
        console.error("Failed to fetch suggested missions:", error);
        setSuggestedMissions([]);
      }
    };

    fetchQuote();
    fetchMissions();
  }, [userClass, strength, intelligence, wealth, preferredMissionTypes]);

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
