/**
 * TTAK.OT-06.0055/R4 통합경보시스템을 위한 공통경보프로토콜(CAP) 프로파일 Mock Service
 */
import { EmergencyAlert, AgencyTransmissionStatus, AIAnalysisResult } from '../types';

export interface IEmergencyAlertService {
  convertToCapAlert(analysis: AIAnalysisResult): EmergencyAlert;
  generateCapXml(alert: EmergencyAlert): string;
  transmitToAgencies(
    alert: EmergencyAlert,
    onStatusUpdate: (statuses: AgencyTransmissionStatus[]) => void
  ): Promise<boolean>;
}

export class MockEmergencyAlertService implements IEmergencyAlertService {
  convertToCapAlert(analysis: AIAnalysisResult): EmergencyAlert {
    const now = new Date();
    const isoString = now.toISOString();

    const alertId = `KR-CG-MARITIME-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 9000) + 1000)}`;

    const alert: EmergencyAlert = {
      alertId,
      incidentType: analysis.incidentType,
      urgency: 'HIGH',
      vesselName: analysis.vesselName,
      mmsi: analysis.mmsi,
      latitude: analysis.location.lat,
      longitude: analysis.location.lng,
      occurredAt: `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
      situation: analysis.keyContent,
      requestedAction: analysis.recommendedAction,
      canSelfNavigate: analysis.canSelfNavigate,
      standardReference: 'TTAK.OT-06.0055/R4',
    };

    alert.xmlRepresentation = this.generateCapXml(alert);
    return alert;
  }

  generateCapXml(alert: EmergencyAlert): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2"
       xmlns:tta="http://www.tta.or.kr/standard/TTAK.OT-06.0055/R4">
  <identifier>${alert.alertId}</identifier>
  <sender>urn:tta:bluecall:terminal:applet</sender>
  <sent>${new Date().toISOString()}</sent>
  <status>Actual</status>
  <msgType>Alert</msgType>
  <scope>Restricted</scope>
  <restriction>MaritimeSafetyAgencies</restriction>
  <info>
    <category>Rescue</category>
    <event>${alert.incidentType}</event>
    <urgency>${alert.urgency === 'HIGH' ? 'Immediate' : 'Expected'}</urgency>
    <severity>Severe</severity>
    <certainty>Observed</certainty>
    <headline>[해상긴급경보] ${alert.vesselName}(MMSI: ${alert.mmsi}) ${alert.incidentType} 발생</headline>
    <description>${alert.situation}. 자력항해가능: ${alert.canSelfNavigate ? 'Y' : 'N'}</description>
    <instruction>${alert.requestedAction}</instruction>
    <area>
      <areaDesc>부산 기장 대변항 동방 해역</areaDesc>
      <circle>${alert.latitude},${alert.longitude} 2.0</circle>
    </area>
    <parameter>
      <valueName>VesselMMSI</valueName>
      <value>${alert.mmsi}</value>
    </parameter>
    <parameter>
      <valueName>StandardProfile</valueName>
      <value>TTAK.OT-06.0055/R4-Profile-v1.0</value>
    </parameter>
  </info>
</alert>`;
  }

  async transmitToAgencies(
    alert: EmergencyAlert,
    onStatusUpdate: (statuses: AgencyTransmissionStatus[]) => void
  ): Promise<boolean> {
    const agencies: AgencyTransmissionStatus[] = [
      {
        agencyName: '해양경찰청 (해상종합상황실 122/VTS)',
        status: 'PENDING',
        iconName: 'ShieldAlert',
        description: 'VHF Ch.16 및 LTE-M 관제망 경보 접수처',
      },
      {
        agencyName: '어업지도선 (동해어업관리단)',
        status: 'PENDING',
        iconName: 'Anchor',
        description: '인근 수역 국유 어업지도선 긴급 구난망',
      },
      {
        agencyName: '어선안전조업국 (수협중앙회)',
        status: 'PENDING',
        iconName: 'RadioTower',
        description: '인근 조업선단 전파 및 SOS 안전통신망',
      },
    ];

    onStatusUpdate([...agencies]);
    await new Promise((res) => setTimeout(res, 400));

    // 순차 전송 시뮬레이션
    for (let i = 0; i < agencies.length; i++) {
      agencies[i].status = 'TRANSMITTING';
      onStatusUpdate([...agencies]);
      await new Promise((res) => setTimeout(res, 600));

      const now = new Date();
      agencies[i].status = 'COMPLETED';
      agencies[i].transmittedAt = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      agencies[i].ackNumber = `ACK-${Date.now().toString().slice(-4)}`;
      onStatusUpdate([...agencies]);
      await new Promise((res) => setTimeout(res, 250));
    }

    return true;
  }
}

export const emergencyAlertService = new MockEmergencyAlertService();
