import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { NewAnalysisPage } from './pages/NewAnalysisPage';
import { PipelinePage } from './pages/PipelinePage';
import { CandidateResultsPage } from './pages/CandidateResultsPage';
import { CandidateDetailPage } from './pages/CandidateDetailPage';
import { ReportsPage } from './pages/ReportsPage';
import { DataSourcesPage } from './pages/DataSourcesPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="new-analysis" element={<NewAnalysisPage />} />
          <Route path="pipeline/:id" element={<PipelinePage />} />
          <Route path="candidates/:id" element={<CandidateResultsPage />} />
          <Route path="candidates/detail/:constructId" element={<CandidateDetailPage />} />
          <Route path="reports/:id" element={<ReportsPage />} />
          <Route path="sources" element={<DataSourcesPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
