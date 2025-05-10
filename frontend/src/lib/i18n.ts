import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    resources: {
      en: {
        translation: {
          habitFrequency: {
            daily: "Daily",
            weekly: "Weekly",
            monthly: "Monthly"
          },
          today: "Today",
          manage: "Manage",
          progress: "Progress",
          insights: "Insights",
          addHabit: "Add Habit",
          habitName: "Habit name",
          group: "Group",
          frequency: "Frequency",
          daily: "Daily",
          weekly: "Weekly",
          comingSoon: "{{name}} coming soon...",
          checkList: "Here’s your habit checklist for today",
          manageHabits : "Manage habits",
          save: "Save",
          cancel: "Cancel", 
          goodMorning: "Good morning ☀️",
          goodAfternoon: "Good afternoon 🌤️",
          goodEvening: "Good evening 🌙",
          groupInput: "Group (e.g., Morning)",
          sectionHabits: "{{section}} Habits",
          active: "Active",
          archived: "Archived",
        },
      },
      fr: {
        translation: {
            habitFrequency: {
                daily: "Quotidienne",
                weekly: "Hebdomadaire",
                monthly: "Mensuelle"
      },
          today: "Aujourd’hui",
          manage: "Gérer",
          progress: "Progression",
          insights: "Conseils",
          addHabit: "Ajouter une habitude",
          habitName: "Nom de l’habitude",
          group: "Groupe",
          frequency: "Fréquence",
          daily: "Quotidienne",
          weekly: "Hebdomadaire",
          comingSoon: "{{name}} bientôt disponible...",
          checkList: "Voici la liste des habitudes pour aujourd'hui",
          manageHabits : "Gérer les habitudes",
          save: "Enregistrer",
          cancel: "Annuler", 
          goodMorning: "Bonjour ☀️",
          goodAfternoon: "Bon après-midi 🌤️",
          goodEvening: "Bonsoir 🌙",
          groupInput: "Groupe (ex. : Matin)",
          sectionHabits: "Habitudes {{section}}",
          active: "Actives",
          archived: "Archivées",
        },
      },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
