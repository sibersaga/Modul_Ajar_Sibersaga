import React, { useState } from 'react';
import {
  FileDown,
  Printer,
  Copy,
  Check,
  BookOpen,
  FileCheck2,
  Calendar,
  Layers,
  FileSpreadsheet,
  Sparkles,
  Edit3,
  Sliders,
  FileText,
  School,
  GraduationCap,
  Award,
  Target,
  CheckCircle2
} from 'lucide-react';
import { ModulAjarData, PaperConfig } from '../types';
import { LkpdViewer } from './LkpdViewer';
import { PaperSizeSelector } from './PaperSizeSelector';
import { applyPrintPageStyle, getPaperDimensionsMm } from '../utils/paperUtils';

interface DocumentPreviewProps {
  data: ModulAjarData;
  paperConfig?: PaperConfig;
  onChangePaperConfig?: (config: PaperConfig) => void;
  onOpenPaperModal?: () => void;
  onDownloadDocx: () => void;
  onDownloadPdf?: () => void;
  onPrint: () => void;
  onOpenLkpdGenerator?: () => void;
  isDownloading: boolean;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  data,
  paperConfig,
  onChangePaperConfig,
  onOpenPaperModal,
  onDownloadDocx,
  onDownloadPdf,
  onPrint,
  onOpenLkpdGenerator,
  isDownloading = false,
}) => {
  const [copied, setCopied] = useState(false);

  const paperDims = paperConfig ? getPaperDimensionsMm(paperConfig) : { name: 'A4', widthMm: 210, heightMm: 297 };

  const handlePrintDocument = () => {
    if (paperConfig) {
      applyPrintPageStyle(paperConfig);
    }
    onPrint();
  };

  const handleCopyText = () => {
    let fullText = `MODUL AJAR KURIKULUM MERDEKA\nPENDEKATAN PEMBELAJARAN MENDALAM (DEEP LEARNING)\n`;
    fullText += `Satuan Pendidikan: ${data.namaSekolah}\n`;
    fullText += `Jenjang/Fase/Kelas: ${data.jenjang} / Fase ${data.fase} / ${data.kelas}\n`;
    fullText += `Tema / Subtema: ${data.temaSubtema}\n`;
    fullText += `Nama Penyusun: ${data.namaPenyusun} (NIP: ${data.nip || '-'})\n\n`;

    fullText += `A. INFORMASI UMUM\n`;
    fullText += `Alokasi Waktu: ${data.alokasiWaktu}\nModel: ${data.modelPembelajaran}\n\n`;

    fullText += `B. IDENTIFIKASI PEMBELAJARAN\n`;
    fullText += `Karakteristik Siswa: ${data.identifikasiPesertaDidik}\nMateri: ${data.materiPembelajaran}\nDimensi: ${(data.dimensiProfilLulusan || []).join(', ')}\n\n`;

    fullText += `C. DESAIN PEMBELAJARAN\n`;
    fullText += `Capaian Pembelajaran (CP): ${data.elemenCp}\nTujuan Pembelajaran (TP): ${data.tujuanPembelajaran}\nTopik: ${data.topikPembelajaran}\nPraktik Pedagogis: ${data.desainPembelajaranPraktikPedagogis}\n\n`;

    fullText += `D. RENCANA PELAKSANAAN PEMBELAJARAN\n`;
    fullText += `1. Kegiatan Awal:\n${(data.rencanaPelaksanaanAwal || []).map((l, i) => `   ${i + 1}. ${l}`).join('\n')}\n\n`;
    fullText += `2. Kegiatan Inti:\n`;
    (data.kegiatanHarian || []).forEach((h) => {
      fullText += `   [Hari ${h.hari} - Tahap ${h.tahap}]\n`;
      h.kegiatan.forEach((k) => {
        fullText += `   - JP ${k.jp}: ${k.judul}\n`;
        if (k.prinsipDeepLearning) fullText += `     Prinsip Deep Learning: ${k.prinsipDeepLearning}\n`;
        if (k.sintaksModel) fullText += `     Sintaks Model: ${k.sintaksModel}\n`;
        fullText += `     Dimensi: ${k.dimensi || '-'}\n`;
        fullText += `     Alat & Bahan: ${k.alatBahan || '-'}\n`;
        fullText += `     Uraian: ${k.deskripsi}\n`;
      });
    });

    fullText += `\n3. Kegiatan Penutup:\n${(data.rencanaPelaksanaanPenutup || []).map((l, i) => `   ${i + 1}. ${l}`).join('\n')}\n\n`;

    fullText += `E. ASESMEN PEMBELAJARAN\n`;
    fullText += `Asesmen Awal: ${data.asesmenPembelajaranAwal}\nAsesmen Proses: ${data.asesmenPembelajaranProses}\nAsesmen Akhir: ${data.asesmenPembelajaranAkhir}\nLKPD: ${data.lembarKerjaSiswa}\nRubrik: ${data.rubrikPenilaian}\n`;

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs print:hidden">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-800">
                Pratinjau Dokumen Cetak / Word
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Format Resmi Kemendikbudristek
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Kertas Aktif: <strong className="text-slate-800">{paperDims.name}</strong> ({paperDims.widthMm} × {paperDims.heightMm} mm)
            </p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* Paper Size Selector Toolbar */}
          {onChangePaperConfig && paperConfig && (
            <div className="flex items-center gap-1.5">
              <PaperSizeSelector
                value={paperConfig}
                onChange={onChangePaperConfig}
                compact={true}
              />
              {onOpenPaperModal && (
                <button
                  type="button"
                  onClick={onOpenPaperModal}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                  title="Buka pengaturan ukuran kertas lengkap"
                >
                  <Sliders className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Opsi Kertas</span>
                </button>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={handleCopyText}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrintDocument}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition-colors cursor-pointer shadow-2xs"
            title={`Cetak dokumen ke kertas ${paperConfig?.size || 'A4'}`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak / PDF ({paperConfig?.size || 'A4'})</span>
          </button>

          <button
            type="button"
            onClick={onDownloadPdf}
            disabled={isDownloading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            title="Download file PDF"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{isDownloading ? 'Mengekspor...' : 'Unduh PDF'}</span>
          </button>

          <button
            type="button"
            onClick={onDownloadDocx}
            disabled={isDownloading}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            title="Download file Microsoft Word (.docx)"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>{isDownloading ? 'Mengekspor...' : 'Unduh Word'}</span>
          </button>
        </div>
      </div>

      {/* Paper Sheet Simulator */}
      <div
        id="printable-modul-document"
        className="bg-white mx-auto p-8 sm:p-12 rounded-xl border border-slate-200 shadow-md font-sans text-slate-800 text-sm leading-relaxed print:p-0 print:border-none print:shadow-none print:m-0 print:max-w-none"
        style={{
          maxWidth:
            paperConfig?.size === 'F4'
              ? '215mm'
              : paperConfig?.size === 'CUSTOM'
              ? `${paperConfig.customWidthMm || 215}mm`
              : '210mm',
        }}
      >
        {/* Header Dokumen Resmi Tata Naskah Dinas Sekolah */}
        <div className="text-center border-b-4 border-double border-slate-900 pb-5 mb-6 print:break-inside-avoid">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <School className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-600 tracking-wider uppercase">
                {data.namaSekolah ? `PEMERINTAH DAERAH • DINAS PENDIDIKAN` : 'KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI'}
              </p>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-900 uppercase leading-snug">
                {data.namaSekolah || 'SATUAN PENDIDIKAN INDONESIA'}
              </h2>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-950 uppercase">
              MODUL AJAR KURIKULUM MERDEKA
            </h1>
            <p className="text-xs sm:text-sm font-bold text-indigo-900 uppercase tracking-wide mt-0.5">
              PENDEKATAN PEMBELAJARAN MENDALAM (DEEP LEARNING)
            </p>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              Jenjang {data.jenjang} • Fase {data.fase} ({data.kelas}) • Tahun Pelajaran {new Date().getFullYear()}/{new Date().getFullYear() + 1}
            </p>
          </div>
        </div>

        {/* A. INFORMASI UMUM */}
        <div className="mb-6 print:break-inside-avoid">
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg mb-2.5 border-l-4 border-indigo-600">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center">
              A
            </span>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
              Informasi Umum & Identitas Dokumen
            </h3>
          </div>

          <table className="w-full border-collapse border border-slate-300 text-xs">
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="w-1/3 p-2.5 font-semibold bg-slate-50 border-r border-slate-200 text-slate-800">
                  Satuan Pendidikan
                </td>
                <td className="p-2.5 font-bold text-slate-900">{data.namaSekolah || '-'}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-2.5 font-semibold bg-slate-50 border-r border-slate-200 text-slate-800">
                  Nama Guru / Penyusun
                </td>
                <td className="p-2.5 font-medium text-slate-900">{data.namaPenyusun || '-'}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-2.5 font-semibold bg-slate-50 border-r border-slate-200 text-slate-800">
                  NIP Penyusun
                </td>
                <td className="p-2.5 font-mono text-slate-700">{data.nip || '-'}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-2.5 font-semibold bg-slate-50 border-r border-slate-200 text-slate-800">
                  Jenjang / Fase / Kelas
                </td>
                <td className="p-2.5">
                  <span className="font-semibold text-slate-900">
                    {data.jenjang} / Fase {data.fase} / {data.kelas}
                  </span>
                </td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-2.5 font-semibold bg-slate-50 border-r border-slate-200 text-slate-800">
                  Semester / Bulan / Minggu
                </td>
                <td className="p-2.5">
                  Semester {data.semester} • Bulan {data.bulan} • Minggu ke-{data.mingguKe}
                </td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-2.5 font-semibold bg-slate-50 border-r border-slate-200 text-slate-800">
                  Alokasi Waktu
                </td>
                <td className="p-2.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 font-bold text-xs border border-indigo-200">
                    {data.alokasiWaktu || '-'}
                  </span>
                </td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-2.5 font-semibold bg-slate-50 border-r border-slate-200 text-slate-800">
                  Jumlah Peserta Didik
                </td>
                <td className="p-2.5 font-medium">{data.jumlahAnak ? `${data.jumlahAnak} Anak` : '-'}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-2.5 font-semibold bg-slate-50 border-r border-slate-200 text-slate-800">
                  Model Pembelajaran
                </td>
                <td className="p-2.5">
                  <span className="font-semibold text-indigo-900 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                    {data.modelPembelajaran || '-'}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold bg-slate-50 border-r border-slate-200 text-slate-800">
                  Tema & Subtema
                </td>
                <td className="p-2.5 font-bold text-indigo-950 text-sm">{data.temaSubtema || '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* B. IDENTIFIKASI PEMBELAJARAN */}
        <div className="mb-6 print:break-inside-avoid">
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg mb-2.5 border-l-4 border-indigo-600">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center">
              B
            </span>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
              Identifikasi Pembelajaran
            </h3>
          </div>

          <table className="w-full border-collapse border border-slate-300 text-xs">
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="w-1/3 p-2.5 font-semibold bg-slate-50 border-r border-slate-200 text-slate-800">
                  Karakteristik Peserta Didik
                </td>
                <td className="p-2.5 leading-relaxed text-slate-700">{data.identifikasiPesertaDidik || '-'}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-2.5 font-semibold bg-slate-50 border-r border-slate-200 text-slate-800">
                  Materi Pembelajaran
                </td>
                <td className="p-2.5 leading-relaxed font-medium text-slate-900">{data.materiPembelajaran || '-'}</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold bg-slate-50 border-r border-slate-200 text-slate-800">
                  Dimensi Profil Pelajar Pancasila
                </td>
                <td className="p-2.5">
                  {data.dimensiProfilLulusan && data.dimensiProfilLulusan.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {data.dimensiProfilLulusan.map((d, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-900 border border-indigo-200 text-xs font-semibold"
                        >
                          <CheckCircle2 className="w-3 h-3 text-indigo-600" />
                          <span>{d}</span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* C. DESAIN PEMBELAJARAN (DEEP LEARNING) */}
        <div className="mb-6 print:break-inside-avoid">
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg mb-2.5 border-l-4 border-indigo-600">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center">
              C
            </span>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
              Desain Pembelajaran (Pendekatan Deep Learning)
            </h3>
          </div>

          <table className="w-full border-collapse border border-slate-300 text-xs">
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="w-1/3 p-2.5 font-semibold bg-slate-50 border-r border-slate-200 text-slate-800">
                  Capaian Pembelajaran (CP)
                </td>
                <td className="p-2.5 leading-relaxed text-slate-800">{data.elemenCp || '-'}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-2.5 font-semibold bg-slate-50 border-r border-slate-200 text-slate-800">
                  Tujuan Pembelajaran (TP)
                </td>
                <td className="p-2.5">
                  <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-200 text-blue-950 font-semibold leading-relaxed">
                    {data.tujuanPembelajaran || '-'}
                  </div>
                </td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-2.5 font-semibold bg-slate-50 border-r border-slate-200 text-slate-800">
                  Topik Pembelajaran
                </td>
                <td className="p-2.5 font-bold text-indigo-900">{data.topikPembelajaran || '-'}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-2.5 font-semibold bg-slate-50 border-r border-slate-200 text-slate-800">
                  Lintas Disiplin Ilmu
                </td>
                <td className="p-2.5 text-slate-700">{data.desainPembelajaranLintasDisiplinIlmu || '-'}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-2.5 font-semibold bg-slate-50 border-r border-slate-200 text-slate-800">
                  Praktik Pedagogis (3 Pilar)
                </td>
                <td className="p-2.5 leading-relaxed italic text-slate-700">
                  {data.desainPembelajaranPraktikPedagogis || '-'}
                </td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-2.5 font-semibold bg-slate-50 border-r border-slate-200 text-slate-800">
                  Kemitraan Pembelajaran
                </td>
                <td className="p-2.5 leading-relaxed">
                  {data.desainPembelajaranKemitraanPembelajaran &&
                  (Array.isArray(data.desainPembelajaranKemitraanPembelajaran)
                    ? data.desainPembelajaranKemitraanPembelajaran.length > 0
                    : Boolean(data.desainPembelajaranKemitraanPembelajaran)) ? (
                    Array.isArray(data.desainPembelajaranKemitraanPembelajaran) ? (
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                        {data.desainPembelajaranKemitraanPembelajaran.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-slate-700">{data.desainPembelajaranKemitraanPembelajaran}</p>
                    )
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-2.5 font-semibold bg-slate-50 border-r border-slate-200 text-slate-800">
                  Lingkungan Pembelajaran
                </td>
                <td className="p-2.5 leading-relaxed">
                  {data.desainPembelajaranLingkunganPembelajaran &&
                  (Array.isArray(data.desainPembelajaranLingkunganPembelajaran)
                    ? data.desainPembelajaranLingkunganPembelajaran.length > 0
                    : Boolean(data.desainPembelajaranLingkunganPembelajaran)) ? (
                    Array.isArray(data.desainPembelajaranLingkunganPembelajaran) ? (
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                        {data.desainPembelajaranLingkunganPembelajaran.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-slate-700">{data.desainPembelajaranLingkunganPembelajaran}</p>
                    )
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold bg-slate-50 border-r border-slate-200 text-slate-800">
                  Pemanfaatan Digital
                </td>
                <td className="p-2.5 leading-relaxed">
                  {data.desainPembelajaranPemanfaatanDigital &&
                  (Array.isArray(data.desainPembelajaranPemanfaatanDigital)
                    ? data.desainPembelajaranPemanfaatanDigital.length > 0
                    : Boolean(data.desainPembelajaranPemanfaatanDigital)) ? (
                    Array.isArray(data.desainPembelajaranPemanfaatanDigital) ? (
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                        {data.desainPembelajaranPemanfaatanDigital.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-slate-700">{data.desainPembelajaranPemanfaatanDigital}</p>
                    )
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* D. RENCANA PELAKSANAAN PEMBELAJARAN */}
        <div className="mb-6">
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg mb-2.5 border-l-4 border-indigo-600 print:break-inside-avoid">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center">
              D
            </span>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
              Rencana Pelaksanaan Pembelajaran (Skenario Aktivitas)
            </h3>
          </div>

          {/* 1. Kegiatan Awal */}
          <div className="mb-4 print:break-inside-avoid">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold text-slate-800 uppercase">
                1. Kegiatan Awal (Berkesadaran, Bermakna, Menggembirakan)
              </span>
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Apersepsi & Kesadaran
              </span>
            </div>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-700 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
              {(data.rencanaPelaksanaanAwal || []).map((item, i) => (
                <li key={i} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* 2. Kegiatan Inti Matriks Harian */}
          <div className="mb-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2 print:break-inside-avoid">
              <h4 className="text-xs font-bold text-slate-800 uppercase">
                2. Kegiatan Inti Pembelajaran Mendalam (Deep Learning)
              </h4>
              <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
                Model: {data.modelPembelajaran || 'Deep Learning'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-300 text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 border-b border-slate-300">
                    <th className="border border-slate-300 p-2.5 w-32 text-center font-bold">
                      Hari & Tahap
                    </th>
                    <th className="border border-slate-300 p-2.5 text-left font-bold">
                      Uraian Kegiatan Pembelajaran (Prinsip Deep Learning & Sintaks Model)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(data.kegiatanHarian || []).map((hari) => (
                    <tr key={hari.hari} className="border-b border-slate-200 print:break-inside-avoid">
                      <td className="border border-slate-300 p-3 text-center align-top bg-slate-50 font-bold">
                        <div className="text-sm font-bold text-slate-900">Hari {hari.hari}</div>
                        <span
                          className={`inline-block text-[10px] px-2 py-0.5 mt-1 rounded font-bold uppercase ${
                            hari.tahap === 'MEMAHAMI'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : hari.tahap === 'MENGAPLIKASI'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {hari.tahap}
                        </span>
                      </td>
                      <td className="border border-slate-300 p-3.5 align-top space-y-3">
                        {hari.kegiatan.map((keg, kIdx) => (
                          <div
                            key={kIdx}
                            className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-2 print:border-slate-300"
                          >
                            {/* Judul Kegiatan & JP */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] flex items-center justify-center font-bold shrink-0">
                                {keg.jp}
                              </span>
                              <span className="font-bold text-slate-900 text-xs sm:text-sm">
                                Kegiatan {kIdx + 1}: {keg.judul}
                              </span>
                            </div>

                            {/* Prinsip Deep Learning & Sintaks Model */}
                            <div className="flex flex-wrap items-center gap-1.5">
                              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-900 border border-emerald-200">
                                <span className="font-bold text-[10px] uppercase text-emerald-700">
                                  Prinsip Deep Learning:
                                </span>
                                <span>{keg.prinsipDeepLearning || 'Bermakna (Meaningful Learning)'}</span>
                              </div>

                              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-sky-50 text-sky-900 border border-sky-200">
                                <span className="font-bold text-[10px] uppercase text-sky-700">
                                  Sintaks Model:
                                </span>
                                <span>{keg.sintaksModel || 'Eksplorasi Kontekstual'}</span>
                              </div>
                            </div>

                            {/* Dimensi & Alat Bahan */}
                            {(keg.dimensi || keg.alatBahan) && (
                              <div className="flex flex-wrap gap-2 text-[11px] pt-0.5">
                                {keg.dimensi && (
                                  <span className="text-indigo-800">
                                    <strong>Dimensi:</strong> {keg.dimensi}
                                  </span>
                                )}
                                {keg.alatBahan && (
                                  <span className="text-slate-600">
                                    <strong>Alat & Bahan:</strong> {keg.alatBahan}
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Deskripsi */}
                            <div className="text-slate-700 leading-relaxed text-xs">
                              {keg.deskripsi}
                            </div>

                            {/* Langkah-langkah */}
                            {keg.langkah && keg.langkah.length > 0 && (
                              <div className="pt-1 border-t border-slate-100">
                                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                                  Langkah Kegiatan:
                                </span>
                                <ol className="list-decimal list-inside text-xs text-slate-700 space-y-0.5 pl-1">
                                  {keg.langkah.map((l, lIdx) => (
                                    <li key={lIdx} className="leading-relaxed">
                                      {l}
                                    </li>
                                  ))}
                                </ol>
                              </div>
                            )}
                          </div>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. Kegiatan Penutup */}
          <div className="print:break-inside-avoid">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold text-slate-800 uppercase">
                3. Kegiatan Penutup (Refleksi, Penguatan, & Doa)
              </span>
              <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Reflektif
              </span>
            </div>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-700 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
              {(data.rencanaPelaksanaanPenutup || []).map((item, i) => (
                <li key={i} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* E. ASESMEN & EVALUASI */}
        <div className="mb-8 print:break-inside-avoid">
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg mb-2.5 border-l-4 border-indigo-600">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center">
              E
            </span>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
              Asesmen Pembelajaran & Instrumen Evaluasi
            </h3>
          </div>

          <table className="w-full border-collapse border border-slate-300 text-xs">
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="w-1/3 p-2.5 font-semibold bg-slate-50 border-r border-slate-200 text-slate-800">
                  Asesmen Awal (Diagnostik)
                </td>
                <td className="p-2.5 leading-relaxed text-slate-700">{data.asesmenPembelajaranAwal || '-'}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-2.5 font-semibold bg-slate-50 border-r border-slate-200 text-slate-800">
                  Asesmen Proses (Formatif)
                </td>
                <td className="p-2.5 leading-relaxed text-slate-700">{data.asesmenPembelajaranProses || '-'}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-2.5 font-semibold bg-slate-50 border-r border-slate-200 text-slate-800">
                  Asesmen Akhir (Sumatif)
                </td>
                <td className="p-2.5 leading-relaxed text-slate-700">{data.asesmenPembelajaranAkhir || '-'}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-2.5 font-semibold bg-slate-50 border-r border-slate-200 text-slate-800">
                  Lembar Kerja Siswa (LKPD)
                </td>
                <td className="p-2.5 leading-relaxed font-medium text-indigo-950">{data.lembarKerjaSiswa || '-'}</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold bg-slate-50 border-r border-slate-200 text-slate-800">
                  Rubrik Penilaian & Kriteria
                </td>
                <td className="p-2.5 leading-relaxed whitespace-pre-line text-slate-700 font-mono text-[11.5px]">
                  {data.rubrikPenilaian || '-'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Lembar Tanda Tangan & Pengesahan */}
        <div className="grid grid-cols-2 gap-8 text-center text-xs pt-6 border-t-2 border-slate-300 print:break-inside-avoid">
          <div>
            <p className="font-semibold text-slate-700">Mengetahui,</p>
            <p className="font-bold text-slate-900 mt-0.5">Kepala Sekolah</p>
            <div className="h-20 flex items-end justify-center font-bold text-slate-900 underline">
              ( {data.namaKepalaSekolah || '______________________________'} )
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {data.nipKepalaSekolah ? `NIP. ${data.nipKepalaSekolah}` : 'NIP. .................................................'}
            </p>
          </div>

          <div>
            <p className="text-slate-600">
              Ditetapkan di: ...................., {data.bulan || 'Agustus'} {new Date().getFullYear()}
            </p>
            <p className="font-bold text-slate-900 mt-0.5">Guru / Penyusun Modul</p>
            <div className="h-20 flex items-end justify-center font-bold text-slate-900 underline">
              ( {data.namaPenyusun || '______________________________'} )
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {data.nip ? `NIP. ${data.nip}` : 'NIP. .................................................'}
            </p>
          </div>
        </div>
      </div>

      {/* Halaman Lampiran LKPD */}
      {data.lkpdLengkap ? (
        <div className="mx-auto my-8 print:my-0 print:break-before-page">
          <LkpdViewer
            content={data.lkpdLengkap}
            modulData={data}
            paperConfig={paperConfig}
            onChangePaperConfig={onChangePaperConfig}
            isEditable={false}
            onPrint={handlePrintDocument}
          />
        </div>
      ) : (
        onOpenLkpdGenerator && (
          <div data-html2canvas-ignore className="max-w-[210mm] mx-auto my-8 p-6 bg-emerald-50/70 border border-dashed border-emerald-300 rounded-2xl text-center print:hidden shadow-xs">
            <FileSpreadsheet className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-900">
              Lampiran LKPD Lengkap Belum Dibuat
            </h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto mt-1 mb-4">
              Buat dokumen LKPD aktif siap cetak sekarang. Prompt akan dirumuskan otomatis oleh AI berdasarkan tema, materi, dan tujuan pembelajaran modul Anda.
            </p>
            <button
              type="button"
              onClick={onOpenLkpdGenerator}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              <span>Buat LKPD Otomatis dari Modul Ini</span>
            </button>
          </div>
        )
      )}
    </div>
  );
};

