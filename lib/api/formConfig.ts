import { api } from "./client";
import type { FormConfiguration, FormConfigurationSaveResponse } from "@/types/formConfig";
import { USE_MOCK_API } from "./config";
import { mockFormConfigApi } from "@/mock/mockFormConfigApi";

/**
 * Ces routes transportent TOUJOURS le JSON de configuration complet
 * (event + theme + ai_config + sections + fields + meta), construit par
 * lib/utils/formConfig.ts::buildFormConfiguration. Le backend est
 * responsable de persister l'ensemble de maniere transactionnelle
 * (creation/replacement des sections et champs inclus) et de revalider
 * chaque attribut avant ecriture.
 */
const realFormConfigApi = {
  /** Cree un evenement a partir d'une configuration complete (premier enregistrement) */
  async create(config: FormConfiguration): Promise<FormConfigurationSaveResponse> {
    return api.post<FormConfigurationSaveResponse>("/admin/events/configuration", config, {
      auth: true,
    });
  },

  /** Remplace integralement la configuration d'un evenement existant */
  async save(eventId: string, config: FormConfiguration): Promise<FormConfigurationSaveResponse> {
    return api.put<FormConfigurationSaveResponse>(
      `/admin/events/${eventId}/configuration`,
      config,
      { auth: true }
    );
  },

  /** Recupere la configuration complete et a jour d'un evenement (pour export/clonage depuis le serveur) */
  async get(eventId: string): Promise<FormConfiguration> {
    return api.get<FormConfiguration>(`/admin/events/${eventId}/configuration`, { auth: true });
  },
};

/**
 * Voir src/mock/mockFormConfigApi.ts : tant que USE_MOCK_API est actif, la
 * configuration complete est lue/ecrite dans la base fictive locale
 * (src/mock/db.seed.json + localStorage), avec exactement le meme JSON de
 * sortie (meta/checksum/stats compris) que produirait le vrai backend.
 */
export const formConfigApi: typeof realFormConfigApi = USE_MOCK_API
  ? mockFormConfigApi
  : realFormConfigApi;
