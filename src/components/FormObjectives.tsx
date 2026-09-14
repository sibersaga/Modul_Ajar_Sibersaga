import React from 'react';
import {
  Target,
  Compass,
  Sparkles,
  Check,
  Brain,
  Globe,
  Laptop,
  HeartHandshake,
  Plus,
  Trash2,
  Users,
  Layers,
  AlertCircle
} from 'lucide-react';
import { ModulAjarData } from '../types';

interface FormObjectivesProps {
  data: ModulAjarData;
  onChange: (field: keyof ModulAjarData, value: any) => void;
  validationErrors?: Record<string, string>;
  showErrors?: boolean;
}

const DIMENSI_LIST = [
  'Keimanan dan Ketakwaan terhadap Tuhan YME',
  'Kewargaan / Kebinekaan Global',
  'Penalaran Kritis',
  'Kreativitas',
  'Kolaborasi / Gotong Royong',
  'Kemandirian',
  'Kesehatan',
  'Komunikasi'
];

export const FormObjectives: React.FC<FormObjectivesProps> = ({
  data,
  onChange,
  validationErrors = {},
  showErrors = false,
}: FormObjectivesProps) => {
  const hasErrors =
    showErrors &&
    (validationErrors.temaSubtema ||
      validationErrors.elemenCp ||
      validationErrors.materiPembelajaran ||
      validationErrors.tujuanPembelajaran ||
      validationErrors.topikPembelajaran);
  const toggleDimensi = (dimensi: string) => {
    const current = data.dimensiProfilLulusan || [];
    if (current.includes(dimensi)) {
      onChange('dimensiProfilLulusan', current.filter((d) => d !== dimensi));
    } else {
      onChange('dimensiProfilLulusan', [...current, dimensi]);
    }
  };

  const handleUpdateListItem = (
    field:
      | 'desainPembelajaranKemitraanPembelajaran'
      | 'desainPembelajaranLingkunganPembelajaran'
      | 'desainPembelajaranPemanfaatanDigital',
    index: number,
    value: string
  ) => {
    const current = Array.isArray(data[field]) ? [...data[field]] : [];
    current[index] = value;
    onChange(field, current);
  };

  const handleAddListItem = (
    field:
      | 'desainPembelajaranKemitraanPembelajaran'
      | 'desainPembelajaranLingkunganPembelajaran'
      | 'desainPembelajaranPemanfaatanDigital',
    defaultText = ''
  ) => {
    const current = Array.isArray(data[field]) ? [...data[field]] : [];
    current.push(defaultText);
    onChange(field, current);
  };

  const handleDeleteListItem = (
    field:
      | 'desainPembelajaranKemitraanPembelajaran'
      | 'desainPembelajaranLingkunganPembelajaran'
      | 'desainPembelajaranPemanfaatanDigital',
    index: number
  ) => {
    const current = Array.isArray(data[field]) ? [...data[field]] : [];
    onChange(
      field,
      current.filter((_, i) => i !== index)
    );
  };

  return (
    <div id="section-tema-capaian" className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 md:p-6 mb-6">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              2. Karakteristik & Desain Pembelajaran
            </h2>
            <p className="text-xs text-slate-500">
              Profil Pelajar Pancasila, dan Desain Pedagogis Mendalam.
            </p>
          </div>
        </div>
        {hasErrors && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
            <AlertCircle className="w-3.5 h-3.5" /> Bidang wajib belum lengkap
          </span>
        )}
      </div>

      <div className="space-y-5">
        {/* Dimensi Profil Lulusan / P3 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-700">
              Dimensi Profil Pelajar Pancasila / Dimensi Lulusan (Pilih yang relevan)
            </label>
            <span className="text-[11px] text-slate-500">
              {data.dimensiProfilLulusan?.length || 0} dipilih
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {DIMENSI_LIST.map((dimensi) => {
              const selected = data.dimensiProfilLulusan?.includes(dimensi);
              return (
                <button
                  type="button"
                  key={dimensi}
                  onClick={() => toggleDimensi(dimensi)}
                  className={`flex items-start gap-2 p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    selected
                      ? 'bg-indigo-50/70 border-indigo-300 text-indigo-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-sm flex items-center justify-center mt-0.5 flex-shrink-0 transition-colors ${
                      selected ? 'bg-indigo-600 text-white' : 'border border-slate-300'
                    }`}
                  >
                    {selected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="text-xs font-medium leading-snug">{dimensi}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Capaian Pembelajaran & Karakteristik Siswa */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Elemen Capaian Pembelajaran (CP) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="input-elemenCp" className="text-xs font-semibold text-slate-700">
                Elemen Capaian Pembelajaran (CP) <span className="text-rose-500 font-bold">*</span>
              </label>
              
            </div>
            <textarea
              id="input-elemenCp"
              rows={3}
              value={data.elemenCp}
              onChange={(e) => onChange('elemenCp', e.target.value)}
              placeholder="Contoh: Mengidentifikasi diri, mengekspresikan emosi secara wajar..."
              className={`w-full text-sm rounded-lg border px-3 py-2 text-slate-800 focus:outline-none transition-all resize-y ${
                showErrors && validationErrors.elemenCp
                  ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
              }`}
            />
            {showErrors && validationErrors.elemenCp && (
              <p className="mt-1 text-[11px] text-rose-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {validationErrors.elemenCp}
              </p>
            )}
          </div>

              {/* Identifikasi Peserta Didik */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="input-identifikasiPesertaDidik" className="text-xs font-semibold text-slate-700">
                Identifikasi Karakteristik Peserta Didik
              </label>
              
            </div>
            <textarea
              id="input-identifikasiPesertaDidik"
              rows={3}
              value={data.identifikasiPesertaDidik || ''}
              onChange={(e) => onChange('identifikasiPesertaDidik', e.target.value)}
              placeholder="Contoh: Peserta didik memiliki minat visual dan kinestetik yang tinggi..."
              className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all resize-y"
            />
          </div>
        </div>

        {/* Materi & Tujuan Pembelajaran */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Materi Pembelajaran */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="input-materiPembelajaran" className="text-xs font-semibold text-slate-700">
                Materi Pembelajaran <span className="text-rose-500 font-bold">*</span>
              </label>
              
            </div>
            <textarea
              id="input-materiPembelajaran"
              rows={3}
              value={data.materiPembelajaran || ''}
              onChange={(e) => onChange('materiPembelajaran', e.target.value)}
              placeholder="Contoh: Mengenal anggota tubuh, aturan menjaga kebersihan diri..."
              className={`w-full text-sm rounded-lg border px-3 py-2 text-slate-800 focus:outline-none transition-all resize-y ${
                showErrors && validationErrors.materiPembelajaran
                  ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
              }`}
            />
            {showErrors && validationErrors.materiPembelajaran && (
              <p className="mt-1 text-[11px] text-rose-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {validationErrors.materiPembelajaran}
              </p>
            )}
          </div>

          {/* Tujuan Pembelajaran */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="input-tujuanPembelajaran" className="text-xs font-semibold text-slate-700">
                Tujuan Pembelajaran (TP) <span className="text-rose-500 font-bold">*</span>
              </label>
              
            </div>
            <textarea
              id="input-tujuanPembelajaran"
              rows={3}
              value={data.tujuanPembelajaran || ''}
              onChange={(e) => onChange('tujuanPembelajaran', e.target.value)}
              placeholder="Contoh: Peserta didik mampu menyebutkan nama anggota tubuh dengan jelas..."
              className={`w-full text-sm rounded-lg border px-3 py-2 text-slate-800 focus:outline-none transition-all resize-y ${
                showErrors && validationErrors.tujuanPembelajaran
                  ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
              }`}
            />
            {showErrors && validationErrors.tujuanPembelajaran && (
              <p className="mt-1 text-[11px] text-rose-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {validationErrors.tujuanPembelajaran}
              </p>
            )}
          </div>
        </div>

        {/* Topik Pembelajaran & Lintas Disiplin */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="input-topikPembelajaran" className="text-xs font-semibold text-slate-700">
                Topik Pembelajaran Spesifik <span className="text-rose-500 font-bold">*</span>
              </label>
              
            </div>
            <input
              type="text"
              id="input-topikPembelajaran"
              value={data.topikPembelajaran || ''}
              onChange={(e) => onChange('topikPembelajaran', e.target.value)}
              placeholder="Contoh: Aku dan Tubuhku Ciptaan Tuhan"
              className={`w-full text-sm rounded-lg border px-3 py-2 text-slate-800 focus:outline-none transition-all ${
                showErrors && validationErrors.topikPembelajaran
                  ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
              }`}
            />
            {showErrors && validationErrors.topikPembelajaran && (
              <p className="mt-1 text-[11px] text-rose-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {validationErrors.topikPembelajaran}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="input-desainLintasDisiplin" className="text-xs font-semibold text-slate-700">
                Lintas Disiplin Ilmu
              </label>
              
            </div>
            <input
              type="text"
              id="input-desainLintasDisiplin"
              value={data.desainPembelajaranLintasDisiplinIlmu || ''}
              onChange={(e) => onChange('desainPembelajaranLintasDisiplinIlmu', e.target.value)}
              placeholder="Contoh: Pendidikan Pancasila, Bahasa Indonesia, Seni Rupa"
              className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Praktik Pedagogis (Deep Learning) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="input-praktikPedagogis" className="text-xs font-semibold text-slate-700">
              Praktik Pedagogis (3 Pilar Pembelajaran Mendalam: Mindful, Meaningful, Joyful)
            </label>
            
          </div>
          <textarea
            id="input-praktikPedagogis"
            rows={2}
            value={data.desainPembelajaranPraktikPedagogis || ''}
            onChange={(e) => onChange('desainPembelajaranPraktikPedagogis', e.target.value)}
            placeholder="Contoh: Berkesadaran (Mindful) saat mengenal diri, Bermakna (Meaningful) dikaitkan rutinitas di rumah, dan Menggembirakan (Joyful) lewat bermain peran..."
            className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all resize-y"
          />
        </div>

        {/* Kemitraan Pembelajaran */}
        <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-indigo-600" />
              <label className="text-xs font-bold text-slate-800">
                Kemitraan Pembelajaran (Guru, Orang Tua, Siswa & Komunitas)
              </label>
            </div>
            <div className="flex items-center gap-2">
              
              <button
                type="button"
                onClick={() =>
                  handleAddListItem('desainPembelajaranKemitraanPembelajaran', '')
                }
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-md transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Tambah Poin
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {(Array.isArray(data.desainPembelajaranKemitraanPembelajaran)
              ? data.desainPembelajaranKemitraanPembelajaran
              : []
            ).map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 w-4 text-right">
                  {idx + 1}.
                </span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) =>
                    handleUpdateListItem(
                      'desainPembelajaranKemitraanPembelajaran',
                      idx,
                      e.target.value
                    )
                  }
                  placeholder="Contoh: Guru sebagai fasilitator, orang tua mendampingi di rumah..."
                  className="flex-1 text-sm bg-white rounded-lg border border-slate-300 px-3 py-1.5 text-slate-800 focus:border-indigo-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleDeleteListItem('desainPembelajaranKemitraanPembelajaran', idx)
                  }
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-md transition-colors cursor-pointer"
                  title="Hapus baris"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {(!data.desainPembelajaranKemitraanPembelajaran ||
              (Array.isArray(data.desainPembelajaranKemitraanPembelajaran) &&
                data.desainPembelajaranKemitraanPembelajaran.length === 0)) && (
              <p className="text-xs text-slate-400 italic py-1">
                Belum ada poin kemitraan. Klik "Tambah Poin" atau gunakan Bantuan AI.
              </p>
            )}
          </div>
        </div>

        {/* Lingkungan Pembelajaran */}
        <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-600" />
              <label className="text-xs font-bold text-slate-800">
                Lingkungan Pembelajaran (Tata Ruang Fisik & Psikologis)
              </label>
            </div>
            <div className="flex items-center gap-2">
              
              <button
                type="button"
                onClick={() =>
                  handleAddListItem('desainPembelajaranLingkunganPembelajaran', '')
                }
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-md transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Tambah Poin
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {(Array.isArray(data.desainPembelajaranLingkunganPembelajaran)
              ? data.desainPembelajaranLingkunganPembelajaran
              : []
            ).map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 w-4 text-right">
                  {idx + 1}.
                </span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) =>
                    handleUpdateListItem(
                      'desainPembelajaranLingkunganPembelajaran',
                      idx,
                      e.target.value
                    )
                  }
                  placeholder="Contoh: Ruang kelas ramah anak, sudut baca, lingkaran diskusi karpet..."
                  className="flex-1 text-sm bg-white rounded-lg border border-slate-300 px-3 py-1.5 text-slate-800 focus:border-indigo-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleDeleteListItem('desainPembelajaranLingkunganPembelajaran', idx)
                  }
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-md transition-colors cursor-pointer"
                  title="Hapus baris"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {(!data.desainPembelajaranLingkunganPembelajaran ||
              (Array.isArray(data.desainPembelajaranLingkunganPembelajaran) &&
                data.desainPembelajaranLingkunganPembelajaran.length === 0)) && (
              <p className="text-xs text-slate-400 italic py-1">
                Belum ada poin lingkungan belajar. Klik "Tambah Poin" atau gunakan Bantuan AI.
              </p>
            )}
          </div>
        </div>

        {/* Pemanfaatan Digital */}
        <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Laptop className="w-4 h-4 text-indigo-600" />
              <label className="text-xs font-bold text-slate-800">
                Pemanfaatan Digital (Media Audio/Visual & Alat Interaktif)
              </label>
            </div>
            <div className="flex items-center gap-2">
              
              <button
                type="button"
                onClick={() =>
                  handleAddListItem('desainPembelajaranPemanfaatanDigital', '')
                }
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-md transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Tambah Poin
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {(Array.isArray(data.desainPembelajaranPemanfaatanDigital)
              ? data.desainPembelajaranPemanfaatanDigital
              : []
            ).map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 w-4 text-right">
                  {idx + 1}.
                </span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) =>
                    handleUpdateListItem(
                      'desainPembelajaranPemanfaatanDigital',
                      idx,
                      e.target.value
                    )
                  }
                  placeholder="Contoh: Video pembelajaran animasi, kuis interaktif, proyektor slide visual..."
                  className="flex-1 text-sm bg-white rounded-lg border border-slate-300 px-3 py-1.5 text-slate-800 focus:border-indigo-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleDeleteListItem('desainPembelajaranPemanfaatanDigital', idx)
                  }
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-md transition-colors cursor-pointer"
                  title="Hapus baris"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {(!data.desainPembelajaranPemanfaatanDigital ||
              (Array.isArray(data.desainPembelajaranPemanfaatanDigital) &&
                data.desainPembelajaranPemanfaatanDigital.length === 0)) && (
              <p className="text-xs text-slate-400 italic py-1">
                Belum ada poin pemanfaatan digital. Klik "Tambah Poin" atau gunakan Bantuan AI.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
