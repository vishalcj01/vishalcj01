
// src/app/achievements/page.tsx
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';

export default function AchievementsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md glassmorphism neon-border transition-smooth">
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
          <CardDescription>View your unlocked achievements and badges.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Coming soon: Display of unlocked achievements and badges based on your progress.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

