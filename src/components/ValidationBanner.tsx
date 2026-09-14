import React from 'react';
import { AlertCircle, CheckCircle2, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';
import { ValidationSummary } from '../utils/validation';

interface ValidationBannerProps {
  summary: ValidationSummary;
  showErrors: boolean;
  onGoToField: (elementId: string) => void;
  onOpenValidationModal: () => void;
}

export const ValidationBanner: React.FC<ValidationBannerProps> = ({
  summary,
  showErrors,
  onGoToField,
  onOpenValidationModal,
}) => {
  const { isValid, errors, completedCount, totalRequired, percentComplete } = summary;

  // Calculate segment progress
  const sections = [
    { id: 'identitas', title: 'Identitas' },
    { id: 'capaian', title: 'Capaian' },
    { id: 'rpp', title: 'RPP' },
    { id: 'asesmen', title: 'Asesmen' },
  ];

  const getSectionStatus = (sectionId: string) => {
    // We import REQUIRED_FIELDS_CONFIG from validation.ts but since it's hard to import directly here without breaking,
    // let's just infer from the errors. If an error's section matches sectionId, the section is not fully complete.
    const sectionErrors = errors.filter(e => e.section === sectionId);
    if (sectionErrors.length === 0) return 'complete';
    return 'incomplete';
  };

  return (
    <div className="mb-6 space-y-3 sticky top-4 z-40">
      {/* Interactive Progress & Status Bar */}
      <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl p-4 shadow-md flex flex-col gap-4">
        
        {/* Top summary row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm shadow-xs ${
                isValid
                  ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white border border-emerald-500'
                  : percentComplete >= 75
                  ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white border border-amber-500'
                  : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white border border-indigo-500'
              }`}
            >
              {percentComplete}%
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Kelengkapan Modul Ajar: {completedCount} dari {totalRequired} Bidang Wajib
                </h3>
                {isValid ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" /> Siap Unduh
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                    <AlertCircle className="w-3 h-3" /> {errors.length} Bidang Kosong
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {isValid
                  ? 'Seluruh komponen penting telah lengkap. Anda dapat mengunduh berkas Word (.docx) atau mencetak langsung.'
                  : 'Selesaikan pengisian agar modul memenuhi format baku Kurikulum Merdeka.'}
              </p>
            </div>
          </div>
          {!isValid && (
            <button
              type="button"
              onClick={onOpenValidationModal}
              className="text-xs font-semibold px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Lihat Detail Kosong
            </button>
          )}
        </div>

        {/* Segmented Progress Bar indicating missing parts */}
        <div className="flex items-center gap-1 h-3 mt-1">
          {sections.map((section, idx) => {
            const status = getSectionStatus(section.id);
            return (
              <div 
                key={section.id} 
                className="flex-1 h-full flex flex-col group relative"
                title={`${section.title} - ${status === 'complete' ? 'Lengkap' : 'Belum Lengkap'}`}
              >
                <div 
                  className={`w-full h-full rounded-full transition-colors duration-300 ${
                    status === 'complete' 
                      ? 'bg-emerald-500' 
                      : 'bg-slate-200 border border-slate-300'
                  } ${idx === 0 ? 'rounded-l-full' : ''} ${idx === sections.length - 1 ? 'rounded-r-full' : ''}`}
                ></div>
                {/* Tooltip on hover */}
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white px-2 py-0.5 rounded shadow-sm border border-slate-200">
                  {section.title} {status === 'complete' ? '✅' : '❌'}
                </span>
              </div>
            );
          })}
        </div>
        
      </div>

      {/* Prominent Warning Banner if user attempted an action and there are missing fields */}
      {showErrors && !isValid && (
        <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-xl border-y border-r border-rose-200 shadow-xs animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-rose-900">
                  Perhatian: {errors.length} bidang wajib belum diisi
                </h4>
                <p className="text-xs text-rose-700 mt-0.5">
                  Mohon lengkapi data yang ditandai merah di bawah ini sebelum melanjutkan unduh atau cetak.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 pl-7 sm:pl-0">
              {errors.slice(0, 3).map((err) => (
                <button
                  key={err.field}
                  type="button"
                  onClick={() => onGoToField(err.elementId)}
                  className="text-[11px] font-semibold px-2 py-1 rounded-md bg-white text-rose-800 border border-rose-300 hover:bg-rose-100 transition-colors inline-flex items-center gap-1 cursor-pointer"
                  title={`Lompat ke ${err.label}`}
                >
                  <span>{err.label.split('(')[0].trim()}</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </button>
              ))}
              {errors.length > 3 && (
                <button
                  type="button"
                  onClick={onOpenValidationModal}
                  className="text-[11px] font-bold text-rose-700 hover:text-rose-900 underline px-1 cursor-pointer"
                >
                  +{errors.length - 3} lainnya
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
