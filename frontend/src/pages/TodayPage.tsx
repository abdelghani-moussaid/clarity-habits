import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

type Habit = {
  id: string;
  name: string;
  frequency: string;
  sortOrder: number;
  isArchived: boolean;
  completedToday: boolean;
};

type HabitGroups = {
  [groupName: string]: Habit[];
};

export function TodayPage() {
  const [data, setData] = useState<HabitGroups>({});

  useEffect(() => {
    fetch("http://localhost:5214/habits/today")
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning ☀️";
    if (hour < 18) return "Good afternoon 🌤️";
    return "Good evening 🌙";
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="p-6 space-y-6">
            <div className="space-y-1 mb-6">
                <h1 className="text-3xl font-bold">{getGreeting()}</h1>
                <p className="text-muted-foreground text-sm">Here’s your habit checklist for today</p>
            </div>

            {Object.entries(data).map(([group, habits]) => (
                <div key={group} className="mb-6 space-y-2">
                    <h2 className="text-xl font-semibold text-muted-foreground">
                        {group.charAt(0).toUpperCase() + group.slice(1)}
                    </h2>
                    {habits.map((habit) => (
                    <Card key={habit.id}>
                        <CardContent className="flex items-center justify-between py-4 px-3">
                        <span className={habit.completedToday ? "text-gray-500 line-through" : ""}>
                            {habit.name}
                        </span>

                        {habit.completedToday ? (
                            <Check className="text-green-600" size={20} />
                        ) : (
                            <Button
                            variant="outline"
                            size="sm"
                            onClick={() => completeHabit(habit.id)}
                            >
                            Mark as done
                            </Button>
                        )}
                        </CardContent>
                    </Card>
                    ))}
                </div>
                ))}
        </div>
    </div>
    
  );

  function completeHabit(id: string) {
    fetch(`http://localhost:5214/habits/${id}/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then(() => window.location.reload()) // simple for now
      .catch(console.error);
  }
}
