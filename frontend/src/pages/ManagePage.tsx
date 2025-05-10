import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Archive, Trash2, Save, X } from "lucide-react";
import { useTranslation } from "react-i18next";

type Habit = {
  id: string;
  name: string;
  groupName: string;
  frequency: string;
  isArchived: boolean;
};

export function ManagePage() {
  const { t } = useTranslation();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [form, setForm] = useState({
    name: "",
    groupName: "",
    frequency: "Daily",
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(form);

  useEffect(() => {
    fetch("http://localhost:5214/habits")
      .then((res) => res.json())
      .then(setHabits);
  }, []);

  const grouped = {
    active: habits.filter((h) => !h.isArchived),
    archived: habits.filter((h) => h.isArchived),
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function addHabit() {
    fetch("http://localhost:5214/habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }).then(() => window.location.reload());
  }

  function startEdit(habit: Habit) {
    setEditId(habit.id);
    setEditForm({
      name: habit.name,
      groupName: habit.groupName,
      frequency: habit.frequency,
    });
  }

  function saveEdit(id: string) {
    fetch(`http://localhost:5214/habits/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    })
      .then(() => {
        setEditId(null);
        window.location.reload();
      })
      .catch((err) => console.error("Edit error:", err));
  }

  function archiveHabit(id: string) {
    fetch(`http://localhost:5214/habits/${id}/archive`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    }).then(() => window.location.reload());
  }

  function deleteHabit(id: string) {
    fetch(`http://localhost:5214/habits/${id}`, {
      method: "DELETE",
    }).then(() => window.location.reload());
  }

  return (
    <div className="w-full max-w-4xl px-4 py-6 mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{t("manageHabits")}</h1>

      {/* Create Form */}
      <div className="space-y-2">
        <Input placeholder={t("habitName")} name="name" value={form.name} onChange={handleChange} />
        <Input placeholder={t("groupInput")} name="groupName" value={form.groupName} onChange={handleChange} />
        <select
          name="frequency"
          value={form.frequency}
          onChange={handleChange}
          className="w-full px-2 py-1 text-sm border rounded"
        >
          <option value="Daily">{t("daily")}</option>
          <option value="Weekly">{t("weekly")}</option>
        </select>
        <Button className="w-full text-white bg-sky-600 hover:bg-sky-700" onClick={addHabit}>
          {t("addHabit")} 
        </Button>
      </div>

      {/* Habit Lists */}
      {["active", "archived"].map((section) => (
        <div key={section}>
          <h2 className="mt-6 text-lg font-semibold capitalize text-slate-500">
            {t("sectionHabits", { section: t(section) })}
          </h2>
          <div className="mt-2 space-y-4 transition-all duration-150 hover:shadow-md">
            {grouped[section as keyof typeof grouped].map((habit) => (
              <Card key={habit.id}  className="bg-white border shadow rounded-xl">
                <CardContent className="flex items-center justify-between px-4 py-4">
                  {editId === habit.id ? (
                    <div className="w-full space-y-2">
                      <Input
                        name="name"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      />
                      <Input
                        name="groupName"
                        value={editForm.groupName}
                        onChange={(e) => setEditForm({ ...editForm, groupName: e.target.value })}
                      />
                      <select
                        name="frequency"
                        value={editForm.frequency}
                        onChange={(e) => setEditForm({ ...editForm, frequency: e.target.value })}
                        className="w-full px-2 py-1 text-sm border rounded"
                      >
                        <option value="Daily">{t("daily")}</option>
                        <option value="Weekly">{t("weekly")}</option>
                      </select>
                      <div className="flex gap-2">
                        <Button size="sm"  className="text-white bg-sky-600 hover:bg-sky-700" onClick={() => saveEdit(habit.id)}>
                          <Save className="w-4 h-4 mr-1" /> {t("save")}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-white bg-red-600 hover:bg-red-700" onClick={() => setEditId(null)}>
                          <X className="w-4 h-4 mr-1" /> {t("cancel")}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <p className="font-medium">{habit.name}</p>
                        <p className="text-sm text-slate-500">
                          {habit.groupName || "No group"} • {t(habit.frequency.toLowerCase())}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" className="hover:bg-slate-100" size="icon" onClick={() => startEdit(habit)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" className="hover:bg-slate-100" size="icon" onClick={() => archiveHabit(habit.id)}>
                          <Archive className="w-4 h-4 text-orange-500" />
                        </Button>
                        {habit.isArchived && (
                          <Button variant="ghost" className="hover:bg-slate-100" size="icon" onClick={() => deleteHabit(habit.id)}>
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
