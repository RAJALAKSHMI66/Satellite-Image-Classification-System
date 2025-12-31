import React, { useState } from 'react';
import { ThemeProvider } from '../context/ThemeContext';
import { UserProvider, useUser } from '../context/UserContext';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Dashboard from './Dashboard';
import Analytics from './Analytics';
import Profile from './Profile';
import Settings from './Settings';
import Help from './Help';
import WorkflowPipeline from '../components/WorkflowPipeline';
import ModelArchitecture from '../components/ModelArchitecture';
import DatasetInfo from '../components/DatasetInfo';
import ImageUploader from '../components/ImageUploader';
import ClassificationResults from '../components/ClassificationResults';
import LoginScreen from '../components/LoginScreen';
import SatelliteLoader from '../components/SatelliteLoader';

const MainContent: React.FC<{ activeTab: string }> = ({ activeTab }) => {
  const [prediction, setPrediction] = useState<number[] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isClassified, setIsClassified] = useState(false);

  const handleClassify = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const probs = [
        Math.random() * 0.8 + 0.1,
        Math.random() * 0.3,
        Math.random() * 0.3,
        Math.random() * 0.3,
        Math.random() * 0.2
      ];
      const sum = probs.reduce((a, b) => a + b, 0);
      setPrediction(probs.map(p => p / sum));
      setIsProcessing(false);
      setIsClassified(true);
    }, 2000);
  };

  const handleClearClassification = () => {
    setPrediction(null);
    setIsClassified(false);
  };

  switch (activeTab) {
    case 'dashboard':
      return <Dashboard />;
    case 'classify':
      return (
        <div className="space-y-6 animate-fade-in">
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">Image Classification</h2>
            <p className="text-muted-foreground">Upload satellite imagery for real-time classification</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <ImageUploader 
              onClassify={handleClassify} 
              isProcessing={isProcessing}
              isClassified={isClassified}
              onClearClassification={handleClearClassification}
            />
            <ClassificationResults prediction={prediction} />
          </div>
        </div>
      );
    case 'analytics':
      return <Analytics />;
    case 'workflow':
      return <WorkflowPipeline />;
    case 'architecture':
      return (
        <div className="space-y-6 animate-fade-in">
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">Model Architecture</h2>
            <p className="text-muted-foreground">Deep learning model structure and training configuration</p>
          </div>
          <ModelArchitecture />
        </div>
      );
    case 'datasets':
      return <DatasetInfo />;
    case 'profile':
      return <Profile />;
    case 'settings':
      return <Settings />;
    case 'help':
      return <Help />;
    default:
      return <Dashboard />;
  }
};

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const { isLoggedIn, login } = useUser();

  const handleLogin = (userData?: { name: string; email: string }) => {
    setIsLoading(true);
    // Simulate loading time for satellite animation
    setTimeout(() => {
      login(userData);
      setIsLoading(false);
    }, 2500);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Show satellite animation for refresh
    setTimeout(() => {
      setIsLoading(false);
    }, 2500);
  };

  if (!isLoggedIn && !isLoading) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (isLoading) {
    return <SatelliteLoader />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onNavigate={setActiveTab} onRefresh={handleRefresh} />
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-6 gradient-bg min-h-[calc(100vh-4rem)]">
          <MainContent activeTab={activeTab} />
        </main>
      </div>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <ThemeProvider>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </ThemeProvider>
  );
};

export default Index;
