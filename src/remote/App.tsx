// ============================================================
// src/remote/App.tsx — Point d'entrée CIVITAS Site
// Route principale : / → HomePageContent
// Architecture : React Router + ThemeProvider + AuthProvider
// ============================================================

import React, { Suspense } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';

// ── Providers ─────────────────────────────────────────────────
import { ThemeProvider } from '@/lib/theme';
import { AuthProvider  } from '@/components/providers/AuthProvider';
import ParticlesBackground from "@/components/kokonutui/particles-background"
import VerticalMenu from "@/components/vertical-menu"
import Header from "@/components/layout/Header/header"
import GlobalFooter from "@/components/layout/Footer/global-footer"

// ── Pages lazy ────────────────────────────────────────────────
const HomePage    = React.lazy(() => import('../pages/home/home'));
const ContactPage = React.lazy(() => import('../pages/contact/contact'));
const EventPage = React.lazy(() => import('../pages/event/EventsHomePage'));
const EventDetailPage = React.lazy(() => import('../pages/event/EventDetailPage'));
const EventRegistrationPage = React.lazy(() => import('../pages/event/EventRegistrationPage'));
const EventNotFoundPage = React.lazy(() => import('../pages/event/EventNotFoundPage'));
const ConfirmationPage = React.lazy(() => import('../pages/event/ConfirmationPage'));
const AdminApp = React.lazy(() => import('../pages/admin/AdminApp'));


// ── Props contrat Core ─────────────────────────────────────────
export interface CoreUser {
  id: string; username: string; email: string;
  prenom?: string; nom?: string;
  roles: string[]; token: string; tenantId: string;
}
export interface CoreTenant {
  id: string; subdomain: string; name: string;
  logoUrl?: string; theme?: { primary: string; secondary: string };
}
export interface CoreContext {
  user?:          CoreUser;
  tenant?:        CoreTenant;
  basePath?:      string;
  navigate?:      (path: string) => void;
  hasShellLayout?:boolean;
  permissions?:   string[];
}
export interface CivitasAppProps {
  coreContext?: CoreContext;
  basePath?:    string;
  embedded?:    boolean;
}

// ── Loader ────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div style={{
      display:'flex', alignItems:'center', justifyContent:'center',
      height:'100vh', flexDirection:'column', gap:16,
      background:'#070c1a',
    }}>
      <div style={{
        width:32, height:32,
        border:'2.5px solid rgba(99,102,241,0.15)',
        borderTop:'2.5px solid #6366f1',
        borderRadius:'50%', animation:'spin 0.7s linear infinite',
      }} />
      <span style={{ fontSize:12, color:'rgba(255,255,255,0.3)', fontFamily:'system-ui' }}>
        Chargement…
      </span>
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </div>
  );
}

function EventsHomeRoute({ basePath }: { basePath: string }) {
  const navigate = useNavigate();
  return <EventPage onSelectEvent={(id) => navigate(`${basePath}/events/${id}`)} />;
}

// ── Wrappers pont entre les pages (props callbacks) et le routeur ──
function EventDetailRoute({ basePath }: { basePath: string }) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  return (
    <EventDetailPage
      onBack={() => navigate(`${basePath}/events`)}
      onGoToRegister={(eventId) => navigate(`${basePath}/events/${eventId}/register`)}
    />
  );
}

function EventRegistrationRoute({ basePath }: { basePath: string }) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  return (
    <EventRegistrationPage
      onBack={() => navigate(`${basePath}/events/${id}`)}
      onSubmitSuccess={(receiptId) => navigate(`${basePath}/events/${id}/confirmation`, { state: { receiptId } })}
    />
  );
}

function ConfirmationRoute({ basePath }: { basePath: string }) {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const state = (typeof window !== 'undefined' && (window.history.state?.usr as { receiptId?: string } | undefined)) || undefined;
  return (
    <ConfirmationPage
      receiptId={state?.receiptId ?? params.id ?? ''}
      onReturnHome={() => navigate(`${basePath}/`)}
    />
  );
}

function EventNotFoundRoute({ basePath }: { basePath: string }) {
  const navigate = useNavigate();
  return <EventNotFoundPage onBack={() => navigate(`${basePath}/events`)} />;
}

function AdminRoute({ basePath }: { basePath: string }) {
  const navigate = useNavigate();
  return <AdminApp onBackToPublic={() => navigate(`${basePath}/`)} />;
}

// ── Routeur CIVITAS ───────────────────────────────────────────
function CivitasRoutes({ basePath }: { basePath: string }) {
  const bp = basePath === '/' ? '' : basePath;
  return (
      <Routes>
        <Route path={`${bp}/`}         element={<HomePage />} />
        <Route path={`${bp}`}          element={<HomePage />} />
        <Route path={`${bp}/contact`}  element={<ContactPage />} />
        <Route path={`${bp}/events`}   element={<EventsHomeRoute basePath={bp} />} />
        <Route path={`${bp}/events/not-found`} element={<EventNotFoundRoute basePath={bp} />} />
        <Route path={`${bp}/events/:id`} element={<EventDetailRoute basePath={bp} />} />
        <Route path={`${bp}/events/:id/register`} element={<EventRegistrationRoute basePath={bp} />} />
        <Route path={`${bp}/events/:id/confirmation`} element={<ConfirmationRoute basePath={bp} />} />
        <Route path={`${bp}/admin/*`}  element={<AdminRoute basePath={bp} />} />
        {/* Catch-all → Home */}
        <Route path="*"                element={<HomePage />} />
      </Routes>
  );
}

// ── Composant principal ────────────────────────────────────────
export default function CivitasApp({
  coreContext,
  basePath = '/',
  embedded = false,
}: CivitasAppProps) {
  const resolvedBase = coreContext?.basePath ?? basePath;

  return (
    <ThemeProvider defaultTheme="default" enableDarkMode>
      <AuthProvider>
        <VerticalMenu />
        <Header />
        <div className="flex min-h-screen w-full flex-col bg-transparent">
          <div className="flex-1 w-full">
            <CivitasRoutes basePath={resolvedBase} />
          </div>
          <GlobalFooter />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}


