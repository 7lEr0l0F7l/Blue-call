/**
 * TTAK.KO-06.0619 모바일 네트워크 오픈 API 서비스 연동 Mock Service
 */

export interface ConnectionStep {
  step: number;
  title: string;
  detail: string;
  status: 'WAITING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  technicalLog: string;
}

export interface INetworkOpenApiService {
  requestSafeConnection(mmsi: string, onStepUpdate: (steps: ConnectionStep[]) => void): Promise<{
    success: boolean;
    sessionId: string;
    safeNumber: string;
    targetMmsi: string;
    timestamp: string;
  }>;
}

export class MockNetworkOpenApiService implements INetworkOpenApiService {
  private initialSteps: ConnectionStep[] = [
    {
      step: 1,
      title: '1. 선박 식별 및 위치망 확인',
      detail: '해양수산부 및 AIS/V-Pass 망을 통해 선박 MMSI 및 기본 제원을 식별합니다.',
      status: 'WAITING',
      technicalLog: 'GET /api/v1/maritime/vessel/verify?mmsi=440123000 -> 200 OK (Identity Confirmed)',
    },
    {
      step: 2,
      title: '2. 모바일 Network Open API 연결',
      detail: 'TTAK.KO-06.0619 규격에 따라 이동통신 사업자 코어망 Open API 게이트웨이와 세션을 개시합니다.',
      status: 'WAITING',
      technicalLog: 'POST /core/open-api/v2/session/initiate { standard: "TTAK.KO-06.0619", qos: "HIGH_PRIORITY_VOICE" }',
    },
    {
      step: 3,
      title: '3. 가상 안심번호(050) 자동 생성',
      detail: 'TTAK.KO-12.0414 개인정보보호 원칙에 따라 실제 휴대폰 번호를 숨기는 암호화 안심 가상번호를 할당합니다.',
      status: 'WAITING',
      technicalLog: 'PUT /security/virtual-number/bind { realMsisdn: "***-****-****", virtualMask: "050-XXXX-2300" }',
    },
    {
      step: 4,
      title: '4. 상대 선박 안심 통신망 호 연결',
      detail: 'VoLTE/LTE-M 해상 통신망을 통해 발신자와 착신자 간 안전한 음성 채널을 최종 수립합니다.',
      status: 'WAITING',
      technicalLog: 'ACK /sip/call/session-established (SIP 200 OK with SRTP Encryption)',
    },
  ];

  async requestSafeConnection(
    mmsi: string,
    onStepUpdate: (steps: ConnectionStep[]) => void
  ): Promise<{
    success: boolean;
    sessionId: string;
    safeNumber: string;
    targetMmsi: string;
    timestamp: string;
  }> {
    const currentSteps = JSON.parse(JSON.stringify(this.initialSteps)) as ConnectionStep[];

    for (let i = 0; i < currentSteps.length; i++) {
      currentSteps[i].status = 'IN_PROGRESS';
      onStepUpdate([...currentSteps]);
      await new Promise((res) => setTimeout(res, 550));

      currentSteps[i].status = 'COMPLETED';
      onStepUpdate([...currentSteps]);
      await new Promise((res) => setTimeout(res, 180));
    }

    return {
      success: true,
      sessionId: `BC-OPENAPI-${Date.now().toString().slice(-6)}`,
      safeNumber: '050-XXXX-2300',
      targetMmsi: mmsi,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour12: false }),
    };
  }
}

export const networkOpenApiService = new MockNetworkOpenApiService();
