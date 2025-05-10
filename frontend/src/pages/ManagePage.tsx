import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

type Habit = {
  id: string;
  name: string;
  groupName: string;
  frequency: string;
  isArchived: boolean;
};

export function ManagePage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [form, setForm] = useState({ name: "", groupName: "", frequency: "Daily" });
  const activeHabits = habits.filter((h) => !h.isArchived);
  
  useEffect(() => {
    fetch("http://localhost:5214/habits")
      .then((res) => res.json())
      .then(setHabits);
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function addHabit() {
    fetch("http://localhost:5214/habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then(() => window.location.reload());
  }

  function archiveHabit(id: string) {
    fetch(`http://localhost:5214/habits/${id}/archive`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Archive failed");
        window.location.reload();
      })
      .catch((err) => console.error("Archive error:", err));
  }

  return (
    <div className="max-w-xl px-4 py-6 mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Manage Habits</h1>

      <div className="space-y-2">
        <Input placeholder="Habit name" name="name" value={form.name} onChange={handleChange} />
        <Input placeholder="Group (e.g., Morning)" name="groupName" value={form.groupName} onChange={handleChange} />
        <select
            name="frequency"
            value={form.frequency}
            onChange={(e) => setForm({ ...form, frequency: e.target.value })}
            className="px-2 py-1 text-sm border rounded"
        >
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
        </select>
        <Button variant="default" className="w-full" onClick={addHabit}>
            Add Habit
        </Button>
      </div>

      <div className="mt-6 space-y-2">
        {activeHabits.map((habit) => (
          <Card key={habit.id}>
            <CardContent className="flex items-center justify-between gap-4 px-4 py-4">
                <div>
                    <p className="font-medium">{habit.name}</p>
                    <p className="text-sm text-muted-foreground">
                    {habit.groupName || "No group"} • {habit.frequency}
                    </p>
                </div>

                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => archiveHabit(habit.id)}
                >
                    Archive
                </Button>
              </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}