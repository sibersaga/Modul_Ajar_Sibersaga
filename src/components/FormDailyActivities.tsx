import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  Trash2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Layers,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { ModulAjarData, HariKegiatan, DetailKegiatanItem } from '../types';
import { AiSparkleButton } from './AiSparkleButton';
import {
  PRINSIP_DEEP_LEARNING_OPTIONS,
  getSintaksOptions,
  inferDefaultPrinsip,
  inferDefaultSintaks,
} from '../data/learningModels';

interface FormDailyActivitiesProps {
  data: ModulAjarData;
  onChange: (field: keyof ModulAjarData, value: any) => void;
  validationErrors?: Record<string, string>;
  showErrors?: boolean;
}

export const FormDailyActivities: React.FC<FormDailyActivitiesProps> = ({
  data,
  onChange,
  validationErrors = {},
  showErrors = false,
}: FormDailyActivitiesProps) => {
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  const kegiatanHarian = data.kegiatanHarian || [];
  const hasError = showErrors && Boolean(validationErrors.kegiatanHarianValid);

  const handleUpdateDay = (dayIndex: number, updatedDay: HariKegiatan) => {
    const nextList = [...kegiatanHarian];
    nextList[dayIndex] = updatedDay;
    onChange('kegiatanHarian', nextList);
  };

  const handleAddDay = () => {
    const nextDayNum = kegiatanHarian.length + 1;
    const defaultTahap = nextDayNum <= 2 ? 'MEMAHAMI' : nextDayNum <= 4 ? 'MENGAPLIKASI' : 'MEREFLEKSI';
    const newDay: HariKegiatan = {
      hari: nextDayNum,
      tahap: defaultTahap,
      kegiatan: [
        {
          jp: 1,
          judul: `Aktivitas Belajar Hari ${nextDayNum}`,
          prinsipDeepLearning: inferDefaultPrinsip(defaultTahap, 0),
          sintaksModel: inferDefaultSintaks(data.modelPembelajaran, nextDayNum - 1, 0, nextDayNum),
          dimensi: 'Penalaran Kritis & Kolaborasi',
          alatBahan: 'Buku, alat tulis, media ajar',
          deskripsi: 'Guru memfasilitasi eksplorasi peserta didik mengenai topik pembelajaran.',
          langkah: ['Mengamati fenomena/materi', 'Berdiskusi bersama', 'Mencatat pemahaman'],
        },
      ],
    };
    const nextList = [...kegiatanHarian, newDay];
    onChange('kegiatanHarian', nextList);
    setActiveDayIndex(nextList.length - 1);
  };

  const handleDeleteDay = (dayIndex: number) => {
    if (kegiatanHarian.length <= 1) {
      alert('Minimal harus terdapat 1 hari kegiatan pembelajaran.');
      return;
    }
    const nextList = kegiatanHarian.filter((_, idx) => idx !== dayIndex).map((d, i) => ({
      ...d,
      hari: i + 1,
    }));
    onChange('kegiatanHarian', nextList);
    setActiveDayIndex(Math.max(0, activeDayIndex - 1));
  };

  const handleAddKegiatan = (dayIndex: number) => {
    const day = kegiatanHarian[dayIndex];
    if (!day) return;
    const nextJp = day.kegiatan.length + 1;
    const newKeg: DetailKegiatanItem = {
      jp: nextJp,
      judul: `Kegiatan ${nextJp}`,
      prinsipDeepLearning: inferDefaultPrinsip(day.tahap, nextJp - 1),
      sintaksModel: inferDefaultSintaks(data.modelPembelajaran, dayIndex, nextJp - 1, kegiatanHarian.length),
      dimensi: 'Kemandirian & Kreativitas',
      alatBahan: 'Perlengkapan belajar',
      deskripsi: 'Deskripsi aktivitas bermain/belajar bermakna.',
      langkah: ['Langkah awal', 'Langkah inti pelaksanaan'],
    };
    handleUpdateDay(dayIndex, {
      ...day,
      kegiatan: [...day.kegiatan, newKeg],
    });
  };

  const handleDeleteKegiatan = (dayIndex: number, kegIndex: number) => {
    const day = kegiatanHarian[dayIndex];
    if (!day || day.kegiatan.length <= 1) {
      alert('Minimal ada 1 kegiatan per hari.');
      return;
    }
    const newKegiatan = day.kegiatan.filter((_, idx) => idx !== kegIndex).map((k, i) => ({
      ...k,
      jp: i + 1,
    }));
    handleUpdateDay(dayIndex, {
      ...day,
      kegiatan: newKegiatan,
    });
  };

  const handleUpdateKegiatan = (
    dayIndex: number,
    kegIndex: number,
    updatedKeg: Partial<DetailKegiatanItem>
  ) => {
    const day = kegiatanHarian[dayIndex];
    if (!day) return;
    const nextKegList = [...day.kegiatan];
    nextKegList[kegIndex] = {
      ...nextKegList[kegIndex],
      ...updatedKeg,
    };
    handleUpdateDay(dayIndex, {
      ...day,
      kegiatan: nextKegList,
    });
  };

  const activeDay = kegiatanHarian[activeDayIndex] || kegiatanHarian[0];

  return (
    <div id="section-kegiatan-harian" className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 md:p-6 mb-6">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              3. Rencana Pelaksanaan Pembelajaran (Dinamis Harian)
            </h2>
            <p className="text-xs text-slate-500">
              Rangkaian alur belajar Deep Learning (Memahami, Mengaplikasi, Merefleksi) tersusun per hari.
            </p>
          </div>
        </div>
        {hasError && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
            <AlertCircle className="w-3.5 h-3.5" /> {validationErrors.kegiatanHarianValid || 'Kegiatan belum lengkap'}
          </span>
        )}
      </div>

      {/* Kegiatan Awal */}
      <div className="mb-6 bg-slate-50 rounded-xl p-4 border border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
            Kegiatan Awal (Orientasi, Apersepsi, Pemantik Semangat)
          </label>
          <AiSparkleButton
            field="rencanaPelaksanaanAwal"
            currentValue={data.rencanaPelaksanaanAwal?.join('\n')}
            context={data}
            onSuccess={(val) => {
              const lines = val.split('\n').map((l) => l.replace(/^[•\-\d.]\s*/, '').trim()).filter(Boolean);
              onChange('rencanaPelaksanaanAwal', lines);
            }}
          />
        </div>
        <div className="space-y-2">
          {(data.rencanaPelaksanaanAwal || []).map((item, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="text-xs font-semibold text-slate-400 mt-2">{idx + 1}.</span>
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const updated = [...(data.rencanaPelaksanaanAwal || [])];
                  updated[idx] = e.target.value;
                  onChange('rencanaPelaksanaanAwal', updated);
                }}
                className="flex-1 text-sm bg-white rounded-lg border border-slate-300 px-3 py-1.5 text-slate-800 focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  const updated = (data.rencanaPelaksanaanAwal || []).filter((_, i) => i !== idx);
                  onChange('rencanaPelaksanaanAwal', updated);
                }}
                className="p-1.5 text-slate-400 hover:text-red-600 rounded-md transition-colors"
                title="Hapus baris"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              onChange('rencanaPelaksanaanAwal', [...(data.rencanaPelaksanaanAwal || []), '']);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 mt-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Poin Kegiatan Awal
          </button>
        </div>
      </div>

      {/* Kegiatan Inti (Tabel Harian) */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Kegiatan Inti Pembelajaran Berkesadaran (Hari 1 s/d {kegiatanHarian.length})
            </h3>
            <p className="text-xs text-slate-500">
              Klik tab hari di bawah untuk mengatur kegiatan pembelajaran pada hari tersebut.
            </p>
          </div>
          <button
            type="button"
            id="tambah-hari-btn"
            onClick={handleAddDay}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-all cursor-pointer self-start"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Hari
          </button>
        </div>

        {/* Day Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 mb-4">
          {kegiatanHarian.map((hari, idx) => {
            const isActive = idx === activeDayIndex;
            return (
              <button
                type="button"
                key={hari.hari}
                onClick={() => setActiveDayIndex(idx)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-t-lg font-semibold text-xs whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50/50 border-indigo-600 text-indigo-700 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>Hari {hari.hari}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-sm font-medium ${
                    hari.tahap === 'MEMAHAMI'
                      ? 'bg-blue-100 text-blue-800'
                      : hari.tahap === 'MENGAPLIKASI'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {hari.tahap}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Day Detail Panel */}
        {activeDay && (
          <div className="bg-slate-50/60 rounded-xl border border-slate-200 p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 mb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-800">
                  Pengaturan Hari ke-{activeDay.hari}
                </span>
                <div className="flex items-center gap-1.5">
                  <label htmlFor="select-tahap" className="text-xs text-slate-500">
                    Tahap Deep Learning:
                  </label>
                  <select
                    id="select-tahap"
                    value={activeDay.tahap}
                    onChange={(e) =>
                      handleUpdateDay(activeDayIndex, {
                        ...activeDay,
                        tahap: e.target.value as any,
                      })
                    }
                    className="text-xs font-semibold bg-white border border-slate-300 rounded-md px-2 py-1 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="MEMAHAMI">MEMAHAMI (Understanding)</option>
                    <option value="MENGAPLIKASI">MENGAPLIKASI (Applying)</option>
                    <option value="MEREFLEKSI">MEREFLEKSI (Reflecting)</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDeleteDay(activeDayIndex)}
                className="text-xs text-red-600 hover:text-red-700 font-medium inline-flex items-center gap-1 self-start cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Hapus Hari {activeDay.hari}
              </button>
            </div>

            {/* List of Activities for this Day */}
            <div className="space-y-4">
              {activeDay.kegiatan.map((keg, kegIdx) => (
                <div
                  key={kegIdx}
                  className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs relative"
                >
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                        {keg.jp}
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        Kegiatan {kegIdx + 1} (Jam Pelajaran {keg.jp})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <AiSparkleButton
                        field={`kegiatanHari${activeDay.hari}Jp${keg.jp}`}
                        currentValue={`${keg.judul}: ${keg.deskripsi}`}
                        context={data}
                        onSuccess={(val) => {
                          handleUpdateKegiatan(activeDayIndex, kegIdx, {
                            deskripsi: val,
                          });
                        }}
                        title="Sempurnakan kegiatan ini dengan AI"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteKegiatan(activeDayIndex, kegIdx)}
                        className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                        title="Hapus kegiatan ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Judul Kegiatan
                      </label>
                      <input
                        type="text"
                        value={keg.judul}
                        onChange={(e) =>
                          handleUpdateKegiatan(activeDayIndex, kegIdx, {
                            judul: e.target.value,
                          })
                        }
                        placeholder="Contoh: Mengamati Cermin & Mengenal Diri"
                        className="w-full text-xs rounded-lg border border-slate-300 px-2.5 py-1.5 text-slate-800 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Dimensi Profil yang Dituju
                      </label>
                      <input
                        type="text"
                        value={keg.dimensi || ''}
                        onChange={(e) =>
                          handleUpdateKegiatan(activeDayIndex, kegIdx, {
                            dimensi: e.target.value,
                          })
                        }
                        placeholder="Contoh: Kemandirian, Penalaran Kritis"
                        className="w-full text-xs rounded-lg border border-slate-300 px-2.5 py-1.5 text-slate-800 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Prinsip Utama Deep Learning & Sintaks Model Pembelajaran */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-3 p-3 bg-slate-50/70 rounded-lg border border-slate-200">
                    {/* Prinsip Deep Learning */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-emerald-800 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          Prinsip Utama Deep Learning
                        </label>
                        <span className="text-[10px] text-slate-400">Pilih cepat / ketik</span>
                      </div>
                      <input
                        type="text"
                        value={keg.prinsipDeepLearning || ''}
                        onChange={(e) =>
                          handleUpdateKegiatan(activeDayIndex, kegIdx, {
                            prinsipDeepLearning: e.target.value,
                          })
                        }
                        placeholder="Pilih atau tulis prinsip deep learning..."
                        className="w-full text-xs rounded-lg border border-slate-300 px-2.5 py-1.5 text-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none mb-1.5 bg-white"
                      />
                      {/* Quick chip buttons */}
                      <div className="flex flex-wrap gap-1">
                        {PRINSIP_DEEP_LEARNING_OPTIONS.slice(0, 4).map((prinsip) => (
                          <button
                            type="button"
                            key={prinsip}
                            onClick={() =>
                              handleUpdateKegiatan(activeDayIndex, kegIdx, {
                                prinsipDeepLearning: prinsip,
                              })
                            }
                            className={`text-[10px] px-1.5 py-0.5 rounded border transition-colors cursor-pointer ${
                              keg.prinsipDeepLearning === prinsip
                                ? 'bg-emerald-600 text-white border-emerald-600 font-semibold'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700'
                            }`}
                          >
                            {prinsip.split(' ')[0]}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sintaks Model Pembelajaran */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-sky-800 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                          Sintaks Model Pembelajaran
                        </label>
                        <span className="text-[10px] text-sky-600 truncate max-w-[130px]" title={data.modelPembelajaran}>
                          {data.modelPembelajaran || 'Model'}
                        </span>
                      </div>
                      <input
                        type="text"
                        value={keg.sintaksModel || ''}
                        onChange={(e) =>
                          handleUpdateKegiatan(activeDayIndex, kegIdx, {
                            sintaksModel: e.target.value,
                          })
                        }
                        placeholder="Pilih atau tulis sintaks tahap model..."
                        className="w-full text-xs rounded-lg border border-slate-300 px-2.5 py-1.5 text-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none mb-1.5 bg-white"
                      />
                      {/* Quick chip buttons */}
                      <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
                        {getSintaksOptions(data.modelPembelajaran).map((sintaks, sIdx) => {
                          const isSelected = keg.sintaksModel === sintaks;
                          const shortLabel = sintaks.split(':')[0] || `Tahap ${sIdx + 1}`;
                          return (
                            <button
                              type="button"
                              key={sintaks}
                              title={sintaks}
                              onClick={() =>
                                handleUpdateKegiatan(activeDayIndex, kegIdx, {
                                  sintaksModel: sintaks,
                                })
                              }
                              className={`text-[10px] px-1.5 py-0.5 rounded border transition-colors cursor-pointer truncate max-w-[130px] ${
                                isSelected
                                  ? 'bg-sky-600 text-white border-sky-600 font-semibold'
                                  : 'bg-white text-slate-600 border-slate-200 hover:bg-sky-50 hover:text-sky-700'
                              }`}
                            >
                              {shortLabel}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Alat dan Bahan
                    </label>
                    <input
                      type="text"
                      value={keg.alatBahan || ''}
                      onChange={(e) =>
                        handleUpdateKegiatan(activeDayIndex, kegIdx, {
                          alatBahan: e.target.value,
                        })
                      }
                      placeholder="Contoh: Cermin besar, gambar telapak tangan, kertas gambar"
                      className="w-full text-xs rounded-lg border border-slate-300 px-2.5 py-1.5 text-slate-800 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Uraian Pelaksanaan & Langkah Bermain/Belajar
                    </label>
                    <textarea
                      rows={3}
                      value={keg.deskripsi}
                      onChange={(e) =>
                        handleUpdateKegiatan(activeDayIndex, kegIdx, {
                          deskripsi: e.target.value,
                        })
                      }
                      placeholder="Uraikan bagaimana guru memfasilitasi dan bagaimana anak aktif terlibat..."
                      className="w-full text-xs rounded-lg border border-slate-300 px-2.5 py-1.5 text-slate-800 focus:border-indigo-500 focus:outline-none resize-y"
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => handleAddKegiatan(activeDayIndex)}
                className="w-full py-2 border-2 border-dashed border-indigo-200 rounded-xl text-xs font-semibold text-indigo-600 hover:bg-indigo-50/50 hover:border-indigo-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Tambah Kegiatan di Hari ke-{activeDay.hari}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Kegiatan Penutup */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
            Kegiatan Penutup (Refleksi, Penguatan, Doa)
          </label>
          <AiSparkleButton
            field="rencanaPelaksanaanPenutup"
            currentValue={data.rencanaPelaksanaanPenutup?.join('\n')}
            context={data}
            onSuccess={(val) => {
              const lines = val.split('\n').map((l) => l.replace(/^[•\-\d.]\s*/, '').trim()).filter(Boolean);
              onChange('rencanaPelaksanaanPenutup', lines);
            }}
          />
        </div>
        <div className="space-y-2">
          {(data.rencanaPelaksanaanPenutup || []).map((item, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="text-xs font-semibold text-slate-400 mt-2">{idx + 1}.</span>
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const updated = [...(data.rencanaPelaksanaanPenutup || [])];
                  updated[idx] = e.target.value;
                  onChange('rencanaPelaksanaanPenutup', updated);
                }}
                className="flex-1 text-sm bg-white rounded-lg border border-slate-300 px-3 py-1.5 text-slate-800 focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  const updated = (data.rencanaPelaksanaanPenutup || []).filter((_, i) => i !== idx);
                  onChange('rencanaPelaksanaanPenutup', updated);
                }}
                className="p-1.5 text-slate-400 hover:text-red-600 rounded-md transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              onChange('rencanaPelaksanaanPenutup', [...(data.rencanaPelaksanaanPenutup || []), '']);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 mt-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Poin Kegiatan Penutup
          </button>
        </div>
      </div>
    </div>
  );
};
