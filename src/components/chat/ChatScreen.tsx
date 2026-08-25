import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Send,
  MapPin,
  Image as ImageIcon,
  Bot,
  AlertTriangle,
  Radio,
  Lock,
  Compass,
  CheckCheck,
  Check,
  PhoneCall,
  Sparkles,
  ShieldCheck,
  Navigation,
} from 'lucide-react';
import { Vessel, Message } from '../../types';
import { INITIAL_MESSAGES, MOCK_VESSELS } from '../../data/mockData';
import { rcsService } from '../../services/MockRcsService';
import { StandardBadge } from '../common/StandardBadge';

interface ChatScreenProps {
  vessel?: Vessel;
  onStartSafeCall: (vessel: Vessel) => void;
  onAnalyzeMessage: (content: string, vessel: Vessel) => void;
  onOpenStandards: () => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  vessel = MOCK_VESSELS[0],
  onStartSafeCall,
  onAnalyzeMessage,
  onOpenStandards,
}) => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const textToSend = inputText.trim();
    setInputText('');
    setIsSending(true);

    const sentMsg = await rcsService.sendMessage(textToSend);
    setMessages((prev) => [...prev, sentMsg]);
    setIsSending(false);

    // Simulated vessel automatic smart echo reply if relevant
    if (textToSend.includes('상태') || textToSend.includes('어때') || textToSend.includes('상황')) {
      setTimeout(async () => {
        const reply = await rcsService.simulateIncomingReply(
          '주기관 실린더 압축 압력 저하로 시동이 꺼졌습니다. 예인선 또는 해경 지원이 시급합니다.'
        );
        setMessages((prev) => [...prev, reply]);
      }, 1000);
    }
  };

  const handleSendLocation = async () => {
    const locMsg = await rcsService.sendMessage(
      '내 선박 실시간 위치를 공유합니다.',
      'LOCATION',
      {
        lat: 35.1980,
        lng: 129.2150,
        addressDescription: '부산 기장 대변항 인근 해역 (접근 중)',
      }
    );
    setMessages((prev) => [...prev, locMsg]);
  };

  const handleSendImage = async () => {
    const imgMsg = await rcsService.sendMessage(
      '해상 상황 및 기관실 상태 사진을 전송했습니다.',
      'IMAGE'
    );
    setMessages((prev) => [...prev, imgMsg]);
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden">
      {/* Top Vessel Chat Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between shadow-md select-none shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
            {vessel.name.slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-black text-sm text-white">{vessel.name}</h2>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-1.5 py-0.2 rounded border border-emerald-500/40">
                RCS 온라인
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
              <span>MMSI: {vessel.mmsi}</span>
              <span className="text-amber-400 font-semibold">{vessel.maskedNumber}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onStartSafeCall(vessel)}
            className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow transition-all active:scale-95 flex items-center gap-1 text-xs font-semibold"
            title="안심통화"
          >
            <PhoneCall className="w-4 h-4" />
            <span className="hidden sm:inline">통화</span>
          </button>
        </div>
      </div>

      {/* RCS Chat Mode Sub-Header */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-1.5 flex items-center justify-between text-xs select-none">
        <span className="text-[11px] text-blue-300 flex items-center gap-1.5 font-medium whitespace-nowrap">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          해상 안심 메시징 채널 (RCS) · 종단간 보호
        </span>
        <span className="text-[10px] text-slate-400 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800 whitespace-nowrap">
          LTE-M 연결됨
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Date Divider */}
        <div className="flex items-center justify-center my-1">
          <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-3 py-1 rounded-full font-mono">
            2026년 8월 24일 (해상 LTE-M 채널 암호화)
          </span>
        </div>

        {messages.map((msg) => {
          const isUrgentMsg = msg.isUrgent || msg.content.includes('기관 고장');

          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
            >
              {!msg.isMe && (
                <span className="text-[11px] text-slate-400 font-medium ml-1 mb-1 flex items-center gap-1">
                  <span>{msg.senderName}</span>
                  <span className="text-[10px] text-slate-500 font-mono">({msg.senderMmsi.slice(-4)})</span>
                </span>
              )}

              <div
                className={`max-w-[85%] sm:max-w-md rounded-2xl p-3 shadow-md relative ${
                  msg.isMe
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : isUrgentMsg
                    ? 'bg-slate-900 border-2 border-red-500/60 text-slate-100 rounded-bl-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-bl-none'
                }`}
              >
                {/* Urgent message tag */}
                {isUrgentMsg && !msg.isMe && (
                  <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-red-500/30">
                    <span className="text-[10px] font-bold text-red-400 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-red-400 animate-pulse" />
                      긴급 상황 감지
                    </span>
                    <span className="text-[9px] bg-red-950 text-red-300 px-1.5 py-0.5 rounded border border-red-800">
                      RCS High Priority
                    </span>
                  </div>
                )}

                {/* Message Content according to Type */}
                {msg.type === 'LOCATION' && msg.locationData ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                      <MapPin className="w-4 h-4" />
                      <span>실시간 GPS 위치 공유</span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 font-mono text-xs text-slate-200">
                      <div className="text-blue-300 font-bold">
                        위도 {msg.locationData.lat.toFixed(4)} N / 경도 {msg.locationData.lng.toFixed(4)} E
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {msg.locationData.addressDescription || '부산 기장 대변항 동방 해역'}
                      </div>
                    </div>
                    <div className="h-20 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center text-xs text-slate-500 relative overflow-hidden">
                      <div className="absolute inset-0 bg-radial from-blue-900/30 to-slate-950 flex items-center justify-center">
                        <Navigation className="w-6 h-6 text-blue-400 animate-bounce" />
                      </div>
                      <span className="relative z-10 text-[10px] text-slate-400 font-mono bg-slate-950/80 px-2 py-0.5 rounded">
                        전자해도(ENC) 위치 표시 완료
                      </span>
                    </div>
                  </div>
                ) : msg.type === 'IMAGE' ? (
                  <div className="space-y-1.5">
                    <div className="h-32 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-slate-400 text-xs">
                      <ImageIcon className="w-8 h-8 text-blue-400 mb-1" />
                      <span>해상 기관실 상황 이미지 (고화질 RCS)</span>
                    </div>
                    <p className="text-xs">{msg.content}</p>
                  </div>
                ) : (
                  <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                )}

                {/* AI Analysis Quick Button if this is an urgent message from other vessel */}
                {!msg.isMe && (
                  <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500">
                      길게 누르거나 버튼 클릭
                    </span>
                    <button
                      id={`ai-analyze-msg-${msg.id}`}
                      type="button"
                      onClick={() => onAnalyzeMessage(msg.content, vessel)}
                      className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs px-2.5 py-1 rounded-lg shadow flex items-center gap-1 active:scale-95 transition-all"
                    >
                      <Bot className="w-3.5 h-3.5 text-yellow-300" />
                      <span>AI 분석</span>
                    </button>
                  </div>
                )}

                {/* Timestamp & Status */}
                <div className={`flex items-center gap-1 text-[10px] mt-1.5 ${msg.isMe ? 'text-blue-200 justify-end' : 'text-slate-400 justify-end'}`}>
                  <span>{msg.timestamp}</span>
                  {msg.isMe && (
                    <span>
                      {msg.status === 'READ' ? (
                        <CheckCheck className="w-3.5 h-3.5 text-blue-200" />
                      ) : (
                        <Check className="w-3.5 h-3.5 text-blue-200" />
                      )}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Attachment Bar & Input Box */}
      <div className="bg-slate-900 border-t border-slate-800 p-3 space-y-2 select-none shrink-0">
        {/* RCS Rich Buttons (Location, Image, Emergency) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            type="button"
            onClick={handleSendLocation}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1.5 font-medium shrink-0 active:scale-95 transition-all"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>위치 공유</span>
          </button>

          <button
            type="button"
            onClick={handleSendImage}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1.5 font-medium shrink-0 active:scale-95 transition-all"
          >
            <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
            <span>사진 전송</span>
          </button>

          <button
            type="button"
            onClick={() => onAnalyzeMessage('기관 고장입니다. 추진이 안 됩니다.', vessel)}
            className="bg-amber-950/70 border border-amber-500/50 hover:bg-amber-900/80 text-amber-300 px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-bold shrink-0 active:scale-95 transition-all ml-auto"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI 긴급분석 바로가기</span>
          </button>
        </div>

        {/* Text Input Form */}
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="RCS 메시지 입력 (긴급상황, 위치, 상태)..."
            className="flex-1 bg-slate-950 border border-slate-700 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            id="chat-send-btn"
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="bg-blue-600 hover:bg-blue-500 active:scale-95 disabled:bg-slate-800 disabled:text-slate-500 text-white p-2.5 rounded-xl transition-all shadow"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
