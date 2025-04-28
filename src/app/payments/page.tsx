
// src/app/payments/page.tsx
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';

export default function PaymentsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md glassmorphism neon-border transition-smooth">
        <CardHeader>
          <CardTitle>Payments</CardTitle>
          <CardDescription>Manage your premium access and payment methods.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Coming soon: Integration with Stripe/Razorpay to manage your payments and premium access.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
