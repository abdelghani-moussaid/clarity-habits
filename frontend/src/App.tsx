import { Routes, Route, Link, useLocation } from "react-router-dom";
import { TodayPage } from "./pages/TodayPage";
import { ManagePage } from "./pages/ManagePage";

function App() {

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-10 w-full bg-white border-b">
        <div className="flex justify-center gap-6 py-4">
          <NavLink to="/">Today</NavLink>
          <NavLink to="/manage">Manage</NavLink>
          <NavLink to="/progress">Progress</NavLink>
          <NavLink to="/insights">Insights</NavLink>
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
      className={`text-sm font-medium ${isActive ? "text-blue-600 underline" : "text-muted-foreground hover:text-foreground"}`}
    >
      {children}
    </Link>
  );
}

function PlaceholderPage({ name }: { name: string }) {
  return <div className="text-xl font-semibold text-muted-foreground">{name} coming soon...</div>;
}

export default App;