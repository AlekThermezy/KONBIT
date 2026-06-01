'use client'

/**
 * ADMIN — Document Ingestion Panel
 * ================================
 * Seed documents from verified links into the DB.
 * Run manually or via cron.
 */

import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import LeftSidebar from '@/components/layout/LeftSidebar'
import { getCurrentUser } from '@/lib/auth'

type SeedResult = {
  title: string
  status: string
  reason?: string
  docId?: string
  chunksCreated?: number
  language?: string
}

export default function AdminIngestPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)
  const [results, setResults] = useState<SeedResult[]>([])
  const [stats, setStats] = useState<any>(null)
  const [selectedBatch, setSelectedBatch] = useState<string>('all')

  useEffect(() => {
    getCurrentUser().then(u => {
      setUser(u)
      setLoading(false)
      if (u) fetchStats()
    })
  }, [])

  async function fetchStats() {
    const res = await fetch('/api/ask-haiti/ingest')
    const data = await res.json()
    setStats(data)
  }

  async function seedBatch() {
    setSeeding(true)
    setResults([])

    // Documents from haiti_resources_seed_verified_links.md
    const documents = getDocuments(selectedBatch)

    const res = await fetch('/api/ask-haiti/ingest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'seed_batch', documents }),
    })

    const data = await res.json()
    setResults(data.results || [])
    setSeeding(false)
    fetchStats()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-green-500 text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <LeftSidebar />
      <Navbar />

      <main className="ml-64 pt-16 px-4 pb-16">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-900/30 border border-red-700/40 rounded-full text-red-400 text-xs font-bold mb-4">
              🔒 ADMIN
            </div>
            <h1 className="text-3xl font-black mb-2">
              <span className="text-white">Document</span>
              <span className="text-green-500"> Ingestion</span>
            </h1>
            <p className="text-gray-400">
              Seed documents from verified sources into Ask Haiti knowledge base.
            </p>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                <div className="text-3xl font-black text-green-400">{stats.documents || 0}</div>
                <div className="text-gray-500 text-sm">Documents</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                <div className="text-3xl font-black text-blue-400">{stats.chunks || 0}</div>
                <div className="text-gray-500 text-sm">Chunks</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                <div className="text-3xl font-black text-amber-400">{stats.chunksPendingEmbedding || 0}</div>
                <div className="text-gray-500 text-sm">Pending Embedding</div>
              </div>
            </div>
          )}

          {/* Batch selector */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
            <div className="text-white font-bold mb-4">Select batch to seed</div>
            <div className="flex flex-wrap gap-3 mb-4">
              {[
                { key: 'legal', label: '📜 Constitution & Legal', count: 8 },
                { key: 'business', label: '💼 Business & Investment', count: 16 },
                { key: 'customs', label: '🚢 Customs & Trade', count: 11 },
                { key: 'health', label: '🏥 Health & Public Health', count: 14 },
                { key: 'all', label: '🌐 All Categories', count: 49 },
              ].map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setSelectedBatch(opt.key)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 ${
                    selectedBatch === opt.key
                      ? 'bg-green-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                  }`}
                >
                  {opt.label}
                  <span className="text-xs opacity-60">({opt.count})</span>
                </button>
              ))}
            </div>
            <button
              onClick={seedBatch}
              disabled={seeding}
              className="px-6 py-3 bg-green-600 hover:bg-green-500 disabled:bg-white/10 disabled:text-gray-600 rounded-xl font-bold text-white transition"
            >
              {seeding ? '⏳ Seeding...' : '▶ Seed Selected Batch'}
            </button>
            <div className="text-xs text-gray-600 mt-2">
              Rate limited to 1 doc/second to avoid overwhelming source servers.
            </div>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="text-white font-bold mb-4">Results</div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {results.map((r, i) => (
                  <div key={i} className={`p-3 rounded-xl text-sm flex items-center gap-3 ${
                    r.status === 'done' ? 'bg-green-900/20 border border-green-900/40' :
                    r.status === 'skipped' ? 'bg-white/5 border border-white/10' :
                    'bg-red-900/20 border border-red-900/40'
                  }`}>
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      r.status === 'done' ? 'bg-green-500' :
                      r.status === 'skipped' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium truncate">{r.title}</div>
                      <div className="text-gray-500 text-xs">
                        {r.status === 'done' && r.chunksCreated ? `${r.chunksCreated} chunks · ${r.language}` : ''}
                        {r.status === 'skipped' && 'already exists'}
                        {r.status === 'failed' && r.reason}
                      </div>
                    </div>
                    <span className={`text-xs font-bold ${
                      r.status === 'done' ? 'text-green-400' :
                      r.status === 'skipped' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>{r.status}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-sm text-gray-400">
                Done: {results.filter(r => r.status === 'done').length} ·
                Skipped: {results.filter(r => r.status === 'skipped').length} ·
                Failed: {results.filter(r => r.status === 'failed').length}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function getDocuments(batch: string) {
  const legal = [
    {
      url: 'https://cscca.gouv.ht/constitution_1987.pdf',
      metadata: {
        title: 'Constitution de la République d\'Haïti (1987)',
        source_name: 'CSCCA',
        source_type: 'government',
        category: 'legal',
        subcategory: 'constitution',
        file_type: 'pdf',
        trust_tier: 'high',
        publication_date: '1987-03-29',
      }
    },
    {
      url: 'https://www.constituteproject.org/constitution/Haiti_2012.pdf',
      metadata: {
        title: 'Haiti Constitution (2012 consolidated)',
        source_name: 'Constitute Project',
        source_type: 'institution',
        category: 'legal',
        subcategory: 'constitution',
        file_type: 'pdf',
        trust_tier: 'high',
        publication_date: '2012',
      }
    },
    {
      url: 'https://socialprotection-humanrights.org/wp-content/uploads/2017/07/2003_codtravail_hti.pdf',
      metadata: {
        title: 'Code du Travail haïtien (2003)',
        source_name: 'Social Protection & Human Rights',
        source_type: 'institution',
        category: 'legal',
        subcategory: 'labor',
        file_type: 'pdf',
        trust_tier: 'high',
        publication_date: '2003',
      }
    },
    {
      url: 'https://archive.org/download/codedutravailfra01hait/codedutravailfra01hait.pdf',
      metadata: {
        title: 'Code du Travail — Internet Archive',
        source_name: 'Internet Archive',
        source_type: 'archive',
        category: 'legal',
        subcategory: 'labor',
        file_type: 'pdf',
        trust_tier: 'medium',
      }
    },
    {
      url: 'https://archive.org/download/codecivildhati02hait/codecivildhati02hait.pdf',
      metadata: {
        title: 'Code civil d\'Haïti',
        source_name: 'Internet Archive',
        source_type: 'archive',
        category: 'legal',
        subcategory: 'civil',
        file_type: 'pdf',
        trust_tier: 'medium',
      }
    },
    {
      url: 'https://archive.org/download/codedecommerce00hait/codedecommerce00hait.pdf',
      metadata: {
        title: 'Code de commerce d\'Haïti',
        source_name: 'Internet Archive',
        source_type: 'archive',
        category: 'legal',
        subcategory: 'commerce',
        file_type: 'pdf',
        trust_tier: 'medium',
      }
    },
    {
      url: 'https://tourisme.gouv.ht/images/all_medias/Investment%20code_Haiti_English%20version.pdf',
      metadata: {
        title: 'Investment Code of Haiti (English)',
        source_name: 'Ministère du Tourisme',
        source_type: 'government',
        category: 'business',
        subcategory: 'investment',
        file_type: 'pdf',
        trust_tier: 'high',
        publication_date: '2002',
      }
    },
    {
      url: 'https://dzf.gouv.ht/Code_des_Investissements.pdf',
      metadata: {
        title: 'Code des Investissements (DZF)',
        source_name: 'DZF',
        source_type: 'government',
        category: 'business',
        subcategory: 'investment',
        file_type: 'pdf',
        trust_tier: 'high',
      }
    },
  ]

  const business = [
    {
      url: 'https://dgi.gouv.ht/formulaires/',
      metadata: {
        title: 'DGI Formulaires — Direction Générale des Impôts',
        source_name: 'DGI Haiti',
        source_type: 'government',
        category: 'business',
        subcategory: 'tax',
        file_type: 'url',
        trust_tier: 'high',
      }
    },
    {
      url: 'https://dgi.gouv.ht/wp-content/uploads/2020/07/Formulaire-A-Personne-Physique.pdf',
      metadata: {
        title: 'Formulaire A – Personne Physique (DGI)',
        source_name: 'DGI Haiti',
        source_type: 'government',
        category: 'business',
        subcategory: 'tax',
        file_type: 'pdf',
        trust_tier: 'high',
        publication_date: '2020-07',
      }
    },
    {
      url: 'https://dgi.gouv.ht/wp-content/uploads/2020/07/Formulaire-D-Societe-anonyme.pdf',
      metadata: {
        title: 'Formulaire D – Société anonyme (DGI)',
        source_name: 'DGI Haiti',
        source_type: 'government',
        category: 'business',
        subcategory: 'company',
        file_type: 'pdf',
        trust_tier: 'high',
        publication_date: '2020-07',
      }
    },
    {
      url: 'https://guichet.mci.ht/',
      metadata: {
        title: 'Guichet MCI — Single Window for Business',
        source_name: 'MCI Haiti',
        source_type: 'government',
        category: 'business',
        subcategory: 'company',
        file_type: 'url',
        trust_tier: 'high',
      }
    },
    {
      url: 'https://www.state.gov/reports/2024-investment-climate-statements/haiti/',
      metadata: {
        title: '2024 Haiti Investment Climate Statement',
        source_name: 'U.S. State Department',
        source_type: 'institution',
        category: 'business',
        subcategory: 'investment',
        file_type: 'url',
        trust_tier: 'high',
        publication_date: '2024',
      }
    },
    {
      url: 'https://documents1.worldbank.org/curated/en/414781574947748405/pdf/Doing-Business-2020-Comparing-Business-Regulation-in-190-Economies-Economy-Profile-of-Haiti.pdf',
      metadata: {
        title: 'Doing Business 2020 — Haiti',
        source_name: 'World Bank',
        source_type: 'institution',
        category: 'business',
        subcategory: 'investment',
        file_type: 'pdf',
        trust_tier: 'high',
        publication_date: '2020',
      }
    },
    {
      url: 'https://cfi.ht/wp-content/uploads/2025/03/Plan-Strategique-CFI-VF-Mise-en-page_76292527.pdf',
      metadata: {
        title: 'CFI Plan Stratégique 2023–2027',
        source_name: 'CFI Haiti',
        source_type: 'institution',
        category: 'business',
        subcategory: 'investment',
        file_type: 'pdf',
        trust_tier: 'high',
        publication_date: '2025-03',
      }
    },
    {
      url: 'https://www.brh.ht/wp-content/uploads/FinScope_MSME_Haiti_2021_Pocketguide_FR-2025-04-07.pdf',
      metadata: {
        title: 'BRH FinScope MSME Haiti 2021 Pocket Guide',
        source_name: 'Banque de la République d\'Haïti',
        source_type: 'government',
        category: 'business',
        subcategory: 'finance',
        file_type: 'pdf',
        trust_tier: 'high',
        publication_date: '2021',
      }
    },
  ]

  const customs = [
    {
      url: 'https://www.ifrc.org/docs/IDRL/Haiti/Code_de_Douanes.pdf',
      metadata: {
        title: 'Code de Douanes — IFRC',
        source_name: 'IFRC',
        source_type: 'institution',
        category: 'customs',
        subcategory: 'trade',
        file_type: 'pdf',
        trust_tier: 'high',
      }
    },
    {
      url: 'https://www.haiti-now.org/wp-content/uploads/2017/05/Code-douanier-Dr.-Fran%C3%A7ois-Duvalier-1963.pdf',
      metadata: {
        title: 'Code douanier Dr. François Duvalier (1963)',
        source_name: 'Haiti Now',
        source_type: 'ngo',
        category: 'customs',
        subcategory: 'trade',
        file_type: 'pdf',
        trust_tier: 'medium',
        publication_date: '1963',
      }
    },
    {
      url: 'https://www.haiti-now.org/wp-content/uploads/2017/05/Guide-de-limportateur.pdf',
      metadata: {
        title: 'Guide de l\'importateur — Haiti Now',
        source_name: 'Haiti Now',
        source_type: 'ngo',
        category: 'customs',
        subcategory: 'import',
        file_type: 'pdf',
        trust_tier: 'medium',
      }
    },
    {
      url: 'https://www.trade.gov/country-commercial-guides/haiti-import-tariffs',
      metadata: {
        title: 'Haiti Import Tariffs',
        source_name: 'International Trade Administration',
        source_type: 'institution',
        category: 'customs',
        subcategory: 'tariffs',
        file_type: 'url',
        trust_tier: 'high',
      }
    },
    {
      url: 'https://www.trade.gov/country-commercial-guides/haiti-customs-regulations',
      metadata: {
        title: 'Haiti Customs Regulations',
        source_name: 'International Trade Administration',
        source_type: 'institution',
        category: 'customs',
        subcategory: 'regulations',
        file_type: 'url',
        trust_tier: 'high',
      }
    },
    {
      url: 'https://documents1.worldbank.org/curated/en/099051724102532865/pdf/P18025713dadcb0bf1aa581c9ab8215e82b.pdf',
      metadata: {
        title: 'Strengthening Customs Administration in Haiti',
        source_name: 'World Bank',
        source_type: 'institution',
        category: 'customs',
        subcategory: 'administration',
        file_type: 'pdf',
        trust_tier: 'high',
      }
    },
  ]

  const health = [
    {
      url: 'https://dhsprogram.com/pubs/pdf/FR326/FR326.pdf',
      metadata: {
        title: 'EMMUS-VI 2016–2017 Rapport final',
        source_name: 'DHS Program',
        source_type: 'institution',
        category: 'health',
        subcategory: 'demographic',
        file_type: 'pdf',
        trust_tier: 'high',
        publication_date: '2017',
      }
    },
    {
      url: 'https://reliefweb.int/report/haiti/haiti-humanitarian-needs-and-response-plan-2024',
      metadata: {
        title: 'Haiti Humanitarian Needs and Response Plan 2024',
        source_name: 'UNOCHA',
        source_type: 'institution',
        category: 'health',
        subcategory: 'humanitarian',
        file_type: 'url',
        trust_tier: 'high',
        publication_date: '2024',
      }
    },
    {
      url: 'https://www.unocha.org/attachments/84dce279-4578-43cd-8fcc-2a840f094b7f/2024-Haiti-HNRP-ExecutiveSummary%20ENG.pdf',
      metadata: {
        title: 'Haiti HNRP Executive Summary 2024',
        source_name: 'UNOCHA',
        source_type: 'institution',
        category: 'health',
        subcategory: 'humanitarian',
        file_type: 'pdf',
        trust_tier: 'high',
        publication_date: '2024',
      }
    },
    {
      url: 'https://www.paho.org/sites/default/files/2024-03/paho-cholera-sitrep-haiti-0313-2024.pdf',
      metadata: {
        title: 'PAHO Cholera Situation Report — Haiti 2024',
        source_name: 'PAHO',
        source_type: 'institution',
        category: 'health',
        subcategory: 'cholera',
        file_type: 'pdf',
        trust_tier: 'high',
        publication_date: '2024-03',
      }
    },
    {
      url: 'https://www.who.int/emergencies/disease-outbreak-news/item/2022-DON427',
      metadata: {
        title: 'WHO Cholera Haiti — Disease Outbreak News',
        source_name: 'WHO',
        source_type: 'institution',
        category: 'health',
        subcategory: 'cholera',
        file_type: 'url',
        trust_tier: 'high',
        publication_date: '2022',
      }
    },
    {
      url: 'https://www.who.int/countries/hti',
      metadata: {
        title: 'WHO Haiti Country Page',
        source_name: 'WHO',
        source_type: 'institution',
        category: 'health',
        subcategory: 'general',
        file_type: 'url',
        trust_tier: 'high',
      }
    },
    {
      url: 'https://washdata.org/data/household#!/hti',
      metadata: {
        title: 'JMP Haiti WASH Data',
        source_name: 'WHO/UNICEF JMP',
        source_type: 'institution',
        category: 'health',
        subcategory: 'wash',
        file_type: 'url',
        trust_tier: 'high',
      }
    },
    {
      url: 'https://www.unaids.org/en/regionscountries/countries/haiti',
      metadata: {
        title: 'UNAIDS Haiti Country Page',
        source_name: 'UNAIDS',
        source_type: 'institution',
        category: 'health',
        subcategory: 'hiv',
        file_type: 'url',
        trust_tier: 'high',
      }
    },
  ]

  switch (batch) {
    case 'legal': return legal
    case 'business': return business
    case 'customs': return customs
    case 'health': return health
    default: return [...legal, ...business, ...customs, ...health]
  }
}