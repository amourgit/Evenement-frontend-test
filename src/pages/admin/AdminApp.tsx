// ============================================================
// src/pages/admin/AdminApp.tsx
// Point d'entree du backoffice CIVITAS Forms : branche
// l'authentification (context/AuthContext) et la navigation entre
// les ecrans admin (Login, Register, Dashboard, Liste, Editeur).
// ============================================================

import { useState } from "react";
import { AuthContextProvider, useAuth } from "@/context/AuthContext";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { LoginPage } from "./LoginPage";
import { RegisterPage } from "./RegisterPage";
import { DashboardPage } from "./DashboardPage";
import { EventsListPage } from "./EventsListPage";
import { FormBuilderPage } from "./FormBuilderPage";

type AdminScreen = "dashboard" | "events" | "editor";

interface AdminAppProps {
  onBackToPublic: () => void;
}

function AuthenticatedAdmin({ onBackToPublic }: AdminAppProps) {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminScreen>("dashboard");
  const [editingEventId, setEditingEventId] = useState<string | undefined>(undefined);

  const goToEditor = (eventId: string) => {
    setEditingEventId(eventId);
    setActiveTab("editor");
  };

  const goToCreate = () => {
    setEditingEventId(undefined);
    setActiveTab("editor");
  };

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab} onLogout={logout} onGoToPublic={onBackToPublic}>
      {activeTab === "dashboard" && (
        <DashboardPage onNavigateToBuilder={goToEditor} onCreateNew={goToCreate} />
      )}
      {activeTab === "events" && (
        <EventsListPage onEditForm={goToEditor} onCreateNew={goToCreate} />
      )}
      {activeTab === "editor" && (
        <FormBuilderPage
          eventId={editingEventId ?? "new"}
          onBack={() => setActiveTab("events")}
          onEventCreated={(eventId) => setEditingEventId(eventId)}
        />
      )}
    </AdminLayout>
  );
}

function UnauthenticatedAdmin({ onBackToPublic }: AdminAppProps) {
  const [mode, setMode] = useState<"login" | "register">("login");

  if (mode === "register") {
    return <RegisterPage />;
  }
  return <LoginPage onBackToPublic={onBackToPublic} onLoginSuccess={() => {}} />;
  // NB : setMode est reserve pour un futur lien "Creer un compte" sur LoginPage.
}

function AdminGate({ onBackToPublic }: AdminAppProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent border-signal" />
      </div>
    );
  }

  return user ? (
    <AuthenticatedAdmin onBackToPublic={onBackToPublic} />
  ) : (
    <UnauthenticatedAdmin onBackToPublic={onBackToPublic} />
  );
}

export default function AdminApp({ onBackToPublic }: AdminAppProps) {
  return (
    <AuthContextProvider>
      <AdminGate onBackToPublic={onBackToPublic} />
    </AuthContextProvider>
  );
}
