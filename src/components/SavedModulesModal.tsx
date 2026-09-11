import React, { useState, useEffect } from 'react';
import {
  X,
  FolderArchive,
  Save,
  Download,
  Upload,
  Trash2,
  Calendar,
  BookOpen,
  Check
} from 'lucide-react';
import { ModulAjarData } from '../types';

interface SavedModulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentData: ModulAjarData;
  onLoadModule: (data: ModulAjarData) => void;
}

export const SavedModulesModal: React.FC<SavedModulesModalProps> = ({
  isOpen,
  onClose,
  currentData,
  onLoadModule,
}) => {
  const [savedList, setSavedList] = useState<ModulAjarData[]>([]);
  const [saveTitle, setSaveTitle] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadSavedFromStorage();
      setSaveTitle(currentData.temaSubtema || 'Modul Ajar Saya');
    }
  }, [isOpen]);

  const loadSavedFromStorage = () => {
    try {
      const raw = localStorage.getItem('modul_ajar_saved_list');
      if (raw) {
        setSavedList(JSON.parse(raw));
      } else {
        setSavedList([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleSaveCurrent = () => {
    try {
      const newEntry: ModulAjarData = {
        ...currentData,
        id: currentData.id || `modul-${Date.now()}`,
        judulModul: saveTitle.trim() || currentData.temaSubtema || 'Modul Ajar',
        updatedAt: new Date().toISOString(),
      };

      const existing = [...savedList];
      const index = existing.findIndex((m) => m.id === newEntry.id);
      if (index >= 0) {
        existing[index] = newEntry;
      } else {
        existing.unshift(newEntry);
      }

      localStorage.setItem('modul_ajar_saved_list', JSON.stringify(existing));
      setSavedList(existing);
      showToast('Modul ajar berhasil disimpan ke arsip!');
    } catch (e: any) {
      alert('Gagal menyimpan ke penyimpanan lokal: ' + e.message);
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Hapus modul ajar ini dari arsip?')) return;
    const filtered = savedList.filter((m) => m.id !== id);
    localStorage.setItem('modul_ajar_saved_list', JSON.stringify(filtered));
    setSavedList(filtered);
    showToast('Modul dihapus dari arsip.');
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `Modul_Ajar_${(currentData.temaSubtema || 'Backup').replace(/[^a-zA-Z0-9_-]/g, '_')}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          onLoadModule(parsed);
          onClose();
          showToast('Modul berhasil diimpor!');
        } catch (err: any) {
          alert('File JSON tidak valid: ' + err.message);
        }
      };
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
              <FolderArchive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Kelola Arsip Modul Ajar
              </h3>
              <p className="text-xs text-slate-500">
                Simpan, buka, atau ekspor modul ajar di penyimpanan pribadi Anda
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Save Current Bar */}
        <div className="p-4 bg-indigo-50/50 border-b border-indigo-100 flex flex-col sm:flex-row items-center gap-2.5">
          <input
            type="text"
            value={saveTitle}
            onChange={(e) => setSaveTitle(e.target.value)}
            placeholder="Judul modul saat ini..."
            className="w-full sm:flex-1 text-xs font-medium rounded-lg border border-indigo-200 bg-white px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="button"
            onClick={handleSaveCurrent}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-all active:scale-98 cursor-pointer whitespace-nowrap"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan Modul Ini</span>
          </button>
        </div>

        {/* Toast */}
        {toast && (
          <div className="bg-emerald-500 text-white text-xs px-4 py-2 text-center font-medium flex items-center justify-center gap-1.5">
            <Check className="w-3.5 h-3.5" /> {toast}
          </div>
        )}

        {/* Saved List Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Daftar Modul Tersimpan ({savedList.length})
            </h4>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportJson}
                className="text-[11px] font-semibold text-slate-600 hover:text-indigo-600 inline-flex items-center gap-1 cursor-pointer"
                title="Unduh backup data modul aktif berupa file JSON"
              >
                <Download className="w-3.5 h-3.5" /> Ekspor JSON
              </button>
              <label
                className="text-[11px] font-semibold text-slate-600 hover:text-indigo-600 inline-flex items-center gap-1 cursor-pointer"
                title="Buka file backup JSON dari komputer"
              >
                <Upload className="w-3.5 h-3.5" /> Impor JSON
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJson}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {savedList.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl">
              <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-600">Belum ada modul yang tersimpan</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Ketik nama judul di atas lalu klik "Simpan Modul Ini".
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {savedList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onLoadModule(item);
                    onClose();
                  }}
                  className="p-3 rounded-xl border border-slate-200 hover:border-indigo-300 bg-white hover:bg-indigo-50/30 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-bold text-slate-800 group-hover:text-indigo-700 truncate">
                      {item.judulModul || item.temaSubtema || 'Modul Ajar Tanpa Judul'}
                    </h5>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                      <span>{item.namaSekolah || 'Sekolah'}</span>
                      <span>•</span>
                      <span>Fase {item.fase} ({item.kelas})</span>
                      <span>•</span>
                      <span>{item.alokasiWaktu}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleDelete(item.id || '', e)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      title="Hapus dari arsip"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
