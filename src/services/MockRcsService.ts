/**
 * TTAK.KO-06.0410/R9 RCS 서비스를 위한 단말과 사업자망 연동 Mock Service
 */
import { Message } from '../types';

export interface IRcsService {
  sendMessage(
    content: string,
    type?: 'TEXT' | 'LOCATION' | 'IMAGE' | 'EMERGENCY_NOTICE',
    locationData?: { lat: number; lng: number; addressDescription?: string }
  ): Promise<Message>;

  simulateIncomingReply(content: string): Promise<Message>;
}

export class MockRcsService implements IRcsService {
  async sendMessage(
    content: string,
    type: 'TEXT' | 'LOCATION' | 'IMAGE' | 'EMERGENCY_NOTICE' = 'TEXT',
    locationData?: { lat: number; lng: number; addressDescription?: string }
  ): Promise<Message> {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'my-vessel',
      senderName: '내 선박 (발신)',
      senderMmsi: '440999000',
      isMe: true,
      content,
      timestamp: timeStr,
      type,
      status: 'SENT',
      locationData,
      isUrgent: type === 'EMERGENCY_NOTICE' || content.includes('긴급') || content.includes('고장'),
    };

    return newMsg;
  }

  async simulateIncomingReply(content: string): Promise<Message> {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    return {
      id: `msg-reply-${Date.now()}`,
      senderId: 'vessel-1',
      senderName: '동해호',
      senderMmsi: '440123000',
      isMe: false,
      content,
      timestamp: timeStr,
      type: 'TEXT',
      status: 'DELIVERED',
      isUrgent: true,
    };
  }
}

export const rcsService = new MockRcsService();
