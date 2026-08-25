/**
 * Blue Call (블루콜) - 해상 통합 안심 이동통신 플랫폼
 * TTA 표준 기반 모델 정의
 */

export interface Vessel {
  id: string;
  name: string;                        // 선박명 (예: 동해호)
  mmsi: string;                        // MMSI (9자리, 예: 440123000)
  callSign: string;                    // 호출부호 (4~7자리 영문/숫자, 예: DSBF2)
  fishingVesselNumber: string;         // 어선번호 (14자리 순수 숫자: 등록연월(4)+일련번호(5)+관청코드(4)+검증번호(1), 예: 21050014411018)
  fishingVesselNumberFormatted: string;// 포맷된 어선번호 (예: 2105-00144-1101-8)
  vesselNumber: string;                // 선박등록번호
  type: string;                        // 선박종류 (예: 연안연승어선, 근해자망어선, 예인선, 레저보트)
  tonnage: string;                     // 톤수 (예: 9.77톤)
  status: 'ONLINE' | 'STANDBY' | 'EMERGENCY' | 'OFFLINE';
  maskedNumber: string;                // 안심번호 (예: 050-XXXX-2300)
  latitude: number;                    // 현재 위도
  longitude: number;                   // 현재 경도
  port: string;                        // 모항 (예: 부산 기장 대변항)
  captainNameMasked: string;           // 선장명 마스킹 (예: 김*수)
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderMmsi: string;
  isMe: boolean;
  content: string;
  timestamp: string;
  type: 'TEXT' | 'LOCATION' | 'IMAGE' | 'EMERGENCY_NOTICE';
  status: 'SENDING' | 'SENT' | 'DELIVERED' | 'READ';
  locationData?: {
    lat: number;
    lng: number;
    addressDescription?: string;
  };
  isUrgent?: boolean;
}

export interface CallLog {
  id: string;
  vessel: Vessel;
  startTime: string;
  durationSeconds: number;
  callType: 'OUTGOING' | 'INCOMING' | 'EMERGENCY';
  aiSummary?: {
    summary: string;
    incidentType: string;
    urgency: 'HIGH' | 'MEDIUM' | 'LOW';
    locationIncluded: boolean;
    privacyMasked: boolean;
  };
}

export interface AIAnalysisResult {
  incidentType: string;
  urgency: 'HIGH' | 'MEDIUM' | 'LOW';
  keyContent: string;
  vesselName: string;
  mmsi: string;
  location: {
    lat: number;
    lng: number;
  };
  canSelfNavigate: boolean;
  recommendedAction: string;
  privacyProtected: boolean;
  rawTextAnalyzed: string;
  analyzedAt: string;
}

export interface EmergencyAlert {
  alertId: string;
  incidentType: string;
  urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  vesselName: string;
  mmsi: string;
  latitude: number;
  longitude: number;
  occurredAt: string;
  situation: string;
  requestedAction: string;
  canSelfNavigate: boolean;
  standardReference: string; // TTAK.OT-06.0055/R4
  xmlRepresentation?: string;
}

export interface AgencyTransmissionStatus {
  agencyName: string;
  status: 'PENDING' | 'TRANSMITTING' | 'COMPLETED' | 'FAILED';
  transmittedAt?: string;
  ackNumber?: string;
  iconName: string;
  description: string;
}

export interface PrivacySettings {
  useSafeNumber: boolean;          // 안심번호 사용 (기본 ON)
  aiContentAnalysis: boolean;      // AI 통신내용 분석 (기본 ON)
  autoPrivacyMasking: boolean;     // 개인정보 자동 마스킹 (기본 ON)
  storeCallLogs: boolean;          // 통신기록 저장 (기본 ON)
  retentionDays: number;           // 통신기록 보관일수 (기본 30일)
}

export interface TTAStandardInfo {
  code: string;
  title: string;
  shortDesc: string;
  detailDesc: string;
  applicationArea: string;
  badge: string;
  targetScreen: string;
}
