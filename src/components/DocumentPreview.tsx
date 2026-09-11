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
  Edit3
} from 'lucide-react';
import { ModulAjarData } from '../types';
import { LkpdViewer } from './LkpdViewer';

interface DocumentPreviewProps {
  data: ModulAjarData;
  onDownloadDocx: () => void;
  onPrint: () => void;
  onOpenLkpdGenerator?: () => void;
  isDownloading: boolean;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  data,
  onDownloadDocx,
  onPrint,
  onOpenLkpdGenerator,
  isDownloading,
}) => {
  const [copied, setCopied] = useState(false);

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
        <div className="flex items-center gap-2">
          <FileCheck2 className="w-5 h-5 text-indigo-600" />
          <span className="text-sm font-bold text-slate-800">
            Pratinjau Dokumen Cetak / Word
          </span>
          <span className="text-xs text-slate-500 hidden sm:inline">
            (Sesuai format resmi Kemendikbudristek)
          </span>
        </div>

        <div className="flex items-center gap-2">
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
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak / PDF</span>
          </button>

          <button
            type="button"
            onClick={onDownloadDocx}
            disabled={isDownloading}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-xs cursor-pointer disabled:opacity-50"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>{isDownloading ? 'Mengunduh...' : 'Unduh File Word (.docx)'}</span>
          </button>
        </div>
      </div>

      {/* Paper Sheet Simulator */}
      <div
        id="printable-modul-document"
        className="bg-white mx-auto max-w-4xl p-8 sm:p-12 rounded-xl border border-slate-200 shadow-md font-sans text-slate-800 text-sm leading-relaxed print:p-0 print:border-none print:shadow-none"
      >
        {/* Header Dokumen Resmi */}
        <div className="text-center border-b-2 border-slate-900 pb-5 mb-6">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase">
            MODUL AJAR KURIKULUM MERDEKA
          </h2>
          <p className="text-sm font-bold text-sky-900 mt-1 uppercase tracking-wide">
            PENDEKATAN PEMBELAJARAN MENDALAM (DEEP LEARNING)
          </p>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium italic">
            Fase {data.fase} - {data.kelas} | {data.namaSekolah || 'Satuan Pendidikan'}
          </p>
        </div>

        {/* A. INFORMASI UMUM */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-900 uppercase bg-slate-100 px-3 py-1.5 rounded-md mb-3 border-l-4 border-indigo-600">
            A. Informasi Umum & Identitas Dokumen
          </h3>
          <table className="w-full border-collapse border border-slate-300 text-xs">
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="w-1/3 p-2 font-semibold bg-slate-50 border-r border-slate-200">
                  Satuan Pendidikan
                </td>
                <td className="p-2 font-medium">{data.namaSekolah || '-'}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-2 font-semibold bg-slate-50 border-r border-slate-200">
                  Nama Guru / Penyusun
                </td>
                <td className="p-2">{data.namaPenyusun || '-'}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-2 font-semibold bg-slate-50 border-r border-slate-200">
                  NIP
                </td>
                <td className="p-2">{data.nip || '-'}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-2 font-semibold bg-slate-50 border-r border-slate-200">
                  Jenjang / Fase / Kelas
                </td>
                <td className="p-2">
                  {data.jenjang} / Fase {data.fase} / {data.kelas}
                </td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-2 font-semibold bg-slate-50 border-r border-slate-200">
                  Semester / Bulan / Minggu
                </td>
                <td className="p-2">
                  Semester {data.semester} / Bulan {data.bulan} / Minggu ke-{data.mingguKe}
                </td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-2 font-semibold bg-slate-50 border-r border-slate-200">
                  Alokasi Waktu
                </td>
                <td className="p-2 font-semibold">{data.alokasiWaktu || '-'}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-2 font-semibold bg-slate-50 border-r border-slate-200">
                  Jumlah Peserta Didik
                </td>
                <td className="p-2">{data.jumlahAnak ? `${data.jumlahAnak} Anak` : '-'}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-2 font-semibold bg-slate-50 border-r border-slate-200">
                  Model Pembelajaran
                </td>
                <td className="p-2">{data.modelPembelajaran || '-'}</td>
              </tr>
              <tr>
                <td className="p-2 font-semibold bg-slate-50 border-r border-slate-200">
                  Tema & Subtema
                </td>
                <td className="p-2 font-bold text-indigo-900">{data.temaSubtema || '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* B. IDENTIFIKASI PEMBELAJARAN */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-900 uppercase bg-slate-100 px-3 py-1.5 rounded-md mb-3 border-l-4 border-indigo-600">
            B. Identifikasi Pembelajaran
          </h3>
          <table className="w-full border-collapse border border-slate-300 text-xs">
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="w-1/3 p-2 font-semibold bg-slate-50 border-r border-slate-200">
                  Karakteristik Peserta Didik
                </td>
                <td className="p-2 leading-relaxed">{data.identifikasiPesertaDidik || '-'}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-2 font-semibold bg-slate-50 border-r border-slate-200">
                  Materi Pembelajaran
                </td>
                <td className="p-2 leading-relaxed">{data.materiPembelajaran || '-'}</td>
              </tr>
              <tr>
                <td className="p-2 font-semibold bg-slate-50 border-r border-slate-200">
                  Dimensi Profil Pelajar Pancasila
                </td>
                <td className="p-2">
                  {data.dimensiProfilLulusan && data.dimensiProfilLulusan.length > 0 ? (
                    <ul className="list-disc list-inside space-y-0.5">
                      {data.dimensiProfilLulusan.map((d, i) => (
                        <li key={i} className="font-medium text-slate-700">
                          {d}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* C. DESAIN PEMBELAJARAN */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-900 uppercase bg-slate-100 px-3 py-1.5 rounded-md mb-3 border-l-4 border-indigo-600">
            C. Desain Pembelajaran (Deep Learning)
          </h3>
          <table className="w-full border-collapse border border-slate-300 text-xs">
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="w-1/3 p-2 font-semibold bg-slate-50 border-r border-slate-200">
                  Capaian Pembelajaran (CP)
                </td>
                <td className="p-2 leading-relaxed">{data.elemenCp || '-'}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-2 font-semibold bg-slate-50 border-r border-slate-200">
                  Tujuan Pembelajaran (TP)
                </td>
                <td className="p-2 leading-relaxed font-semibold text-slate-900">
                  {data.tujuanPembelajaran || '-'}
                </td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-2 font-semibold bg-slate-50 border-r border-slate-200">
                  Topik Pembelajaran
                </td>
                <td className="p-2 font-bold text-indigo-900">{data.topikPembelajaran || '-'}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-2 font-semibold bg-slate-50 border-r border-slate-200">
                  Lintas Disiplin Ilmu
                </td>
                <td className="p-2">{data.desainPembelajaranLintasDisiplinIlmu || '-'}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-2 font-semibold bg-slate-50 border-r border-slate-200">
                  Praktik Pedagogis (3 Pilar)
                </td>
                <td className="p-2 leading-relaxed italic text-slate-700">
                  {data.desainPembelajaranPraktikPedagogis || '-'}
                </td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-2 font-semibold bg-slate-50 border-r border-slate-200">
                  Kemitraan Pembelajaran
                </td>
                <td className="p-2 leading-relaxed">
                  {data.desainPembelajaranKemitraanPembelajaran &&
                  (Array.isArray(data.desainPembelajaranKemitraanPembelajaran)
                    ? data.desainPembelajaranKemitraanPembelajaran.length > 0
                    : Boolean(data.desainPembelajaranKemitraanPembelajaran)) ? (
                    Array.isArray(data.desainPembelajaranKemitraanPembelajaran) ? (
                      <ul className="list-disc list-inside space-y-0.5">
                        {data.desainPembelajaranKemitraanPembelajaran.map((item, i) => (
                          <li key={i} className="text-slate-700">
                            {item}
                          </li>
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
                <td className="p-2 font-semibold bg-slate-50 border-r border-slate-200">
                  Lingkungan Pembelajaran
                </td>
                <td className="p-2 leading-relaxed">
                  {data.desainPembelajaranLingkunganPembelajaran &&
                  (Array.isArray(data.desainPembelajaranLingkunganPembelajaran)
                    ? data.desainPembelajaranLingkunganPembelajaran.length > 0
                    : Boolean(data.desainPembelajaranLingkunganPembelajaran)) ? (
                    Array.isArray(data.desainPembelajaranLingkunganPembelajaran) ? (
                      <ul className="list-disc list-inside space-y-0.5">
                        {data.desainPembelajaranLingkunganPembelajaran.map((item, i) => (
                          <li key={i} className="text-slate-700">
                            {item}
                          </li>
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
                <td className="p-2 font-semibold bg-slate-50 border-r border-slate-200">
                  Pemanfaatan Digital
                </td>
                <td className="p-2 leading-relaxed">
                  {data.desainPembelajaranPemanfaatanDigital &&
                  (Array.isArray(data.desainPembelajaranPemanfaatanDigital)
                    ? data.desainPembelajaranPemanfaatanDigital.length > 0
                    : Boolean(data.desainPembelajaranPemanfaatanDigital)) ? (
                    Array.isArray(data.desainPembelajaranPemanfaatanDigital) ? (
                      <ul className="list-disc list-inside space-y-0.5">
                        {data.desainPembelajaranPemanfaatanDigital.map((item, i) => (
                          <li key={i} className="text-slate-700">
                            {item}
                          </li>
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
          <h3 className="text-sm font-bold text-slate-900 uppercase bg-slate-100 px-3 py-1.5 rounded-md mb-3 border-l-4 border-indigo-600">
            D. Rencana Pelaksanaan Pembelajaran
          </h3>

          {/* 1. Kegiatan Awal */}
          <div className="mb-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase mb-1.5">
              1. Kegiatan Awal (Berkesadaran, Bermakna, Menggembirakan)
            </h4>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 bg-slate-50/70 p-3 rounded-lg border border-slate-200">
              {(data.rencanaPelaksanaanAwal || []).map((item, i) => (
                <li key={i} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* 2. Kegiatan Inti Matriks Harian */}
          <div className="mb-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
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
                    <th className="border border-slate-300 p-2 w-28 text-center font-bold">
                      Hari / Tahap
                    </th>
                    <th className="border border-slate-300 p-2 text-left font-bold">
                      Uraian Kegiatan Pembelajaran (Prinsip Deep Learning & Sintaks Model)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(data.kegiatanHarian || []).map((hari) => (
                    <tr key={hari.hari} className="border-b border-slate-200">
                      <td className="border border-slate-300 p-2.5 text-center align-top bg-slate-50 font-bold">
                        <div className="text-sm text-slate-900">Hari {hari.hari}</div>
                        <span
                          className={`inline-block text-[10px] px-2 py-0.5 mt-1 rounded font-semibold ${
                            hari.tahap === 'MEMAHAMI'
                              ? 'bg-blue-100 text-blue-800'
                              : hari.tahap === 'MENGAPLIKASI'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {hari.tahap}
                        </span>
                      </td>
                      <td className="border border-slate-300 p-3 align-top space-y-3.5">
                        {hari.kegiatan.map((keg, kIdx) => (
                          <div key={kIdx} className="pb-3 border-b border-slate-100 last:border-none last:pb-0">
                            {/* Judul Kegiatan & JP */}
                            <div className="font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
                              <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-800 text-[10px] flex items-center justify-center font-bold shrink-0">
                                {keg.jp}
                              </span>
                              <span className="font-bold text-slate-900">
                                Kegiatan {kIdx + 1}: {keg.judul}
                              </span>
                            </div>

                            {/* Prinsip Deep Learning & Sintaks Model Pembelajaran */}
                            <div className="mt-1.5 mb-1.5 flex flex-wrap items-center gap-1.5">
                              {/* Prinsip Utama Pembelajaran Deep Learning */}
                              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                                <span className="font-bold text-[10px] uppercase text-emerald-700">
                                  Prinsip Deep Learning:
                                </span>
                                <span>{keg.prinsipDeepLearning || 'Bermakna (Meaningful Learning)'}</span>
                              </div>

                              {/* Sintaks Model Pembelajaran */}
                              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-sky-50 text-sky-800 border border-sky-200">
                                <span className="font-bold text-[10px] uppercase text-sky-700">
                                  Sintaks Model:
                                </span>
                                <span>{keg.sintaksModel || 'Eksplorasi Kontekstual'}</span>
                              </div>
                            </div>

                            {keg.dimensi && (
                              <div className="text-[11px] text-indigo-700 italic mt-0.5">
                                <span className="font-semibold">Dimensi Profil:</span> {keg.dimensi}
                              </div>
                            )}
                            {keg.alatBahan && (
                              <div className="text-[11px] text-slate-600 mt-0.5">
                                <span className="font-semibold">Alat & Bahan:</span> {keg.alatBahan}
                              </div>
                            )}
                            <div className="text-slate-700 mt-1 leading-relaxed">
                              {keg.deskripsi}
                            </div>
                            {keg.langkah && keg.langkah.length > 0 && (
                              <ul className="list-decimal list-inside text-[11px] text-slate-600 mt-1.5 pl-1 space-y-0.5">
                                {keg.langkah.map((l, lIdx) => (
                                  <li key={lIdx}>{l}</li>
                                ))}
                              </ul>
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
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase mb-1.5">
              3. Kegiatan Penutup (Refleksi & Doa)
            </h4>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 bg-slate-50/70 p-3 rounded-lg border border-slate-200">
              {(data.rencanaPelaksanaanPenutup || []).map((item, i) => (
                <li key={i} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* E. ASESMEN & EVALUASI */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-slate-900 uppercase bg-slate-100 px-3 py-1.5 rounded-md mb-3 border-l-4 border-indigo-600">
            E. Asesmen Pembelajaran & Instrumen Evaluasi
          </h3>
          <table className="w-full border-collapse border border-slate-300 text-xs">
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="w-1/3 p-2 font-semibold bg-slate-50 border-r border-slate-200">
                  Asesmen Awal (Diagnostik)
                </td>
                <td className="p-2 leading-relaxed">{data.asesmenPembelajaranAwal || '-'}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-2 font-semibold bg-slate-50 border-r border-slate-200">
                  Asesmen Proses (Formatif)
                </td>
                <td className="p-2 leading-relaxed">{data.asesmenPembelajaranProses || '-'}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-2 font-semibold bg-slate-50 border-r border-slate-200">
                  Asesmen Akhir (Sumatif)
                </td>
                <td className="p-2 leading-relaxed">{data.asesmenPembelajaranAkhir || '-'}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-2 font-semibold bg-slate-50 border-r border-slate-200">
                  Lembar Kerja Siswa (LKPD)
                </td>
                <td className="p-2 leading-relaxed">{data.lembarKerjaSiswa || '-'}</td>
              </tr>
              <tr>
                <td className="p-2 font-semibold bg-slate-50 border-r border-slate-200">
                  Rubrik Penilaian & Kriteria
                </td>
                <td className="p-2 leading-relaxed whitespace-pre-line">{data.rubrikPenilaian || '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Lembar Tanda Tangan & Pengesahan */}
        <div className="grid grid-cols-2 gap-8 text-center text-xs pt-4 border-t border-slate-200">
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
        <div className="max-w-[210mm] mx-auto my-8 print:my-0 print:break-before-page">
          <LkpdViewer
            content={data.lkpdLengkap}
            modulData={data}
            isEditable={false}
            onPrint={onPrint}
          />
        </div>
      ) : (
        onOpenLkpdGenerator && (
          <div className="max-w-[210mm] mx-auto my-8 p-6 bg-emerald-50/70 border border-dashed border-emerald-300 rounded-2xl text-center print:hidden shadow-xs">
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
