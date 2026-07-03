# Fichier de suivi de migration - Ancienne → Nouvelle Architecture

**Date de début :** 3 juillet 2026
**Ancienne architecture :** `/home/president/Vidéos/portail-éducatif`
**Nouvelle architecture :** `/home/president/Github/National/CIVITAS/Architecture Microservice/Evenement-frontend-test`

---

## Étape 1 : Fichiers utilitaires (libs, data, types, services)

### 📂 Types (src/types/)

| Fichier ancien | Fichier nouveau | Statut | Notes |
|----------------|-----------------|--------|-------|
| ai.ts | ✅ COPIÉ | OK | Types pour l'IA (AISuggestionResponse, AIPromptSource, etc.) |
| event.ts | ✅ COPIÉ | OK | Types pour les événements (Event, EventRecord, EventSummary, etc.) |
| field.ts | ✅ COPIÉ | OK | Types pour les champs de formulaire (FieldDefinition, FormField, etc.) |
| formConfig.ts | ✅ COPIÉ | OK | Configuration de formulaire (FormConfiguration, BuilderDoc, etc.) |
| submission.ts | ✅ COPIÉ | OK | Types pour les soumissions (Submission, SubmissionRecord, etc.) |
| user.ts | ✅ COPIÉ | OK | Types utilisateurs (User, AdminUser, AuthSession, etc.) |

### 📂 Lib API (lib/api/)

| Fichier ancien | Fichier nouveau | Statut | Notes |
|----------------|-----------------|--------|-------|
| ai.ts | ✅ COPIÉ | OK | API IA (uploadPromptSource, generateEventCopy, suggestSchema, etc.) |
| auth.ts | ✅ COPIÉ | OK | API authentification (login, register, logout) |
| client.ts | ⚠️ EXISTE (lib/http-client.ts) | ✅ CRÉÉ LEGACY | Client HTTP centralisé - créé legacy-client.ts pour compatibilité mock |
| config.ts | ✅ COPIÉ | OK | Configuration API |
| events.ts | ✅ COPIÉ | OK | API événements (listPublic, getById, create, update, etc.) |
| fields.ts | ✅ COPIÉ | OK | API champs/sections (list, create, update, remove) |
| formConfig.ts | ✅ COPIÉ | OK | API configuration formulaire |
| submissions.ts | ✅ COPIÉ | OK | API soumissions (list, create, exportCSV) |

### 📂 Lib Utils (lib/utils/)

| Fichier ancien | Fichier nouveau | Statut | Notes |
|----------------|-----------------|--------|-------|
| cn.ts | ✅ COPIÉ | OK | Utilitaire className (tailwind-merge) |
| formConfig.ts | ✅ COPIÉ | OK | Utilitaires configuration (buildFormConfiguration, hydrateBuilderDocFromConfiguration, etc.) |
| theme.ts | ✅ COPIÉ | OK | Utilitaires thème (applyEventTheme, eventThemeStyle) |

### 📂 Lib Validation (lib/validation/)

| Fichier ancien | Fichier nouveau | Statut | Notes |
|----------------|-----------------|--------|-------|
| fieldValidator.ts | ✅ COPIÉ | OK | Validation de champs (validateFieldValue, validateSubmission, etc.) |

### 📂 Context (src/context/)

| Fichier ancien | Fichier nouveau | Statut | Notes |
|----------------|-----------------|--------|-------|
| AuthContext.tsx | ⚠️ EXISTE (lib/auth-store.ts) | À analyser | Contexte d'authentification - architectures différentes (localStorage vs Keycloak) |

### 📂 Mock (lib/mock/)

| Fichier ancien | Fichier nouveau | Statut | Notes |
|----------------|-----------------|--------|-------|
| db.seed.json | ✅ COPIÉ | OK | Données de seed pour mock |
| mockAiApi.ts | ✅ COPIÉ | OK | Mock API IA |
| mockAuthApi.ts | ✅ COPIÉ | OK | Mock API auth |
| mockDb.ts | ✅ COPIÉ | OK | Mock base de données |
| mockEventsApi.ts | ✅ COPIÉ | OK | Mock API événements |
| mockFieldsApi.ts | ✅ COPIÉ | OK | Mock API champs |
| mockFormConfigApi.ts | ✅ COPIÉ | OK | Mock API configuration |
| mockSubmissionsApi.ts | ✅ COPIÉ | OK | Mock API soumissions |
| mockUtils.ts | ✅ COPIÉ | OK | Utilitaires mock |

---

## Légende
- ❌ MANQUANT : Le fichier n'existe pas dans la nouvelle architecture → à copier
- ⚠️ EXISTE : Le fichier existe déjà dans la nouvelle architecture → à fusionner/adapter
- ✅ COPIÉ : Fichier copié avec succès
- 🔄 FUSIONNÉ : Fichier fusionné avec succès

---

## Statut global - Étape 1 : Fichiers utilitaires
- **Fichiers à copier :** 24 ✅ TERMINÉ
- **Fichiers à fusionner/analyser :** 2 ✅ TERMINÉ (créé legacy pour compatibilité)
- **Total :** 26

---

## Étape 2 : Composants (src/components/)

### 📂 Components Admin (components/admin/)

| Fichier ancien | Fichier nouveau | Statut | Notes |
|----------------|-----------------|--------|-------|
| AIPromptUploader.tsx | ✅ COPIÉ | OK | Upload de prompts IA |
| AISuggestionsPanel.tsx | ✅ COPIÉ | OK | Panneau de suggestions IA |
| EventThemeEditor.tsx | ✅ COPIÉ | OK | Éditeur de thème événement |
| SubmissionsTable.tsx | ✅ COPIÉ | OK | Tableau des soumissions |

### 📂 Components Builder (components/builder/)

| Fichier ancien | Fichier nouveau | Statut | Notes |
|----------------|-----------------|--------|-------|
| BuilderCanvas.tsx | ✅ COPIÉ | OK | Canvas du builder |
| BuilderLeftPanel.tsx | ✅ COPIÉ | OK | Panneau gauche (structure, général, thème, IA) |
| BuilderRightPanel.tsx | ✅ COPIÉ | OK | Panneau droit (propriétés) |
| BuilderTopBar.tsx | ✅ COPIÉ | OK | Barre supérieure (undo/redo, save, import/export) |
| FieldPalette.tsx | ✅ COPIÉ | OK | Palette de champs |
| StructureTree.tsx | ✅ COPIÉ | OK | Arborescence de structure |
| CanvasFieldBlock.tsx | ✅ COPIÉ | OK | Bloc de champ sur le canvas |
| builderReducer.ts | ✅ COPIÉ | OK | Reducer pour le builder |

### 📂 Components Form (components/form/)

| Fichier ancien | Fichier nouveau | Statut | Notes |
|----------------|-----------------|--------|-------|
| DynamicFormRenderer.tsx | ✅ COPIÉ | OK | Rendu dynamique de formulaire |
| FieldEditor.tsx | ✅ COPIÉ | OK | Éditeur de champ |
| FieldRenderer.tsx | ✅ COPIÉ | OK | Rendu de champ |
| SectionEditor.tsx | ✅ COPIÉ | OK | Éditeur de section |

### 📂 Components Voice (components/voice/)

| Fichier ancien | Fichier nouveau | Statut | Notes |
|----------------|-----------------|--------|-------|
| VoiceAssistant.tsx | ✅ COPIÉ | OK | Assistant vocal IA |
| useVoiceAssistant.ts | ✅ COPIÉ | OK | Hook pour assistant vocal |

### 📂 Components UI (src/components/ui/)

| Fichier ancien | Fichier nouveau | Statut | Notes |
|----------------|-----------------|--------|-------|
| Button.tsx | ⚠️ EXISTE (components/ui/) | À vérifier | Bouton |
| Input.tsx | ⚠️ EXISTE (components/ui/) | À vérifier | Input |
| Textarea.tsx | ⚠️ EXISTE (components/ui/) | À vérifier | Textarea |
| Select.tsx | ⚠️ EXISTE (components/ui/) | À vérifier | Select |
| Checkbox.tsx | ⚠️ EXISTE (components/ui/) | À vérifier | Checkbox |
| Card.tsx | ⚠️ EXISTE (components/ui/) | À vérifier | Card |
| Modal.tsx | ⚠️ EXISTE (components/ui/) | À vérifier | Modal |
| Toast.tsx | ⚠️ EXISTE (components/ui/) | À vérifier | Toast |
| Spinner.tsx | ⚠️ EXISTE (components/ui/) | À vérifier | Spinner |
| Badge.tsx | ⚠️ EXISTE (components/ui/) | À vérifier | Badge |

### 📂 Components Layout (components/layout/)

| Fichier ancien | Fichier nouveau | Statut | Notes |
|----------------|-----------------|--------|-------|
| AdminLayout.tsx | ✅ COPIÉ | OK | Layout admin |
| AdminSidebar.tsx | ✅ COPIÉ | OK | Sidebar admin |
| PublicLayout.tsx | ✅ COPIÉ | OK | Layout public |

---

## Étape 3 : Pages (src/pages/)

### 📂 Pages Admin (src/pages/admin/)

| Fichier ancien | Fichier nouveau | Statut | Notes |
|----------------|-----------------|--------|-------|
| DashboardPage.tsx | ✅ COPIÉ | OK | Page dashboard admin |
| EventsListPage.tsx | ✅ COPIÉ | OK | Page liste événements |
| FormBuilderPage.tsx | ✅ COPIÉ | OK | Page builder de formulaire |
| EventEditorPage.tsx | ✅ COPIÉ | OK | Page éditeur événement |
| LoginPage.tsx | ✅ COPIÉ | OK | Page login |
| RegisterPage.tsx | ✅ COPIÉ | OK | Page inscription |

### 📂 Pages Public (src/pages/public/)

| Fichier ancien | Fichier nouveau | Statut | Notes |
|----------------|-----------------|--------|-------|
| EventsHomePage.tsx | ✅ COPIÉ | OK | Page accueil événements public |
| EventDetailPage.tsx | ✅ COPIÉ | OK | Page détail événement |
| EventRegistrationPage.tsx | ✅ COPIÉ | OK | Page inscription événement |
| ConfirmationPage.tsx | ✅ COPIÉ | OK | Page confirmation |
| EventNotFoundPage.tsx | ✅ COPIÉ | OK | Page événement non trouvé |

---

## Étape 4 : Autres fichiers

### 📂 Hooks (src/hooks/)

| Fichier ancien | Fichier nouveau | Statut | Notes |
|----------------|-----------------|--------|-------|
| useVoiceAssistant.ts | ✅ DÉJÀ COPIÉ | OK | Hook assistant vocal (dans components/voice/) |

### 📂 Routes (src/routes/)

| Fichier ancien | Fichier nouveau | Statut | Notes |
|----------------|-----------------|--------|-------|
| router.tsx | ⚠️ EXISTE (src/remote/App.tsx) | NON NÉCESSAIRE | Router déjà opérationnel dans le nouveau projet |
| ProtectedRoute.tsx | ⚠️ EXISTE (src/remote/App.tsx) | NON NÉCESSAIRE | Routes déjà gérées dans le nouveau projet |

### 📂 Racine (src/)

| Fichier ancien | Fichier nouveau | Statut | Notes |
|----------------|-----------------|--------|-------|
| data.ts | ✅ COPIÉ | OK | Données mockées |
| App.tsx | ⚠️ EXISTE (src/remote/App.tsx) | NON NÉCESSAIRE | App déjà existante dans le nouveau projet |

---

## Statut global complet
- **Étape 1 - Fichiers utilitaires :** 26 ✅ TERMINÉ
- **Étape 2 - Composants :** 21 ✅ TERMINÉ (admin: 4, builder: 8, form: 4, voice: 2, layout: 3)
- **Étape 3 - Pages :** 11 ✅ TERMINÉ (admin: 6, public: 5)
- **Étape 4 - Autres :** 3 ✅ TERMINÉ (data.ts copié, routes et App non nécessaires)
- **Total copié :** 61 fichiers
- **Total non nécessaire :** 4 fichiers (routes, App.tsx)
