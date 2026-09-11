import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Printer,
  Copy,
  Check,
  Edit3,
  Eye,
  Sparkles,
  Target,
  BookOpen,
  HelpCircle,
  Lightbulb,
  Smile,
  Compass,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Award,
  Layers,
  Heart,
  Brain,
  Palette,
  Info,
  GraduationCap
} from 'lucide-react';
import { ModulAjarData } from '../types';

interface LkpdViewerProps {
  content: string;
  modulData: ModulAjarData;
  onChangeContent?: (newContent: string) => void;
  isEditable?: boolean;
  onPrint?: () => void;
  compact?: boolean;
}

export const LkpdViewer: React.FC<LkpdViewerProps> = ({
  content,
  modulData,
  onChangeContent,
  isEditable = true,
  onPrint,
  compact = false,
}) => {
  const [viewMode, setViewMode] = useState<'visual' | 'text'>('visual');
  const [showInfografis, setShowInfografis] = useState<boolean>(true);
  const [infografisStyle, setInfografisStyle] = useState<'alur' | 'peta_konsep' | 'lengkap'>('lengkap');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [showRubrik, setShowRubrik] = useState<boolean>(true);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handlePrintLkpd = () => {
    if (onPrint) {
      onPrint();
      return;
    }
    window.print();
  };

  // Helper parser for structured visual sections from the markdown / raw LKPD text
  const parseLkpdSections = (rawText: string) => {
    const lines = rawText.split('\n');
    let currentSection: string = 'header';
    const sections: Record<string, string[]> = {
      header: [],
      identitas: [],
      tujuan: [],
      alatBahan: [],
      petunjuk: [],
      stimulus: [],
      aktivitas: [],
      refleksi: [],
      kunciRubrik: [],
      lainnya: [],
    };

    lines.forEach((line) => {
      const trimmed = line.trim();
      const upper = trimmed.toUpperCase();

      if (upper.includes('A. IDENTITAS') || upper.includes('IDENTITAS SISWA')) {
        currentSection = 'identitas';
      } else if (upper.includes('B. TUJUAN') || upper.includes('TUJUAN PEMBELAJARAN') || upper.includes('TUJUAN KEGIATAN')) {
        currentSection = 'tujuan';
      } else if (upper.includes('C. ALAT') || upper.includes('ALAT DAN BAHAN') || upper.includes('ALAT & BAHAN')) {
        currentSection = 'alatBahan';
      } else if (upper.includes('D. PETUNJUK') || upper.includes('PETUNJUK PENGERJAAN')) {
        currentSection = 'petunjuk';
      } else if (upper.includes('E. STIMULUS') || upper.includes('STIMULUS KONTEKSTUAL') || upper.includes('BACALAH DENGAN TELITI')) {
        currentSection = 'stimulus';
      } else if (upper.includes('F. AKTIVITAS') || upper.includes('AKTIVITAS UTAMA') || upper.includes('LEMBAR SOAL') || upper.includes('TUGAS 1')) {
        currentSection = 'aktivitas';
      } else if (upper.includes('G. REFLEKSI') || upper.includes('REFLEKSI DIRI') || upper.includes('REFLEKSI SAYA')) {
        currentSection = 'refleksi';
      } else if (upper.includes('H. KUNCI') || upper.includes('KUNCI JAWABAN') || upper.includes('RUBRIK PENILAIAN')) {
        currentSection = 'kunciRubrik';
      } else {
        if (sections[currentSection]) {
          sections[currentSection].push(line);
        } else {
          sections.lainnya.push(line);
        }
      }
    });

    return sections;
  };

  const parsed = parseLkpdSections(content);

  // Extract title if available
  const findTitle = () => {
    const allLines = content.split('\n');
    for (const l of allLines) {
      const trimmed = l.trim();
      if (trimmed.toLowerCase().startsWith('judul kegiatan') || trimmed.toLowerCase().startsWith('tema /')) {
        return trimmed.replace(/^judul kegiatan\s*[:=]\s*/i, '').replace(/["']/g, '');
      }
    }
    return modulData.topikPembelajaran || modulData.temaSubtema || 'Eksplorasi Pembelajaran Mendalam';
  };

  const lkpdTitle = findTitle();

  return (
    <div className="lkpd-container w-full bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col transition-all">
      {/* Action Header & Visual Toolbar (Hidden during browser print) */}
      <div className="print:hidden px-4 py-3 bg-gradient-to-r from-emerald-50 via-teal-50/40 to-slate-50 border-b border-emerald-100 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-600 text-white shadow-2xs">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              Lembar Kerja Peserta Didik (LKPD)
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Format Rapi & Interaktif
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              {modulData.temaSubtema} • {modulData.kelas} (Fase {modulData.fase})
            </p>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
          {/* Visual vs Text Mode Toggle */}
          <div className="inline-flex rounded-lg p-0.5 bg-slate-200/70 border border-slate-300/60 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('visual')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                viewMode === 'visual'
                  ? 'bg-white text-emerald-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Desain Visual</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('text')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                viewMode === 'text'
                  ? 'bg-white text-emerald-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Teks / Editor</span>
            </button>
          </div>

          {/* Infographic Options (Only shown in visual mode) */}
          {viewMode === 'visual' && (
            <div className="flex items-center gap-1.5 bg-white/80 px-2 py-1 rounded-lg border border-slate-200 text-xs text-slate-700">
              <label className="flex items-center gap-1 cursor-pointer font-medium select-none">
                <input
                  type="checkbox"
                  checked={showInfografis}
                  onChange={(e) => setShowInfografis(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 cursor-pointer"
                />
                <span className="text-[11.5px] font-semibold text-emerald-900 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Infografis
                </span>
              </label>

              {showInfografis && (
                <select
                  value={infografisStyle}
                  onChange={(e) => setInfografisStyle(e.target.value as any)}
                  className="text-[11px] font-medium bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  title="Pilih jenis infografis pembelajaran"
                >
                  <option value="lengkap">Lengkap (Alur + Peta)</option>
                  <option value="alur">Alur Belajar Deep Learning</option>
                  <option value="peta_konsep">Peta Konsep & Misi</option>
                </select>
              )}
            </div>
          )}

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-all shadow-2xs cursor-pointer"
            title="Salin seluruh isi teks LKPD"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Tersalin</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Salin</span>
              </>
            )}
          </button>

          {/* Print Button */}
          <button
            type="button"
            onClick={handlePrintLkpd}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white transition-all shadow-2xs cursor-pointer"
            title="Cetak khusus halaman LKPD siap dibagikan ke siswa"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-100" />
            <span>Cetak LKPD</span>
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="p-4 sm:p-6 md:p-8 bg-slate-50/50">
        {viewMode === 'text' ? (
          /* Text / Editor Mode */
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="font-mono text-[11px]">
                {content.split(/\s+/).filter(Boolean).length} kata • Anda dapat menyunting kalimat atau soal langsung di bawah ini:
              </span>
            </div>
            <textarea
              rows={22}
              value={content}
              onChange={(e) => onChangeContent && onChangeContent(e.target.value)}
              readOnly={!isEditable}
              className="w-full font-mono text-xs leading-relaxed rounded-xl border border-slate-300 p-4 text-slate-900 bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none resize-y shadow-inner"
              placeholder="Isi teks LKPD..."
            />
          </div>
        ) : (
          /* Visual Design & Print Ready Mode */
          <div className="lkpd-printable-sheet max-w-[210mm] mx-auto bg-white rounded-xl shadow-md border border-slate-200/90 p-6 sm:p-8 md:p-10 font-sans text-slate-800 space-y-6 print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none">
            
            {/* 1. KOP LEMBAR KERJA PESERTA DIDIK */}
            <div className="border-b-2 border-slate-900 pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-bold text-lg shadow-sm flex-shrink-0">
                    <GraduationCap className="w-7 h-7" />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">
                      Kurikulum Merdeka Kemendikbudristek RI
                    </h5>
                    <h2 className="text-base sm:text-lg font-black text-slate-950 tracking-tight leading-tight">
                      LEMBAR KERJA PESERTA DIDIK (LKPD)
                    </h2>
                    <p className="text-xs font-semibold text-emerald-800">
                      {modulData.namaSekolah || 'SDN 3 Purwosari'} • Tahun Ajaran {new Date().getFullYear()}/{new Date().getFullYear() + 1}
                    </p>
                  </div>
                </div>

                {/* Score & Stamp Box for Teacher */}
                <div className="hidden sm:flex flex-col items-center justify-center w-24 h-20 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50 p-1 text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Nilai & Paraf</span>
                  <div className="flex-1 flex items-center justify-center text-xs text-slate-300 font-mono">
                    [ Skor ]
                  </div>
                </div>
              </div>

              {/* Activity Subtitle */}
              <div className="mt-3.5 py-2 px-3.5 rounded-lg bg-emerald-50/80 border border-emerald-200/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="text-xs font-bold text-emerald-950">
                    Misi Kegiatan: <span className="underline decoration-emerald-400">{lkpdTitle}</span>
                  </span>
                </div>
                <span className="text-[11px] font-medium text-emerald-800 bg-white/80 px-2.5 py-0.5 rounded-md border border-emerald-200">
                  {modulData.alokasiWaktu || '2 x 35 Menit'}
                </span>
              </div>
            </div>

            {/* 2. TABEL IDENTITAS SISWA */}
            <div className="bg-slate-50/70 rounded-xl border border-slate-200/90 p-3.5 sm:p-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                <div className="flex items-center">
                  <span className="w-28 font-semibold text-slate-600 flex-shrink-0">Nama Siswa/Kelompok:</span>
                  <div className="flex-1 border-b border-dotted border-slate-400 min-h-[22px]" />
                </div>
                <div className="flex items-center">
                  <span className="w-24 font-semibold text-slate-600 flex-shrink-0">Kelas / Fase:</span>
                  <span className="font-bold text-slate-900">{modulData.kelas || 'Kelas 1'} (Fase {modulData.fase || 'A'})</span>
                </div>
                <div className="flex items-center">
                  <span className="w-28 font-semibold text-slate-600 flex-shrink-0">Nomor Absen:</span>
                  <div className="w-24 border-b border-dotted border-slate-400 min-h-[22px]" />
                </div>
                <div className="flex items-center">
                  <span className="w-24 font-semibold text-slate-600 flex-shrink-0">Hari / Tanggal:</span>
                  <div className="flex-1 border-b border-dotted border-slate-400 min-h-[22px]" />
                </div>
              </div>
            </div>

            {/* 3. INFOGRAFIS PEMBELAJARAN (VISUAL LEARNING INFOGRAPHIC) */}
            {showInfografis && (
              <div className="infografis-wrapper space-y-3.5 my-4 pt-1">
                {/* Infografis 1: Alur Belajar Deep Learning */}
                {(infografisStyle === 'alur' || infografisStyle === 'lengkap') && (
                  <div className="p-4 rounded-xl bg-gradient-to-br from-teal-900 via-emerald-900 to-slate-900 text-white shadow-sm border border-emerald-800/80">
                    <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-emerald-700/50">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
                          <Compass className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold tracking-wide uppercase text-emerald-300">
                            Infografis Alur Belajar Deep Learning
                          </h4>
                          <p className="text-[10px] text-emerald-100/70">
                            Petualangan 4 Langkah Belajar Bermakna, Berkesadaran & Menyenangkan
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
                        Mindful • Meaningful • Joyful
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                      {/* Step 1 */}
                      <div className="p-2.5 rounded-lg bg-white/10 backdrop-blur-xs border border-white/10 flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-bold text-amber-300 uppercase">Langkah 1</span>
                          <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center text-[10px] font-bold">1</span>
                        </div>
                        <div className="font-bold text-xs text-white flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
                          <span>Amati & Sadari</span>
                        </div>
                        <p className="text-[10.5px] text-slate-200 mt-1 leading-tight">
                          Amati fenomena & stimulus pemantik dengan teliti dan penuh rasa ingin tahu.
                        </p>
                      </div>

                      {/* Step 2 */}
                      <div className="p-2.5 rounded-lg bg-white/10 backdrop-blur-xs border border-white/10 flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-bold text-cyan-300 uppercase">Langkah 2</span>
                          <span className="w-5 h-5 rounded-full bg-cyan-400/20 text-cyan-300 flex items-center justify-center text-[10px] font-bold">2</span>
                        </div>
                        <div className="font-bold text-xs text-white flex items-center gap-1.5">
                          <Brain className="w-3.5 h-3.5 text-cyan-300 flex-shrink-0" />
                          <span>Jelajahi Konsep</span>
                        </div>
                        <p className="text-[10.5px] text-slate-200 mt-1 leading-tight">
                          Diskusikan ide bersama teman & kaitkan ilmu dengan pengalaman nyata.
                        </p>
                      </div>

                      {/* Step 3 */}
                      <div className="p-2.5 rounded-lg bg-white/10 backdrop-blur-xs border border-white/10 flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-bold text-emerald-300 uppercase">Langkah 3</span>
                          <span className="w-5 h-5 rounded-full bg-emerald-400/20 text-emerald-300 flex items-center justify-center text-[10px] font-bold">3</span>
                        </div>
                        <div className="font-bold text-xs text-white flex items-center gap-1.5">
                          <Palette className="w-3.5 h-3.5 text-emerald-300 flex-shrink-0" />
                          <span>Bernalar & Kreasi</span>
                        </div>
                        <p className="text-[10.5px] text-slate-200 mt-1 leading-tight">
                          Selesaikan tantangan soal, uji daya nalarmu, dan buat kreasi karyamu!
                        </p>
                      </div>

                      {/* Step 4 */}
                      <div className="p-2.5 rounded-lg bg-white/10 backdrop-blur-xs border border-white/10 flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-bold text-rose-300 uppercase">Langkah 4</span>
                          <span className="w-5 h-5 rounded-full bg-rose-400/20 text-rose-300 flex items-center justify-center text-[10px] font-bold">4</span>
                        </div>
                        <div className="font-bold text-xs text-white flex items-center gap-1.5">
                          <Heart className="w-3.5 h-3.5 text-rose-300 flex-shrink-0" />
                          <span>Refleksi Diri</span>
                        </div>
                        <p className="text-[10.5px] text-slate-200 mt-1 leading-tight">
                          Ungkapkan perasaanmu dan terapkan nilai positif dalam keseharian.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Infografis 2: Peta Konsep & Misi Belajar Siswa */}
                {(infografisStyle === 'peta_konsep' || infografisStyle === 'lengkap') && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                    {/* Card 1: Fokus Misi */}
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/90 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs mb-1">
                          <Target className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Misi Utama Siswa</span>
                        </div>
                        <p className="text-[11px] text-slate-700 leading-relaxed">
                          {modulData.tujuanPembelajaran || 'Memahami dan mempraktikkan konsep materi secara aktif dan mendalam.'}
                        </p>
                      </div>
                      <div className="mt-2 pt-1.5 border-t border-emerald-200/60 text-[10px] font-semibold text-emerald-800">
                        Topik: {modulData.topikPembelajaran || modulData.temaSubtema}
                      </div>
                    </div>

                    {/* Card 2: Karakter Profil Pelajar Pancasila */}
                    <div className="p-3 rounded-xl bg-sky-50 border border-sky-200/90 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-sky-800 font-bold text-xs mb-1">
                          <Award className="w-3.5 h-3.5 text-sky-600" />
                          <span>Karakter Pelajar Pancasila</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {(modulData.dimensiProfilLulusan && modulData.dimensiProfilLulusan.length > 0
                            ? modulData.dimensiProfilLulusan
                            : ['Bernalar Kritis', 'Mandiri', 'Gotong Royong']
                          ).map((dimensi, idx) => (
                            <span
                              key={idx}
                              className="inline-block px-2 py-0.5 rounded-md bg-white border border-sky-200 text-[10.5px] font-medium text-sky-900 shadow-2xs"
                            >
                              ✓ {dimensi}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="mt-2 pt-1.5 border-t border-sky-200/60 text-[10px] text-sky-700 font-medium">
                        Model: {modulData.modelPembelajaran || 'Deep Learning / PBL'}
                      </div>
                    </div>

                    {/* Card 3: Tips Siswa Hebat */}
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/90 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs mb-1">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                          <span>Tips Sukses Mengerjakan</span>
                        </div>
                        <p className="text-[11px] text-slate-700 leading-relaxed">
                          Baca soal dengan teliti, diskusikan dengan sopan, dan jangan takut bertanya jika ada hal yang membingungkan!
                        </p>
                      </div>
                      <div className="mt-2 pt-1.5 border-t border-amber-200/60 text-[10px] font-semibold text-amber-800 flex items-center gap-1">
                        <span>💡 Kejujuran & Semangat adalah Kunci</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. TUJUAN & PETUNJUK PENGERJAAN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Tujuan */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-2">
                  <Target className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tujuan Pembelajaran:</span>
                </h4>
                {parsed.tujuan.length > 0 ? (
                  <div className="text-xs text-slate-700 space-y-1">
                    {parsed.tujuan
                      .filter((l) => l.trim() && !l.includes('---'))
                      .map((line, idx) => (
                        <p key={idx} className="leading-relaxed">
                          {line}
                        </p>
                      ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {modulData.tujuanPembelajaran}
                  </p>
                )}
              </div>

              {/* Petunjuk Belajar */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Petunjuk Pengerjaan:</span>
                </h4>
                {parsed.petunjuk.length > 0 ? (
                  <div className="text-xs text-slate-700 space-y-1">
                    {parsed.petunjuk
                      .filter((l) => l.trim() && !l.includes('---'))
                      .map((line, idx) => (
                        <p key={idx} className="leading-relaxed">
                          {line}
                        </p>
                      ))}
                  </div>
                ) : (
                  <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside leading-relaxed">
                    <li>Berdoalah sebelum memulai kegiatan belajar.</li>
                    <li>Tuliskan identitas nama dan kelas pada kolom di atas.</li>
                    <li>Ikuti setiap langkah aktivitas dengan sungguh-sungguh.</li>
                    <li>Tanyakan kepada Guru jika membutuhkan bimbingan.</li>
                  </ul>
                )}
              </div>
            </div>

            {/* 5. STIMULUS KONTEKSTUAL (APERSEPSI) */}
            {parsed.stimulus.length > 0 && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-teal-50/70 via-emerald-50/50 to-slate-50 border-l-4 border-emerald-600 border border-slate-200/80 shadow-2xs">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-emerald-700" />
                  <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                    Stimulus Kontekstual & Pengamatan Siswa
                  </h4>
                </div>
                <div className="text-xs text-slate-800 leading-relaxed space-y-1.5 font-serif italic pl-1">
                  {parsed.stimulus
                    .filter((l) => l.trim() && !l.includes('---'))
                    .map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                </div>
              </div>
            )}

            {/* 6. AKTIVITAS UTAMA & LEMBAR SOAL SISWA */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <div className="p-1 rounded bg-slate-900 text-white">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  LEMBAR AKTIVITAS & SOAL PENUGASAN SISWA
                </h3>
              </div>

              {parsed.aktivitas.length > 0 ? (
                <div className="space-y-3.5">
                  {/* Render lines cleanly with boxed styling for tasks and dotted lines for answers */}
                  {parsed.aktivitas
                    .filter((l) => l.trim() && !l.includes('====') && !l.includes('----'))
                    .map((line, idx) => {
                      const isTaskHeader = line.toUpperCase().includes('TUGAS') || line.match(/^[0-9]+\.\s/);
                      const isOption = line.trim().match(/^[A-D]\.\s/);
                      const isFillLine = line.includes('.......');
                      const isCreationBox = line.includes('+---') || line.includes('[ KOTAK KREASI');

                      if (isTaskHeader) {
                        return (
                          <div
                            key={idx}
                            className="p-2.5 rounded-lg bg-slate-100/90 font-bold text-xs text-slate-900 border-l-4 border-emerald-500 mt-3"
                          >
                            {line}
                          </div>
                        );
                      }

                      if (isOption) {
                        return (
                          <div key={idx} className="ml-4 flex items-center gap-2 text-xs text-slate-800 my-0.5">
                            <span className="w-4 h-4 rounded border border-slate-400 inline-block flex-shrink-0" />
                            <span>{line}</span>
                          </div>
                        );
                      }

                      if (isCreationBox) {
                        return (
                          <div
                            key={idx}
                            className="my-3 p-8 border-2 border-dashed border-emerald-300 rounded-2xl bg-emerald-50/20 text-center flex flex-col items-center justify-center min-h-[140px]"
                          >
                            <Palette className="w-8 h-8 text-emerald-500 mb-2 opacity-80" />
                            <span className="text-xs font-bold text-emerald-900">
                              KOTAK KREASI & GAMBAR SISWA
                            </span>
                            <span className="text-[11px] text-slate-500 mt-0.5">
                              Tuangkan ide, gambar, sketsa, atau pesan positifmu di area ini
                            </span>
                          </div>
                        );
                      }

                      return (
                        <p
                          key={idx}
                          className={`text-xs leading-relaxed text-slate-800 ${
                            isFillLine ? 'font-mono text-slate-500 tracking-wider' : ''
                          }`}
                        >
                          {line}
                        </p>
                      );
                    })}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
                  {content}
                </div>
              )}
            </div>

            {/* 7. REFLEKSI DIRI SISWA (INTERAKTIF & SIAP CETAK) */}
            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80 space-y-3 print:break-inside-avoid">
              <div className="flex items-center gap-2">
                <Smile className="w-4 h-4 text-amber-600" />
                <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                  Refleksi Diri Siswa (Bagaimana Perasaanmu Hari Ini?)
                </h4>
              </div>
              <p className="text-xs text-slate-700">
                Lingkari atau beri tanda centang (✓) pada emotikon yang paling menggambarkan perasaanmu setelah belajar hari ini:
              </p>

              {/* Emotion Choice Cards */}
              <div className="grid grid-cols-3 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedEmotion('senang')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedEmotion === 'senang'
                      ? 'bg-emerald-100/90 border-emerald-500 ring-2 ring-emerald-400'
                      : 'bg-white border-amber-200 hover:bg-amber-100/40'
                  }`}
                >
                  <span className="text-2xl block mb-1">😊</span>
                  <span className="text-xs font-bold text-slate-900 block">Sangat Senang</span>
                  <span className="text-[10px] text-slate-500 block">Saya paham materi</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedEmotion('pikir')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedEmotion === 'pikir'
                      ? 'bg-sky-100/90 border-sky-500 ring-2 ring-sky-400'
                      : 'bg-white border-amber-200 hover:bg-amber-100/40'
                  }`}
                >
                  <span className="text-2xl block mb-1">🤔</span>
                  <span className="text-xs font-bold text-slate-900 block">Sedang Berpikir</span>
                  <span className="text-[10px] text-slate-500 block">Perlu sedikit bantuan</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedEmotion('semangat')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedEmotion === 'semangat'
                      ? 'bg-amber-100/90 border-amber-500 ring-2 ring-amber-400'
                      : 'bg-white border-amber-200 hover:bg-amber-100/40'
                  }`}
                >
                  <span className="text-2xl block mb-1">🤩</span>
                  <span className="text-xs font-bold text-slate-900 block">Sangat Semangat</span>
                  <span className="text-[10px] text-slate-500 block">Ingin belajar lebih</span>
                </button>
              </div>

              {/* Reflection Questions */}
              <div className="pt-2 text-xs space-y-2">
                <div>
                  <span className="font-semibold text-slate-700">Hal baru apa yang paling kamu sukai pada kegiatan hari ini?</span>
                  <div className="mt-1 border-b border-dotted border-slate-400 min-h-[20px]" />
                </div>
              </div>
            </div>

            {/* 8. KUNCI JAWABAN & RUBRIK PENILAIAN GURU */}
            {parsed.kunciRubrik.length > 0 && (
              <div className="mt-6 pt-4 border-t-2 border-dashed border-slate-300 print:break-before-page">
                <div
                  onClick={() => setShowRubrik(!showRubrik)}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-100 hover:bg-slate-200/80 transition-colors cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-slate-700" />
                    <span className="text-xs font-bold text-slate-900">
                      Panduan Guru: Kunci Jawaban & Rubrik Penilaian
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">
                      Khusus Penilai
                    </span>
                  </div>
                  <div className="text-slate-500">
                    {showRubrik ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {showRubrik && (
                  <div className="mt-2.5 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 space-y-2 font-mono leading-relaxed">
                    {parsed.kunciRubrik
                      .filter((l) => l.trim() && !l.includes('====') && !l.includes('----'))
                      .map((line, idx) => (
                        <p key={idx} className={line.includes(':') ? 'font-bold text-slate-900' : ''}>
                          {line}
                        </p>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* Footer / Pengesahan LKPD */}
            <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
              <span>{modulData.namaSekolah || 'SDN 3 Purwosari'} • Kurikulum Merdeka</span>
              <span>Dokumen LKPD Cetak Resmi • Deep Learning</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
