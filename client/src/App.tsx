import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { FarmPlotsPage } from './pages/FarmPlotsPage';
import { CropRecommendationPage } from './pages/CropRecommendationPage';
import { CropDetailsPage } from './pages/CropDetailsPage';
import { DiseaseDetectionPage } from './pages/DiseaseDetectionPage';
import { FertilizerPage } from './pages/FertilizerPage';
import { IrrigationPage } from './pages/IrrigationPage';
import { WeatherPage } from './pages/WeatherPage';
import { CostEstimatorPage } from './pages/CostEstimatorPage';
import { AssistantPage } from './pages/AssistantPage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected App Routes */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/farms" element={<FarmPlotsPage />} />
          <Route path="/crop-recommendation" element={<CropRecommendationPage />} />
          <Route path="/crops/:id" element={<CropDetailsPage />} />
          <Route path="/disease-detection" element={<DiseaseDetectionPage />} />
          <Route path="/fertilizer-advisory" element={<FertilizerPage />} />
          <Route path="/irrigation-advisory" element={<IrrigationPage />} />
          <Route path="/weather" element={<WeatherPage />} />
          <Route path="/cost-estimator" element={<CostEstimatorPage />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* 404 Catch-All */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

