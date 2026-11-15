import React from 'react';
import { Printer, RotateCcw, Cloud, History, Eye, Loader2 } from 'lucide-react';

export default function ReceiptControls({
  copyType,
  setCopyType,
  onPrint,
  onReset,
  _onFillSample,
  onSaveSlip,
  isSaving = false,
  savedCount,
  onToggleSaved,
  onTogglePreview,
  isPreviewOpen
}) {
  return (
    <div className="no-print w-full max-w-[800px] mx-auto mb-3 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-3 shadow-xs flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-between gap-2.5">
      {/* Copy Type Selector */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">
          Voucher:
        </span>
        {['MEMBER COPY', 'OFFICE COPY', 'BANK COPY'].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setCopyType(type)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${
              copyType === type
                ? 'bg-[#15533e] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {type.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
          title="Clear all fields"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear</span>
        </button>

        {onSaveSlip && (
          <button
            type="button"
            onClick={onSaveSlip}
            disabled={isSaving}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              isSaving
                ? 'bg-emerald-100 text-emerald-600 cursor-not-allowed border border-emerald-200'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
            }`}
            title="Save receipt data to Supabase database"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Cloud className="w-3.5 h-3.5" />
                <span>Save to Cloud</span>
              </>
            )}
          </button>
        )}

        {onToggleSaved && (
          <button
            type="button"
            onClick={onToggleSaved}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
            title="View saved records"
          >
            <History className="w-3.5 h-3.5 text-slate-600" />
            <span>Records</span>
            {savedCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.5 bg-emerald-700 text-white rounded-full text-[9px]">
                {savedCount}
              </span>
            )}
          </button>
        )}

        {/* 1-Page Preview Toggle */}
        <button
          type="button"
          onClick={onTogglePreview}
          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
            isPreviewOpen 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
          }`}
          title="View exact 1-page A4 print preview"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>1-Page Preview</span>
        </button>

        {/* Direct Print Button */}
        <button
          type="button"
          onClick={onPrint}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-black bg-[#15533e] hover:bg-[#0f402f] text-white shadow-md shadow-emerald-950/20 active:scale-98 transition"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Receipt</span>
        </button>
      </div>
    </div>
  );
}
