import React, { useState, useMemo } from 'react';
import {
  Search,
  PhoneCall,
  MessageSquare,
  ShieldCheck,
  Radio,
  Anchor,
  Compass,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  Info,
  ChevronDown,
  ChevronUp,
  Tag,
  Hash,
} from 'lucide-react';
import { Vessel } from '../../types';
import { MOCK_VESSELS } from '../../data/mockData';

interface HomeScreenProps {
  onStartSafeCall: (vessel: Vessel) => void;
  onOpenChat: (vessel: Vessel) => void;
  onOpenDemoTour: () => void;
  onOpenStandards: () => void;
}

// 14자리 어선번호 파싱 결과 인터페이스
interface ParsedFishingVesselNumber {
  registeredYm: string;   // 4자리 (YYMM)
  yearFull: string;       // 20YY년
  monthFull: string;      // MM월
  serialNumber: string;   // 5자리 (00144)
  serialDisplay: string;  // 144호
  agencyCode: string;     // 4자리 (1101)
  checkDigit: string;     // 1자리 (8)
  formatted: string;      // YYMM-SSSSS-AAAA-C
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartSafeCall,
  onOpenChat,
  onOpenDemoTour,
  onOpenStandards,
}) => {
  const [searchInput, setSearchInput] = useState('440123000');
  const [isSearching, setIsSearching] = useState(false);
  const [foundVessel, setFoundVessel] = useState<Vessel | null>(MOCK_VESSELS[0]);
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);
  const [showVesselNumberGuide, setShowVesselNumberGuide] = useState(false);

  // 입력된 값의 형태를 실시간 감지하여 사용자에게 가이드 제공
  const detectedType = useMemo(() => {
    const input = searchInput.trim();
    if (!input) {
      return {
        type: 'EMPTY',
        badge: '식별자 대기',
        color: 'bg-slate-800 text-slate-400 border-slate-700',
        desc: 'MMSI, 14자리 어선번호, 호출부호, 선박명을 자유롭게 입력하세요.',
      };
    }

    const cleanNum = input.replace(/[^0-9]/g, '');
    const cleanUpper = input.toUpperCase().replace(/\s+/g, '');
    const hasLetters = /[A-Z]/i.test(cleanUpper);
    const hasHangul = /[가-힣]/.test(input);

    // 1. 14자리 어선번호 (등록연월4 + 일련번호5 + 관청코드4 + 오류검색1)
    if (cleanNum.length === 14 || (cleanNum.length >= 10 && input.includes('-') && !hasLetters && !hasHangul)) {
      const ym = cleanNum.slice(0, 4);
      const serial = cleanNum.slice(4, 9);
      const agency = cleanNum.slice(9, 13);
      const check = cleanNum.slice(13, 14);

      return {
        type: 'FISHING_VESSEL_NUM',
        badge: '어선번호 (14자리 감지)',
        color: 'bg-indigo-950 text-indigo-300 border-indigo-700/80',
        desc: `등록연월(${ym || '4자리'}) · 일련번호(${serial || '5자리'}) · 관청코드(${agency || '4자리'}) · 오류검색(${check || '1자리'})`,
      };
    }

    // 2. 9자리 MMSI (숫자 9자리, 보통 440/441로 시작)
    if (/^\d{9}$/.test(cleanNum) && !hasLetters && !hasHangul) {
      return {
        type: 'MMSI',
        badge: 'MMSI (9자리 해상식별번호)',
        color: 'bg-blue-950 text-blue-300 border-blue-700/80',
        desc: 'ITU 표준 해상이동업무식별번호 (AIS · DSC · LTE-M 무선 식별)',
      };
    }

    // 3. 호출부호 (Call Sign: 영문+숫자 4~7자리, 예: DSBF2, 6L9921, HL2394, D73319)
    if (/^[A-Z0-9]{3,8}$/i.test(cleanUpper) && hasLetters && /\d/.test(cleanUpper)) {
      return {
        type: 'CALL_SIGN',
        badge: '호출부호 (Call Sign 감지)',
        color: 'bg-amber-950 text-amber-300 border-amber-700/80',
        desc: '전파법상 무선국 허가 무전통신 공식 호출명칭 (VHF 무전 ID)',
      };
    }

    // 4. 일반 선박명 또는 부분 숫자/키워드
    if (hasHangul) {
      return {
        type: 'VESSEL_NAME',
        badge: '선박명 감지',
        color: 'bg-emerald-950 text-emerald-300 border-emerald-700/80',
        desc: '선박 명칭 기반 통합 데이터베이스 검색',
      };
    }

    return {
      type: 'GENERAL',
      badge: '통합 검색어',
      color: 'bg-slate-800 text-slate-300 border-slate-700',
      desc: 'MMSI · 14자리 어선번호 · 호출부호 · 선박명 통합 조회',
    };
  }, [searchInput]);

  // 14자리 어선번호 구조 분해 헬퍼
  const parse14DigitFishingNumber = (raw: string): ParsedFishingVesselNumber | null => {
    const clean = raw.replace(/[^0-9]/g, '');
    if (clean.length < 14) return null;
    const ym = clean.slice(0, 4);
    const year = `20${ym.slice(0, 2)}`;
    const month = `${parseInt(ym.slice(2, 4), 10) || ym.slice(2, 4)}`;
    const serial = clean.slice(4, 9);
    const serialDisplay = `${parseInt(serial, 10) || serial}`;
    const agency = clean.slice(9, 13);
    const check = clean.slice(13, 14);

    return {
      registeredYm: ym,
      yearFull: year,
      monthFull: month,
      serialNumber: serial,
      serialDisplay,
      agencyCode: agency,
      checkDigit: check,
      formatted: `${ym}-${serial}-${agency}-${check}`,
    };
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchInput.trim()) return;

    setIsSearching(true);
    setSearchFeedback('AIS · 어선원부 · 무선국 허가 통합 데이터베이스 조회 중...');

    setTimeout(() => {
      const raw = searchInput.trim();
      const queryLower = raw.toLowerCase();
      const queryUpper = raw.toUpperCase().replace(/\s+/g, '');
      const cleanNum = raw.replace(/[^0-9]/g, '');

      // 1. 기존 Mock 데이터에서 MMSI, 호출부호, 14자리 어선번호, 선박명으로 일치 탐색
      const matched = MOCK_VESSELS.find((v) => {
        const vMmsi = v.mmsi.toLowerCase();
        const vCallSign = v.callSign.toUpperCase();
        const vFishNum = (v.fishingVesselNumber || '').replace(/[^0-9]/g, '');
        const vFishFormatted = (v.fishingVesselNumberFormatted || '').toLowerCase();
        const vName = v.name.toLowerCase();

        return (
          vMmsi.includes(queryLower) ||
          vCallSign.includes(queryUpper) ||
          (cleanNum.length >= 4 && vFishNum.includes(cleanNum)) ||
          vFishFormatted.includes(queryLower) ||
          vName.includes(queryLower)
        );
      });

      if (matched) {
        setFoundVessel(matched);
        setSearchFeedback(null);
      } else {
        // 2. 일치하는 항목이 없을 때 입력 유형에 맞춘 유효한 선박 정보 동적 합성
        let dynamicName = '등록 선박';
        let dynamicType = '연안복합어선 (어선)';
        let dynamicMmsi = '440119000';
        let dynamicCallSign = 'DS9920';
        let dynamicFishNum = '22040019213019';
        let dynamicFishFormatted = '2204-00192-1301-9';

        if (detectedType.type === 'FISHING_VESSEL_NUM' && cleanNum.length >= 9) {
          const padded = cleanNum.padEnd(14, '0').slice(0, 14);
          const parsed = parse14DigitFishingNumber(padded);
          dynamicFishNum = padded;
          dynamicFishFormatted = parsed?.formatted || `${padded.slice(0,4)}-${padded.slice(4,9)}-${padded.slice(9,13)}-${padded.slice(13,14)}`;
          dynamicName = `제${parsed?.serialDisplay || '102'}동양호`;
          dynamicMmsi = `440${padded.slice(-6)}`;
          dynamicCallSign = `DS${padded.slice(4, 7).toUpperCase() || 'K29'}`;
          dynamicType = '근해자망어선 (어선)';
        } else if (detectedType.type === 'CALL_SIGN') {
          dynamicCallSign = queryUpper;
          dynamicName = `해양마린호 (${queryUpper})`;
          const digits = queryUpper.replace(/[^0-9]/g, '').padEnd(4, '8');
          dynamicMmsi = `44078${digits.slice(-4)}`;
          dynamicFishNum = `21090034111017`;
          dynamicFishFormatted = `2109-00341-1101-7`;
          dynamicType = '연안통발어선 (어선)';
        } else if (detectedType.type === 'MMSI') {
          dynamicMmsi = cleanNum.padEnd(9, '0').slice(0, 9);
          dynamicName = `제3대명호 (MMSI: ${dynamicMmsi})`;
          dynamicCallSign = `DS${dynamicMmsi.slice(-3)}`;
          dynamicFishNum = `230100${dynamicMmsi.slice(-5)}11012`.slice(0, 14);
          dynamicFishFormatted = `2301-00${dynamicMmsi.slice(-5)}-1101-2`.slice(0, 19);
        } else {
          dynamicName = `${raw} (등록선박)`;
          dynamicMmsi = `440${Math.floor(100000 + Math.random() * 900000)}`;
          dynamicCallSign = `DT${Math.floor(1000 + Math.random() * 9000)}`;
        }

        const dynamicVessel: Vessel = {
          id: `vessel-${Date.now()}`,
          name: dynamicName,
          mmsi: dynamicMmsi,
          callSign: dynamicCallSign,
          fishingVesselNumber: dynamicFishNum,
          fishingVesselNumberFormatted: dynamicFishFormatted,
          vesselNumber: dynamicFishFormatted,
          type: dynamicType,
          tonnage: '9.77톤',
          status: 'ONLINE',
          maskedNumber: `050-XXXX-${dynamicMmsi.slice(-4)}`,
          latitude: 35.1028,
          longitude: 129.0403,
          port: '부산 기장 대변항',
          captainNameMasked: '선장 *',
        };
        setFoundVessel(dynamicVessel);
        setSearchFeedback(null);
      }
      setIsSearching(false);
    }, 600);
  };

  const parsedCurrentVessel = foundVessel?.fishingVesselNumber
    ? parse14DigitFishingNumber(foundVessel.fishingVesselNumber)
    : null;

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-slate-950 text-slate-100">
      {/* 1. 상단 통신망 상태 배너 */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-sm font-semibold text-emerald-400 whitespace-nowrap">
            해상통신 서비스 이용 가능
          </span>
        </div>
        <span className="text-xs text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700 font-mono whitespace-nowrap">
          LTE-M / VoLTE 정상
        </span>
      </div>

      {/* 2. 메인 서비스 안내 배너 */}
      <div className="bg-gradient-to-r from-blue-900/90 via-indigo-900/90 to-blue-950 border border-blue-600/50 rounded-2xl p-4 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-3 -translate-y-3 opacity-10 pointer-events-none">
          <Compass className="w-32 h-32 text-blue-300" />
        </div>
        <div className="relative z-10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="bg-blue-500/20 text-blue-300 border border-blue-400/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 whitespace-nowrap">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              해상 안심 통신
            </span>
            <span className="text-[11px] text-blue-300 font-mono bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-700 whitespace-nowrap">
              통합 선박 식별 연동
            </span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            상대 선박 번호를 몰라도 고유 식별자로 즉시 안심 연결
          </h2>
          <p className="text-xs text-blue-200 leading-relaxed">
            전화번호 노출 없이 <strong>MMSI(9자리)</strong>, <strong>14자리 어선번호</strong>, <strong>호출부호(Call Sign)</strong>로 직접 연결하고, 긴급상황 발생 시 AI 분석을 거쳐 표준 경보로 관계기관에 자동 전파되는 스마트 해상 통신을 제공합니다.
          </p>
          <div className="pt-1">
            <button
              id="start-demo-scenario-btn"
              type="button"
              onClick={onOpenDemoTour}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 active:scale-[0.98] text-slate-950 font-bold py-2.5 px-3 rounded-xl shadow text-xs flex items-center justify-center gap-1.5 transition-all whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>시연 시나리오 가이드 보기</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. 통합 다중 식별자 검색 박스 (MMSI · 14자리 어선번호 · 호출부호 · 선박명) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-3.5">
        <div className="flex items-center justify-between">
          <label htmlFor="vessel-search-input" className="text-sm font-bold text-slate-200 flex items-center gap-1.5 whitespace-nowrap">
            <Radio className="w-4 h-4 text-blue-400" />
            통합 선박 식별 조회
          </label>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all whitespace-nowrap ${detectedType.color}`}>
            {detectedType.badge}
          </span>
        </div>

        <form onSubmit={handleSearch} className="space-y-2.5">
          <div className="relative">
            <input
              id="vessel-search-input"
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="MMSI, 14자리 어선번호, 호출부호, 선박명 입력"
              className="w-full bg-slate-950 border-2 border-blue-500/50 focus:border-blue-400 rounded-xl px-4 py-3 text-base font-mono font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all shadow-inner"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs bg-slate-800 px-2 py-1 rounded"
              >
                지우기
              </button>
            )}
          </div>

          {/* 실시간 감지 안내 문구 */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span className="truncate">{detectedType.desc}</span>
            <button
              type="button"
              onClick={() => setShowVesselNumberGuide(!showVesselNumberGuide)}
              className="text-blue-400 hover:text-blue-300 underline font-medium flex items-center gap-0.5 shrink-0 ml-2"
            >
              <Info className="w-3 h-3" />
              <span>14자리 어선번호 체계</span>
            </button>
          </div>

          {/* 14자리 어선번호 구성 설명 아코디언 */}
          {showVesselNumberGuide && (
            <div className="bg-slate-950 p-3 rounded-xl border border-indigo-900/60 text-xs space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                <span className="font-bold text-indigo-300 flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5" />
                  14자리 어선번호 구성 기준 (어선법)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">YYMM-SSSSS-AAAA-C</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-900/90 p-2 rounded border border-slate-800">
                  <span className="text-slate-400 block font-semibold">① 등록연월 (4자리)</span>
                  <span className="text-slate-200">등록 연도 2자리 + 월 2자리 (예: 2105 = 2021년 5월)</span>
                </div>
                <div className="bg-slate-900/90 p-2 rounded border border-slate-800">
                  <span className="text-slate-400 block font-semibold">② 일련번호 (5자리)</span>
                  <span className="text-slate-200">해당 연월 등록 순번 (예: 00144 = 144호)</span>
                </div>
                <div className="bg-slate-900/90 p-2 rounded border border-slate-800">
                  <span className="text-slate-400 block font-semibold">③ 등록기관 분류 (4자리)</span>
                  <span className="text-slate-200">관할 지자체/시도 행정코드 (예: 1101 = 부산 기장)</span>
                </div>
                <div className="bg-slate-900/90 p-2 rounded border border-slate-800">
                  <span className="text-slate-400 block font-semibold">④ 오류검색번호 (1자리)</span>
                  <span className="text-slate-200">전산 무결성 체크디지트 (예: 8)</span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Selection Pills with Diverse Identifiers */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-medium">식별자별 빠른 입력 테스트:</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
              {/* MMSI 버튼 */}
              <button
                type="button"
                onClick={() => {
                  setSearchInput(MOCK_VESSELS[0].mmsi);
                  setFoundVessel(MOCK_VESSELS[0]);
                }}
                className={`p-2 rounded-xl border text-left transition-all ${
                  searchInput === MOCK_VESSELS[0].mmsi
                    ? 'bg-blue-900/40 border-blue-400 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span className="text-[10px] text-blue-400 font-bold block">MMSI (9자리)</span>
                <span className="font-mono text-xs font-bold block">440123000</span>
                <span className="text-[10px] text-slate-400 block truncate">동해호</span>
              </button>

              {/* 어선번호 14자리 버튼 */}
              <button
                type="button"
                onClick={() => {
                  setSearchInput(MOCK_VESSELS[0].fishingVesselNumberFormatted);
                  setFoundVessel(MOCK_VESSELS[0]);
                }}
                className={`p-2 rounded-xl border text-left transition-all ${
                  searchInput === MOCK_VESSELS[0].fishingVesselNumberFormatted
                    ? 'bg-indigo-900/40 border-indigo-400 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span className="text-[10px] text-indigo-400 font-bold block">어선번호 (14자리)</span>
                <span className="font-mono text-[11px] font-bold block truncate">2105-00144..</span>
                <span className="text-[10px] text-slate-400 block truncate">동해호</span>
              </button>

              {/* 호출부호 버튼 */}
              <button
                type="button"
                onClick={() => {
                  setSearchInput(MOCK_VESSELS[0].callSign);
                  setFoundVessel(MOCK_VESSELS[0]);
                }}
                className={`p-2 rounded-xl border text-left transition-all ${
                  searchInput === MOCK_VESSELS[0].callSign
                    ? 'bg-amber-900/40 border-amber-400 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span className="text-[10px] text-amber-400 font-bold block">호출부호 (Call Sign)</span>
                <span className="font-mono text-xs font-bold block">DSBF2</span>
                <span className="text-[10px] text-slate-400 block truncate">동해호</span>
              </button>

              {/* 선박명 버튼 */}
              <button
                type="button"
                onClick={() => {
                  setSearchInput(MOCK_VESSELS[1].name);
                  setFoundVessel(MOCK_VESSELS[1]);
                }}
                className={`p-2 rounded-xl border text-left transition-all ${
                  searchInput === MOCK_VESSELS[1].name
                    ? 'bg-emerald-900/40 border-emerald-400 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span className="text-[10px] text-emerald-400 font-bold block">선박명 (한라호)</span>
                <span className="font-mono text-xs font-bold block">6L9921 / 24톤</span>
                <span className="text-[10px] text-slate-400 block truncate">제주 한림항</span>
              </button>
            </div>
          </div>

          <button
            id="vessel-search-btn"
            type="submit"
            disabled={isSearching || !searchInput}
            className="w-full bg-blue-600 hover:bg-blue-500 active:scale-[0.98] disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-3 px-4 rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {isSearching ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>식별 데이터베이스 조회 중...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>선박 식별 조회</span>
              </>
            )}
          </button>
        </form>

        {searchFeedback && (
          <p className="text-xs text-blue-400 animate-pulse text-center">{searchFeedback}</p>
        )}
      </div>

      {/* 4. 조회된 선박 상세 결과 카드 */}
      {foundVessel && (
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-blue-500/40 rounded-2xl p-4 shadow-xl space-y-3.5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <Anchor className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-white">{foundVessel.name}</h3>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 whitespace-nowrap">
                    <CheckCircle2 className="w-3 h-3" />
                    연결 가능
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-mono font-medium">
                  MMSI: <strong className="text-blue-300 font-bold">{foundVessel.mmsi}</strong> · 호출부호: <strong className="text-amber-300 font-bold">{foundVessel.callSign}</strong>
                </p>
              </div>
            </div>
            <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded-md border border-slate-700 font-medium whitespace-nowrap">
              {foundVessel.type.split(' ')[0]}
            </span>
          </div>

          {/* 선박 식별 체계 상세 그리드 */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2.5 text-xs">
            {/* 14자리 어선번호 상세 */}
            <div className="space-y-1 pb-2 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[11px] font-semibold flex items-center gap-1">
                  <Hash className="w-3 h-3 text-indigo-400" />
                  14자리 어선번호
                </span>
                <span className="font-mono text-indigo-300 font-bold text-xs bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/60">
                  {foundVessel.fishingVesselNumberFormatted || foundVessel.vesselNumber}
                </span>
              </div>
              {parsedCurrentVessel && (
                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono overflow-x-auto pt-0.5">
                  <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-slate-300 whitespace-nowrap">
                    등록: {parsedCurrentVessel.yearFull}년 {parsedCurrentVessel.monthFull}
                  </span>
                  <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-slate-300 whitespace-nowrap">
                    순번: {parsedCurrentVessel.serialDisplay}호
                  </span>
                  <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-slate-300 whitespace-nowrap">
                    관청: {parsedCurrentVessel.agencyCode}
                  </span>
                  <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-slate-300 whitespace-nowrap">
                    검증: {parsedCurrentVessel.checkDigit}
                  </span>
                </div>
              )}
            </div>

            {/* 선박 제원 및 모항 */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">선종 / 톤수</span>
                <span className="text-slate-200 font-medium">{foundVessel.type} ({foundVessel.tonnage})</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">선적항 (모항)</span>
                <span className="text-slate-200 font-medium">{foundVessel.port}</span>
              </div>
            </div>

            {/* 안심번호 매핑 정보 */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 text-[11px] flex items-center gap-1 whitespace-nowrap">
                <Lock className="w-3 h-3 text-amber-400" />
                실제 번호 비공개 보호:
              </span>
              <span className="font-mono font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-700/50 whitespace-nowrap">
                안심번호 {foundVessel.maskedNumber}
              </span>
            </div>
          </div>

          {/* Action Buttons: 안심통화 연결 & 메시지 보내기 */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              id="safe-call-connect-btn"
              type="button"
              onClick={() => onStartSafeCall(foundVessel)}
              className="bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold py-3 px-3 rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <PhoneCall className="w-4 h-4 shrink-0" />
              <span>안심통화 연결</span>
            </button>

            <button
              id="send-rcs-message-btn"
              type="button"
              onClick={() => onOpenChat(foundVessel)}
              className="bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-bold py-3 px-3 rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span>메시지 보내기</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. 공공 해양안전 통신망 지원 배너 */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-slate-300">
          <p className="font-semibold text-slate-200">
            공공 해양안전 통신망 연계 지원
          </p>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Blue Call은 MMSI, 어선번호, 호출부호 등 다양한 해상 식별 체계를 통합 연계하여 긴급상황 발생 시 정확한 선박 정보와 위치를 관계기관에 신속히 전파합니다.
          </p>
        </div>
      </div>
    </div>
  );
};

