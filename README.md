# Sequence Logic (SIH 2026 Prototype)

## Immuno-Informatics and Computational Reverse-Vaccinology Pipeline

Sequence Logic is an end-to-end computational biology research prototype developed for the Smart India Hackathon (SIH 2026). It automates the rational multi-epitope vaccine (MEV) design workflow using real public biological data, strict scientific integrity, and immutable cryptographic provenance.

---

## Key Scientific Integrity Directives

1. **Zero Fabrication**: Scientific metrics (antigenicity scores, binding affinities, or MD curves) are never randomly generated or hallucinated.
2. **Transparent Provenance**: Every calculation records its source, accession, tool, tool version, parameters, UTC timestamp, and input/output SHA-256 hash.
3. **Honest Fallbacks**: Local heuristic algorithms are never labeled as VaxiJen, ANTIGENpro, IEDB, or GROMACS. Unavailable tools explicitly report `"Service unavailable / Not evaluated"` or `"Adapter Placeholder"`.
4. **Benchmark Disclosures**: Peer-reviewed reference MD trajectories are disclosed as literature benchmarks for demonstration and never claimed as newly performed simulations on the local host.

---

## Project Structure

```
Sequence-Logic-SIH/
├── backend/
│   ├── app/
│   │   ├── main.py                     # FastAPI application entry & CORS
│   │   ├── config.py                   # App configuration & paths
│   │   ├── api/v1/                     # REST API controllers
│   │   │   ├── analysis.py             # Analysis & 9-stage pipeline execution
│   │   │   ├── sequence.py             # BioPython FASTA validator & benchmark loader
│   │   │   ├── candidates.py           # Candidate constructs & structural metrics
│   │   │   ├── reports.py              # Scientific research dossier & checksum
│   │   │   └── sources.py              # Live status of scientific adapters
│   │   ├── core/
│   │   │   └── provenance.py           # SHA-256 hashing & immutable audit log
│   │   ├── db/
│   │   │   ├── models.py               # SQLModel database schemas
│   │   │   └── session.py              # SQLite connection & engine
│   │   ├── adapters/                   # 10 Scientific data & simulation adapters
│   │   │   ├── uniprot_adapter.py      # Real UniProt KB REST API
│   │   │   ├── ncbi_adapter.py         # Real NCBI Entrez E-Utilities
│   │   │   ├── iedb_adapter.py         # Real IEDB Analysis Resource API
│   │   │   ├── vaxijen_adapter.py      # Legacy VaxiJen server adapter
│   │   │   ├── antigenpro_adapter.py   # ANTIGENpro adapter
│   │   │   ├── safety_adapter.py       # ToxinPred dipeptide & FAO/WHO rules
│   │   │   ├── rcsb_pdb_adapter.py     # Real RCSB PDB REST API
│   │   │   ├── alphafold_adapter.py    # Real AlphaFold Protein DB API
│   │   │   ├── docking_adapter.py      # AutoDock Vina adapter & benchmark loader
│   │   │   └── gromacs_adapter.py      # GROMACS HPC package generator (.mdp/.top)
│   │   ├── scientific/
│   │   │   ├── fasta_validator.py      # BioPython SeqIO IUPAC protein validator
│   │   │   ├── physchem.py             # BioPython ProtParam physicochemical analyzer
│   │   │   └── antigenicity_local.py   # Local ACC z-scale descriptor
│   │   └── data/
│   │       └── benchmark_datasets/     # Real benchmark targets (SARS-CoV-2, DENV-2, TB)
│   ├── tests/                          # 17 automated tests (100% passing)
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx                     # React Router definition
│   │   ├── pages/                      # 8 core application pages
│   │   │   ├── DashboardPage.tsx       # System overview & preset loader
│   │   │   ├── NewAnalysisPage.tsx     # Ingestion & real-time BioPython FASTA check
│   │   │   ├── PipelinePage.tsx        # 9-stage visual reverse-vaccinology tracker
│   │   │   ├── CandidateResultsPage.tsx# Pareto MCDA ranking matrix
│   │   │   ├── CandidateDetailPage.tsx # Modular construct, ProtParam, MD stability
│   │   │   ├── ReportsPage.tsx         # Cryptographic research dossier & JSON export
│   │   │   ├── DataSourcesPage.tsx     # 10 scientific adapters connection matrix
│   │   │   └── SettingsPage.tsx        # System settings & integrity policy
│   │   ├── components/layout/          # Navbar, Sidebar, Layout, StatusPill
│   │   └── services/                   # Axios API client & TypeScript interfaces
│   ├── package.json
│   └── vite.config.ts
│
├── run_backend.bat                     # 1-click script to start backend
├── run_frontend.bat                    # 1-click script to start frontend
└── README.md
```

---

## Verification & Test Results

The test suite contains **17 automated unit and integration tests** verifying:
- FASTA validation with BioPython SeqIO
- Rejection of invalid non-alphabetical characters and illegal amino acids (`J`)
- Flagging accidental nucleotide sequence inputs
- SQLModel database schema constraints and relationships
- Provenance recording and SHA-256 cryptographic verification
- API health and benchmark endpoints
- Missing external service graceful handling (AutoDock Vina, GROMACS, ANTIGENpro)
- End-to-end demo workflow with real SARS-CoV-2 Spike glycoprotein (UniProt: `P0DTC2`)

Run tests anytime with:
```powershell
.\venv\Scripts\python.exe -m pytest backend\tests -v
```

---

## How to Run

### 1. Start the Backend Server (FastAPI + BioPython)
```powershell
.\venv\Scripts\python.exe -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000 --reload
```
*API available at: `http://127.0.0.1:8000`*  
*Interactive Swagger docs at: `http://127.0.0.1:8000/docs`*

### 2. Start the Frontend Dashboard (React + Vite + Tailwind)
```powershell
cd frontend
npm run dev
```
*Dashboard available at: `http://localhost:5173`*
