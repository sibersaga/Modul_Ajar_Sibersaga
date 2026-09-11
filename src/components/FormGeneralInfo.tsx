import React from 'react';
import { School, User, Calendar, Clock, Users, BookOpen, AlertCircle } from 'lucide-react';
import { ModulAjarData, JenjangPendidikan, FaseKurikulum } from '../types';

interface FormGeneralInfoProps {
  data: ModulAjarData;
  onChange: (field: keyof ModulAjarData, value: any) => void;
  onAlokasiChange: (val: string) => void;
  validationErrors?: Record<string, string>;
  showErrors?: boolean;
}

const BULAN_LIST = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const MODEL_PEMBELAJARAN_LIST = [
  'Problem Based Learning (PBL)',
  'Project Based Learning (PjBL)',
  'Discovery Learning',
  'Inquiry Learning',
  'Experiential Learning (Deep Learning)',
  'Sentra / Area Bermain Eksploratif',
  'Tatap Muka Interaktif Terbimbing',
];

export const FormGeneralInfo: React.FC<FormGeneralInfoProps> = ({
  data,
  onChange,
  onAlokasiChange,
  validationErrors = {},
  showErrors = false,
}: FormGeneralInfoProps) => {
  const hasErrors =
    showErrors &&
    (validationErrors.namaSekolah ||
      validationErrors.namaPenyusun ||
      validationErrors.kelas ||
      validationErrors.alokasiWaktu);

  return (
    <div id="section-informasi-umum" className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 md:p-6 mb-6">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-sky-50 text-sky-700">
            <School className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              1. Informasi Umum & Identitas Dokumen
            </h2>
            <p className="text-xs text-slate-500">
              Data satuan pendidikan, penyusun modul, jenjang, fase, dan alokasi waktu.
            </p>
          </div>
        </div>
        {hasErrors && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
            <AlertCircle className="w-3.5 h-3.5" /> Bidang wajib belum lengkap
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Satuan Pendidikan */}
        <div>
          <label htmlFor="input-namaSekolah" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Satuan Pendidikan (Nama Sekolah) <span className="text-rose-500 font-bold">*</span>
          </label>
          <input
            type="text"
            id="input-namaSekolah"
            value={data.namaSekolah || ''}
            onChange={(e) => onChange('namaSekolah', e.target.value)}
            placeholder="Contoh: SDN 3 Purwosari"
            className={`w-full text-sm rounded-lg border px-3 py-2 text-slate-800 focus:outline-none transition-all ${
              showErrors && validationErrors.namaSekolah
                ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                : 'border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
            }`}
          />
          {showErrors && validationErrors.namaSekolah && (
            <p className="mt-1 text-[11px] text-rose-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {validationErrors.namaSekolah}
            </p>
          )}
        </div>

        {/* Nama Penyusun */}
        <div>
          <label htmlFor="input-namaPenyusun" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Nama Guru / Penyusun <span className="text-rose-500 font-bold">*</span>
          </label>
          <input
            type="text"
            id="input-namaPenyusun"
            value={data.namaPenyusun || ''}
            onChange={(e) => onChange('namaPenyusun', e.target.value)}
            placeholder="Contoh: Budi Santoso, S.Pd."
            className={`w-full text-sm rounded-lg border px-3 py-2 text-slate-800 focus:outline-none transition-all ${
              showErrors && validationErrors.namaPenyusun
                ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                : 'border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
            }`}
          />
          {showErrors && validationErrors.namaPenyusun && (
            <p className="mt-1 text-[11px] text-rose-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {validationErrors.namaPenyusun}
            </p>
          )}
        </div>

        {/* NIP */}
        <div>
          <label htmlFor="input-nip" className="block text-xs font-semibold text-slate-700 mb-1.5">
            NIP Guru (Nomor Induk Pegawai)
          </label>
          <input
            type="text"
            id="input-nip"
            value={data.nip || ''}
            onChange={(e) => onChange('nip', e.target.value)}
            placeholder="Contoh: 19850101 201001 1 001 (Boleh kosong)"
            className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all"
          />
        </div>

        {/* Nama Kepala Sekolah */}
        <div>
          <label htmlFor="input-namaKepalaSekolah" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Nama Kepala Sekolah
          </label>
          <input
            type="text"
            id="input-namaKepalaSekolah"
            value={data.namaKepalaSekolah || ''}
            onChange={(e) => onChange('namaKepalaSekolah', e.target.value)}
            placeholder="Contoh: Siti Aminah, S.Pd.AUD."
            className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all"
          />
        </div>

        {/* NIP Kepala Sekolah */}
        <div>
          <label htmlFor="input-nipKepalaSekolah" className="block text-xs font-semibold text-slate-700 mb-1.5">
            NIP Kepala Sekolah
          </label>
          <input
            type="text"
            id="input-nipKepalaSekolah"
            value={data.nipKepalaSekolah || ''}
            onChange={(e) => onChange('nipKepalaSekolah', e.target.value)}
            placeholder="Contoh: 19750817 200501 2 003 (Boleh kosong)"
            className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all"
          />
        </div>

        {/* Jenjang */}
        <div>
          <label htmlFor="input-jenjang" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Jenjang Pendidikan
          </label>
          <select
            id="input-jenjang"
            value={data.jenjang}
            onChange={(e) => {
              const val = e.target.value as JenjangPendidikan;
              onChange('jenjang', val);
              if (val === 'PAUD') {
                onChange('fase', 'Fondasi');
                onChange('kelas', 'Kelompok A (4-5 tahun)');
              } else if (val === 'SD') {
                onChange('fase', 'A');
                onChange('kelas', 'Kelas 1');
              } else if (val === 'SMP') {
                onChange('fase', 'D');
                onChange('kelas', 'Kelas 7');
              } else if (val === 'SMA') {
                onChange('fase', 'E');
                onChange('kelas', 'Kelas 10');
              }
            }}
            className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all cursor-pointer"
          >
            <option value="PAUD">PAUD / TK</option>
            <option value="SD">SD (Sekolah Dasar)</option>
            <option value="SMP">SMP</option>
            <option value="SMA">SMA / SMK</option>
          </select>
        </div>

        {/* Fase */}
        <div>
          <label htmlFor="input-fase" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Fase Kurikulum Merdeka
          </label>
          <select
            id="input-fase"
            value={data.fase}
            onChange={(e) => onChange('fase', e.target.value as FaseKurikulum)}
            className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all cursor-pointer"
          >
            <option value="Fondasi">Fase Fondasi (PAUD / TK)</option>
            <option value="A">Fase A (Kelas 1 - 2 SD)</option>
            <option value="B">Fase B (Kelas 3 - 4 SD)</option>
            <option value="C">Fase C (Kelas 5 - 6 SD)</option>
            <option value="D">Fase D (Kelas 7 - 9 SMP)</option>
            <option value="E">Fase E (Kelas 10 SMA)</option>
            <option value="F">Fase F (Kelas 11 - 12 SMA)</option>
          </select>
        </div>

        {/* Kelas */}
        <div>
          <label htmlFor="input-kelas" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Kelas / Kelompok <span className="text-rose-500 font-bold">*</span>
          </label>
          <input
            type="text"
            id="input-kelas"
            value={data.kelas || ''}
            onChange={(e) => onChange('kelas', e.target.value)}
            placeholder="Contoh: Kelas 1 A atau Kelompok B"
            className={`w-full text-sm rounded-lg border px-3 py-2 text-slate-800 focus:outline-none transition-all ${
              showErrors && validationErrors.kelas
                ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                : 'border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
            }`}
          />
          {showErrors && validationErrors.kelas && (
            <p className="mt-1 text-[11px] text-rose-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {validationErrors.kelas}
            </p>
          )}
        </div>

        {/* Semester & Minggu */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Semester & Minggu Ke
          </label>
          <div className="grid grid-cols-2 gap-2">
            <select
              id="input-semester"
              value={data.semester}
              onChange={(e) => onChange('semester', Number(e.target.value))}
              className="w-full text-sm rounded-lg border border-slate-300 px-2.5 py-2 text-slate-800 focus:border-indigo-500 focus:outline-none cursor-pointer"
            >
              <option value={1}>Semester 1 (Ganjil)</option>
              <option value={2}>Semester 2 (Genap)</option>
            </select>
            <select
              id="input-mingguKe"
              value={data.mingguKe}
              onChange={(e) => onChange('mingguKe', Number(e.target.value))}
              className="w-full text-sm rounded-lg border border-slate-300 px-2.5 py-2 text-slate-800 focus:border-indigo-500 focus:outline-none cursor-pointer"
            >
              <option value={1}>Minggu ke-1</option>
              <option value={2}>Minggu ke-2</option>
              <option value={3}>Minggu ke-3</option>
              <option value={4}>Minggu ke-4</option>
              <option value={5}>Minggu ke-5</option>
            </select>
          </div>
        </div>

        {/* Bulan */}
        <div>
          <label htmlFor="input-bulan" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Bulan Pelaksanaan
          </label>
          <select
            id="input-bulan"
            value={data.bulan}
            onChange={(e) => onChange('bulan', e.target.value)}
            className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none cursor-pointer"
          >
            {BULAN_LIST.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Alokasi Waktu */}
        <div>
          <label htmlFor="input-alokasiWaktu" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Alokasi Waktu (Hari x JP) <span className="text-rose-500 font-bold">*</span>
          </label>
          <div className="flex gap-1.5 mb-1.5">
            {['5 x 3 JP', '3 x 4 JP', '2 x 4 JP', '6 x 2 JP'].map((chip) => (
              <button
                type="button"
                key={chip}
                onClick={() => onAlokasiChange(chip)}
                className={`text-[11px] px-2 py-0.5 rounded-md border font-medium cursor-pointer transition-all ${
                  data.alokasiWaktu === chip
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-300 font-semibold'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
          <input
            type="text"
            id="input-alokasiWaktu"
            value={data.alokasiWaktu}
            onChange={(e) => onAlokasiChange(e.target.value)}
            placeholder="Contoh: 5 x 3 JP"
            className={`w-full text-sm rounded-lg border px-3 py-2 text-slate-800 focus:outline-none transition-all ${
              showErrors && validationErrors.alokasiWaktu
                ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                : 'border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
            }`}
          />
          {showErrors && validationErrors.alokasiWaktu ? (
            <p className="mt-1 text-[11px] text-rose-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {validationErrors.alokasiWaktu}
            </p>
          ) : (
            <span className="text-[11px] text-slate-400 mt-1 block">
              Format: N x M JP (misal 5 hari, 3 kegiatan/JP per hari).
            </span>
          )}
        </div>

        {/* Jumlah Anak */}
        <div>
          <label htmlFor="input-jumlahAnak" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Jumlah Peserta Didik
          </label>
          <input
            type="text"
            id="input-jumlahAnak"
            value={data.jumlahAnak}
            onChange={(e) => onChange('jumlahAnak', e.target.value)}
            placeholder="Contoh: 28"
            className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all"
          />
        </div>

        {/* Model Pembelajaran */}
        <div className="md:col-span-2">
          <label htmlFor="input-modelPembelajaran" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Model Pembelajaran
          </label>
          <select
            id="input-modelPembelajaran"
            value={data.modelPembelajaran}
            onChange={(e) => onChange('modelPembelajaran', e.target.value)}
            className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all cursor-pointer"
          >
            {MODEL_PEMBELAJARAN_LIST.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
