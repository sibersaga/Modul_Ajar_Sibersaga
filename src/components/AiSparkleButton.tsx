import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { ModulAjarData } from '../types';

interface AiSparkleButtonProps {
  field: string;
  currentValue?: string;
  context?: Partial<ModulAjarData>;
  onSuccess: (generatedText: string) => void;
  title?: string;
  size?: 'sm' | 'md';
}

export const AiSparkleButton: React.FC<AiSparkleButtonProps> = ({
  field,
  currentValue = '',
  context = {},
  onSuccess,
  title = 'Sempurnakan dengan AI',
  size = 'sm',
}) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);

    try {
      const res = await fetch('/api/ai/autofill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          field,
          text: currentValue,
          context,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Gagal menghasilkan teks (${res.status})`);
      }

      const json = await res.json();
      if (json.data) {
        onSuccess(json.data);
      }
    } catch (err: any) {
      alert(`Terjadi kendala AI: ${err.message || 'Silakan periksa koneksi atau coba lagi'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      id={`ai-btn-${field.replace(/[^a-zA-Z0-9_-]/g, '-')}`}
      onClick={handleClick}
      disabled={loading}
      title={title}
      className={`inline-flex items-center gap-1.5 font-medium rounded-md transition-all cursor-pointer ${
        size === 'sm'
          ? 'px-2.5 py-1 text-xs bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 disabled:opacity-50'
          : 'px-3 py-1.5 text-sm bg-indigo-50 text-indigo-900 border border-indigo-300 hover:bg-indigo-100 disabled:opacity-50'
      }`}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-700" />
      ) : (
        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
      )}
      <span>{loading ? 'Menyusun...' : 'Bantuan AI'}</span>
    </button>
  );
};
