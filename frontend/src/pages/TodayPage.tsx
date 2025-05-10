import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";


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
  const { t } = useTranslation();

  useEffect(() => {
    fetch("http://localhost:5214/habits/today")
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return t("goodMorning");
    if (hour < 18) return t("goodAfternoon");
    return t("goodEvening");
  }

  return (
    <div className="w-full max-w-4xl px-4 py-6 mx-auto space-y-6">
        <div className="p-6 space-y-6">
            <div className="mb-6 space-y-1">
                <h1 className="text-3xl font-bold">{getGreeting()}</h1>
                <p className="text-sm text-slate-500">{t("checkList")}</p>
            </div>

            {Object.entries(data).map(([group, habits]) => (
              <div key={group} className="space-y-2 ">
                <h2 className="text-lg font-semibold text-slate-500">
                  {group.charAt(0).toUpperCase() + group.slice(1)}
                </h2>
                {habits
                  .sort((a, b) => Number(a.completedToday) - Number(b.completedToday)) // ✅ Sort by completion
                  .map((habit) => (
                    <Card key={habit.id} className="transition-all duration-150 bg-white border shadow rounded-xl hover:shadow-md">
                      <CardContent className="flex items-center justify-between px-3 py-4">
                        <span className={habit.completedToday ? "text-green-600 bg-green-50 rounded px-2 py-1 text-sm" : ""}>
                          {habit.name}
                        </span>

                        {habit.completedToday ? (
                          <div className="p-1 bg-green-100 rounded-full">
                            <Check className="w-4 h-4 text-green-600" />
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => completeHabit(habit.id)}
                          >
                            <Check className="w-4 h-4" />
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
