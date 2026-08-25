/**
 * Blue Call (블루콜) - 표준으로 연결하는 해상 안전통신
 * 2026 ICT 표준 챌린지 출품작 네이티브 모바일 인터랙티브 데모 애플리케이션
 */
import React, { useState } from 'react';
import { Vessel, CallLog, AIAnalysisResult, EmergencyAlert, PrivacySettings } from './types';
import { MOCK_VESSELS, INITIAL_CALL_LOGS } from './data/mockData';
import { DeviceFrame } from './components/common/DeviceFrame';
import { TopHeader } from './components/common/TopHeader';
import { BottomNavBar, NavTab } from './components/common/BottomNavBar';
import { HomeScreen } from './components/home/HomeScreen';
import { ChatScreen } from './components/chat/ChatScreen';
import { HistoryScreen } from './components/history/HistoryScreen';
import { SettingsScreen } from './components/settings/SettingsScreen';
import { NetworkConnectionModal } from './components/connection/NetworkConnectionModal';
import { CallScreen } from './components/call/CallScreen';
import { AiAnalysisScreen } from './components/ai/AiAnalysisScreen';
import { CapAlertScreen } from './components/alert/CapAlertScreen';
import { AgencyTransmissionScreen } from './components/transmission/AgencyTransmissionScreen';
import { StandardsScreen } from './components/standards/StandardsScreen';
import { ScenarioGuideModal } from './components/demo/ScenarioGuideModal';
import { aiSummaryService } from './services/FakeAiSummaryService';
import { emergencyAlertService } from './services/MockEmergencyAlertService';

export default function App() {
  // Navigation and active view states
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [activeModalScreen, setActiveModalScreen] = useState<
    'connection' | 'call' | 'ai_analysis' | 'cap_alert' | 'agency_transmission' | 'standards' | null
  >(null);

  // Selected Vessel & Data states
  const [selectedVessel, setSelectedVessel] = useState<Vessel>(MOCK_VESSELS[0]);
  const [aiSourceText, setAiSourceText] = useState('기관 고장입니다. 추진이 안 됩니다.');
  const [currentAiAnalysis, setCurrentAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [currentAlert, setCurrentAlert] = useState<EmergencyAlert | null>(null);

  // Persistent logs & privacy settings
  const [callLogs, setCallLogs] = useState<CallLog[]>(INITIAL_CALL_LOGS);
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    useSafeNumber: true,
    aiContentAnalysis: true,
    autoPrivacyMasking: true,
    storeCallLogs: true,
    retentionDays: 30,
  });

  // Demo Tour State
  const [isDemoTourOpen, setIsDemoTourOpen] = useState(false);
  const [scenarioStep, setScenarioStep] = useState(1);

  // Flow handlers
  const handleStartSafeCallFlow = (vessel: Vessel) => {
    setSelectedVessel(vessel);
    setActiveModalScreen('connection');
  };

  const handleCallConnectedStart = (vessel: Vessel) => {
    setSelectedVessel(vessel);
    setActiveModalScreen('call');
  };

  const handleEndCall = (durationSeconds: number) => {
    const now = new Date();
    const startTimeStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    if (privacySettings.storeCallLogs) {
      const newLog: CallLog = {
        id: `call-log-${Date.now()}`,
        vessel: selectedVessel,
        startTime: startTimeStr,
        durationSeconds,
        callType: 'OUTGOING',
        aiSummary: {
          summary: `${selectedVessel.name}과(와) 안심번호로 ${durationSeconds}초간 해상 안전 통화 완료.`,
          incidentType: '일반통신',
          urgency: 'LOW',
          locationIncluded: true,
          privacyMasked: true,
        },
      };
      setCallLogs((prev) => [newLog, ...prev]);
    }

    setActiveModalScreen(null);
    setCurrentTab('history');
  };

  const handleTriggerEmergencyFromCall = async (incidentType: string, vessel: Vessel) => {
    setSelectedVessel(vessel);
    setAiSourceText(`[음성통화 긴급상황] ${incidentType} 발생. 즉각적인 지원 요청.`);
    setActiveModalScreen('ai_analysis');
    setScenarioStep(4);
  };

  const handleOpenChat = (vessel: Vessel) => {
    setSelectedVessel(vessel);
    setCurrentTab('chat');
    setActiveModalScreen(null);
  };

  const handleAnalyzeMessage = (content: string, vessel: Vessel) => {
    setSelectedVessel(vessel);
    setAiSourceText(content);
    setActiveModalScreen('ai_analysis');
    setScenarioStep(4);
  };

  const handleGenerateCapAlert = (analysis: AIAnalysisResult) => {
    setCurrentAiAnalysis(analysis);
    setActiveModalScreen('cap_alert');
    setScenarioStep(5);
  };

  const handleProceedToTransmission = (alert: EmergencyAlert) => {
    setCurrentAlert(alert);
    setActiveModalScreen('agency_transmission');
    setScenarioStep(6);
  };

  // Jump to specific scenario step for competition judges
  const handleJumpToStep = async (stepNumber: number) => {
    setScenarioStep(stepNumber);

    switch (stepNumber) {
      case 1:
        setActiveModalScreen(null);
        setCurrentTab('home');
        setSelectedVessel(MOCK_VESSELS[0]);
        break;
      case 2:
        setSelectedVessel(MOCK_VESSELS[0]);
        setActiveModalScreen('connection');
        break;
      case 3:
        setSelectedVessel(MOCK_VESSELS[0]);
        setActiveModalScreen(null);
        setCurrentTab('chat');
        break;
      case 4:
        setSelectedVessel(MOCK_VESSELS[0]);
        setAiSourceText('기관 고장입니다. 추진이 안 됩니다.');
        setActiveModalScreen('ai_analysis');
        break;
      case 5: {
        setSelectedVessel(MOCK_VESSELS[0]);
        const analysis = await aiSummaryService.analyzeText(
          '기관 고장입니다. 추진이 안 됩니다.',
          '동해호',
          '440123000'
        );
        setCurrentAiAnalysis(analysis);
        setActiveModalScreen('cap_alert');
        break;
      }
      case 6: {
        setSelectedVessel(MOCK_VESSELS[0]);
        const analysis = await aiSummaryService.analyzeText(
          '기관 고장입니다. 추진이 안 됩니다.',
          '동해호',
          '440123000'
        );
        const alert = emergencyAlertService.convertToCapAlert(analysis);
        setCurrentAlert(alert);
        setActiveModalScreen('agency_transmission');
        break;
      }
      default:
        setActiveModalScreen(null);
        setCurrentTab('home');
    }
  };

  // Navigate directly to standard-specific features
  const handleNavigateToStandardFeature = (targetScreen: string) => {
    if (targetScreen === 'connection') {
      handleJumpToStep(2);
    } else if (targetScreen === 'chat') {
      handleJumpToStep(3);
    } else if (targetScreen === 'alert') {
      handleJumpToStep(5);
    } else if (targetScreen === 'settings') {
      setActiveModalScreen(null);
      setCurrentTab('settings');
    }
  };

  return (
    <DeviceFrame
      currentScenarioStep={scenarioStep}
      onOpenDemoTour={() => setIsDemoTourOpen(true)}
      onJumpToStep={handleJumpToStep}
    >
      {/* Top Application Bar with LTE-M status & time */}
      <TopHeader
        onOpenDemoTour={() => setIsDemoTourOpen(true)}
        onOpenStandards={() => setActiveModalScreen('standards')}
      />

      {/* Main Content Body */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Full-Screen Modals / Special Flow Views */}
        {activeModalScreen === 'call' ? (
          <CallScreen
            vessel={selectedVessel}
            onEndCall={handleEndCall}
            onTriggerEmergency={handleTriggerEmergencyFromCall}
          />
        ) : activeModalScreen === 'ai_analysis' ? (
          <AiAnalysisScreen
            vessel={selectedVessel}
            sourceText={aiSourceText}
            onGenerateCapAlert={handleGenerateCapAlert}
            onBackToChat={() => {
              setActiveModalScreen(null);
              setCurrentTab('chat');
            }}
            onOpenStandards={() => setActiveModalScreen('standards')}
          />
        ) : activeModalScreen === 'cap_alert' && currentAiAnalysis ? (
          <CapAlertScreen
            analysis={currentAiAnalysis}
            onProceedToTransmission={handleProceedToTransmission}
            onBackToAi={() => setActiveModalScreen('ai_analysis')}
            onOpenStandards={() => setActiveModalScreen('standards')}
          />
        ) : activeModalScreen === 'agency_transmission' && currentAlert ? (
          <AgencyTransmissionScreen
            alert={currentAlert}
            onGoHome={() => {
              setActiveModalScreen(null);
              setCurrentTab('home');
              setScenarioStep(1);
            }}
            onGoHistory={() => {
              setActiveModalScreen(null);
              setCurrentTab('history');
            }}
          />
        ) : activeModalScreen === 'standards' ? (
          <StandardsScreen
            onBack={() => setActiveModalScreen(null)}
            onNavigateToFeature={handleNavigateToStandardFeature}
          />
        ) : (
          /* Standard Bottom Tab Navigation Views */
          <>
            {currentTab === 'home' && (
              <HomeScreen
                onStartSafeCall={handleStartSafeCallFlow}
                onOpenChat={handleOpenChat}
                onOpenDemoTour={() => setIsDemoTourOpen(true)}
                onOpenStandards={() => setActiveModalScreen('standards')}
              />
            )}
            {currentTab === 'chat' && (
              <ChatScreen
                vessel={selectedVessel}
                onStartSafeCall={handleStartSafeCallFlow}
                onAnalyzeMessage={handleAnalyzeMessage}
                onOpenStandards={() => setActiveModalScreen('standards')}
              />
            )}
            {currentTab === 'history' && (
              <HistoryScreen
                logs={callLogs}
                onClearLogs={() => setCallLogs([])}
              />
            )}
            {currentTab === 'settings' && (
              <SettingsScreen
                settings={privacySettings}
                onUpdateSettings={setPrivacySettings}
                onClearAllLogs={() => setCallLogs([])}
                onOpenStandards={() => setActiveModalScreen('standards')}
              />
            )}
          </>
        )}

        {/* 4-Step Network Open API Connection Modal */}
        {activeModalScreen === 'connection' && (
          <NetworkConnectionModal
            vessel={selectedVessel}
            onClose={() => setActiveModalScreen(null)}
            onCallStart={handleCallConnectedStart}
          />
        )}
      </div>

      {/* Material 3 Bottom Navigation Bar (Hidden during active live calls for realism) */}
      {activeModalScreen !== 'call' && (
        <BottomNavBar
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setActiveModalScreen(null);
            setCurrentTab(tab);
          }}
          unreadCount={1}
        />
      )}

      {/* 6-Step Competition Scenario Guide Modal */}
      <ScenarioGuideModal
        isOpen={isDemoTourOpen}
        onClose={() => setIsDemoTourOpen(false)}
        currentStep={scenarioStep}
        onJumpToStep={handleJumpToStep}
      />
    </DeviceFrame>
  );
}
