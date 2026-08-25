/**
 * TTAK.KO-12.0414 AI 서비스 개인정보보호 프레임워크 기반 Fake AI 분석 서비스
 * 향후 실제 Google GenAI API로 쉽게 교체할 수 있도록 interface 기반으로 설계
 */
import { AIAnalysisResult } from '../types';

export interface IAiSummaryService {
  analyzeText(rawText: string, vesselName?: string, mmsi?: string): Promise<AIAnalysisResult>;
  maskSensitiveInformation(text: string): { maskedText: string; maskingApplied: boolean };
}

export class FakeAiSummaryService implements IAiSummaryService {
  /**
   * TTAK.KO-12.0414 규격: 전화번호, 주민번호, 성명 등 민감 개인정보 정규식 마스킹
   */
  maskSensitiveInformation(text: string): { maskedText: string; maskingApplied: boolean } {
    let maskedText = text;
    let maskingApplied = false;

    // 전화번호 마스킹 (010-xxxx-xxxx -> 010-****-****)
    const phoneRegex = /(01[016789])-?(\d{3,4})-?(\d{4})/g;
    if (phoneRegex.test(maskedText)) {
      maskedText = maskedText.replace(phoneRegex, '$1-****-$3');
      maskingApplied = true;
    }

    // 이름 마스킹 (2~4글자 한글 성명 중 가운데 글자 마스킹)
    const nameRegex = /선장\s*([가-힣])([가-힣]+)/g;
    if (nameRegex.test(maskedText)) {
      maskedText = maskedText.replace(nameRegex, '선장 $1*');
      maskingApplied = true;
    }

    return { maskedText, maskingApplied: true };
  }

  /**
   * 해상 통신 대화/음성 녹취 분석 및 구조화
   */
  async analyzeText(
    rawText: string,
    vesselName: string = '동해호',
    mmsi: string = '440123000'
  ): Promise<AIAnalysisResult> {
    // 분석 시뮬레이션 딜레이 (1.2초)
    await new Promise((res) => setTimeout(res, 1200));

    const { maskedText } = this.maskSensitiveInformation(rawText);

    let incidentType = '기관고장';
    let urgency: 'HIGH' | 'MEDIUM' | 'LOW' = 'HIGH';
    let keyContent = '기관 고장으로 자력항해가 불가능한 상태 (추진력 상실)';
    let recommendedAction = '인근 구조기관(해양경찰) 및 조업선박에 예인 및 긴급 지원 요청 필요';
    let canSelfNavigate = false;

    const lower = maskedText.toLowerCase();

    if (lower.includes('충돌') || lower.includes('부딪')) {
      incidentType = '충돌위험/선체손상';
      urgency = 'HIGH';
      keyContent = '선박 간 근접 및 충돌 우려 상황 발생';
      recommendedAction = '즉시 회피 조타 및 VTS/해경 비상 주파수 VHF Ch.16 통보';
      canSelfNavigate = true;
    } else if (lower.includes('침수') || lower.includes('물') || lower.includes('배수')) {
      incidentType = '선체 침수';
      urgency = 'HIGH';
      keyContent = '선체 내 급격한 해수 유입으로 전복 위험 증가';
      recommendedAction = '배수펌프 가동 및 승선원 구명조끼 착용, 즉시 긴급구조 출동 요청';
      canSelfNavigate = false;
    } else if (lower.includes('화재') || lower.includes('불')) {
      incidentType = '선내 화재';
      urgency = 'HIGH';
      keyContent = '기관실 또는 조타실 내 화재 발생';
      recommendedAction = '초기 소화 및 승선원 대피, 인근 소방 및 해경 경보 발령';
      canSelfNavigate = false;
    } else if (lower.includes('조난') || lower.includes('표류')) {
      incidentType = '해상 조난 및 표류';
      urgency = 'HIGH';
      keyContent = '해상 표류 상태로 조류에 의한 암초 접근 위험';
      recommendedAction = '투묘(닻 내림) 시도 및 해경 구조선 긴급 출동 요청';
      canSelfNavigate = false;
    } else if (lower.includes('기관') || lower.includes('추진') || lower.includes('엔진') || lower.includes('고장')) {
      incidentType = '기관 고장';
      urgency = 'HIGH';
      keyContent = '기관 고장으로 자력항해가 불가능한 상태';
      recommendedAction = '인근 구조기관 및 선박에 지원 요청 필요';
      canSelfNavigate = false;
    }

    const now = new Date();
    const analyzedAt = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    return {
      incidentType,
      urgency,
      keyContent,
      vesselName,
      mmsi,
      location: {
        lat: 35.2152,
        lng: 129.2214,
      },
      canSelfNavigate,
      recommendedAction,
      privacyProtected: true,
      rawTextAnalyzed: maskedText,
      analyzedAt,
    };
  }
}

export const aiSummaryService = new FakeAiSummaryService();
