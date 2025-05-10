import { Routes, Route, Link, useLocation } from "react-router-dom";
import { TodayPage } from "./pages/TodayPage";
import { ManagePage } from "./pages/ManagePage";
import { useTranslation } from "react-i18next";
import { t } from "i18next";

function App() {
  
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
    <nav className="sticky top-0 z-10 w-full overflow-x-auto bg-white border-b shadow-sm">
      <div className="flex justify-center gap-4 py-4 whitespace-nowrap">
          <NavLink to="/">{t("today")}</NavLink>
          <NavLink to="/manage">{t("manage")}</NavLink>
          <NavLink to="/progress">{t("progress")}</NavLink>
          <NavLink to="/insights">{t("insights")}</NavLink>
        </div>
      </nav>

      <main className="w-full p-6">
        <Routes>
          <Route path="/" element={<TodayPage />} />
          <Route path="/manage" element={<ManagePage />} />
          <Route path="/progress" element={<PlaceholderPage name="Progress" />} />
          <Route path="/insights" element={<PlaceholderPage name="Insights" />} />
        </Routes>
      </main>
    </div>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`text-sm font-medium ${isActive ? "text-sky-600 underline" : "text-slate-500 hover:text-slate-700"}`}
    >
      {children}
    </Link>
  );
}

function PlaceholderPage({ name }: { name: string }) {
  return <div className="text-xl font-semibold text-muted-foreground">{t("comingSoon", { name })}</div>;
}

export default App;