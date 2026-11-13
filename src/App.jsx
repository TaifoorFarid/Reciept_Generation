import React, { useState, useEffect } from 'react';
import PrimeViewReceipt from './components/PrimeViewReceipt';
import ReceiptControls from './components/ReceiptControls';
import { CheckCircle2, History, X, Trash2, ArrowRight, Printer, Eye } from 'lucide-react';

const getFormattedDate = () => {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const BLANK_RECEIPT = {
  receiptNo: `PV-SLIP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
  receiptDate: getFormattedDate(),
  paymentReceivedMethod: 'Bank',
  bankName: '',
  accountName: '', // Changed from Transaction / Reference No
  depositDate: getFormattedDate(),
  memberName: '',
  guardianName: '',
  cnicNo: '',
  // Note: membershipNo is removed as requested
  plotNo: '',
  block: '',
  plotSize: '',
  plotType: 'Residential',
  paymentCategory: 'Other',
  paymentCategories: ['Other'],
  otherCategorySpecify: '',
  membershipPlan: 'Installments',
  membershipPlans: ['Installments'],
  onAccountOf: '',
  amountReceived: '',
};

const DEMO_RECEIPT = {
  receiptNo: 'PV-SLIP-2026-5370',
  receiptDate: '13/11/2026',
  paymentReceivedMethod: 'Bank',
  bankName: 'Meezan Bank Limited',
  accountName: 'Prime View Cooperative Housing Society',
  depositDate: '13/11/2026',
  memberName: 'Malik Kamran Munir',
  guardianName: 'Munir Ahmed',
  cnicNo: '13101-9876543-1',
  plotNo: '142',
  block: 'Block-B',
  plotSize: '5',
  plotType: 'Residential',
  paymentCategory: 'Other',
  paymentCategories: ['Other'],
  otherCategorySpecify: 'Token Fee Deposit',
  membershipPlan: 'Installments',
  membershipPlans: ['Installments'],
  onAccountOf: 'Plot Token Advance & Verification',
  amountReceived: 50000,
};

export default function App() {
  const [copyType, setCopyType] = useState('MEMBER COPY');
  const [toastMessage, setToastMessage] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  // Active form data
  const [receiptData, setReceiptData] = useState(() => {
    const saved = localStorage.getItem('pv_active_receipt');
    return saved ? JSON.parse(saved) : BLANK_RECEIPT;
  });

  // Saved Slips history
  const [savedSlips, setSavedSlips] = useState(() => {
    const saved = localStorage.getItem('pv_saved_slips');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('pv_active_receipt', JSON.stringify(receiptData));
  }, [receiptData]);

  useEffect(() => {
    localStorage.setItem('pv_saved_slips', JSON.stringify(savedSlips));
  }, [savedSlips]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    setReceiptData({
      ...BLANK_RECEIPT,
      receiptNo: `PV-SLIP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      receiptDate: getFormattedDate(),
      depositDate: getFormattedDate(),
    });
    showToast('Form cleared with new receipt number');
  };

  const handleFillSample = () => {
    setReceiptData({ ...DEMO_RECEIPT });
    showToast('Loaded demo data from sample image');
  };

  const handleSaveSlip = () => {
    const newSlip = {
      ...receiptData,
      id: `slip-${Date.now()}`,
      savedAt: new Date().toISOString(),
      copyType,
    };
    setSavedSlips([newSlip, ...savedSlips]);
    showToast(`Slip ${receiptData.receiptNo} saved!`);
  };

  const handleDeleteSlip = (id) => {
    setSavedSlips(savedSlips.filter(s => s.id !== id));
  };

  const handleLoadSlip = (slip) => {
    setReceiptData({ ...slip });
    setShowHistory(false);
    showToast(`Loaded ${slip.receiptNo}`);
  };

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-800 py-4 px-2 sm:px-4 flex flex-col items-center">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="no-print fixed bottom-6 right-6 z-50 bg-[#15533e] text-white px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-bounce border border-emerald-400/30">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* History Drawer Modal */}
      {showHistory && (
        <div className="no-print fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-[#15533e]" />
                <h3 className="font-bold text-sm text-slate-900">Saved Receipt Records ({savedSlips.length})</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setShowHistory(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-2 flex-1">
              {savedSlips.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No saved receipts yet. Click "Save" above to archive copies.
                </div>
              ) : (
                savedSlips.map((slip) => (
                  <div key={slip.id} className="p-3 rounded-xl border border-slate-200 hover:border-emerald-600 bg-slate-50 flex items-center justify-between gap-3 transition">
                    <div>
                      <div className="font-mono font-bold text-xs text-slate-900">{slip.receiptNo}</div>
                      <div className="text-xs text-slate-600">{slip.memberName || 'Unnamed Member'} &bull; PKR {Number(slip.amountReceived || 0).toLocaleString()}</div>
                      <div className="text-[10px] text-slate-400">{new Date(slip.savedAt).toLocaleString()}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleLoadSlip(slip)}
                        className="px-2.5 py-1 text-xs font-semibold bg-[#15533e] text-white rounded-md hover:bg-[#0f402f] transition flex items-center gap-1"
                      >
                        <span>Open</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSlip(slip.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-md transition"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 1-PAGE A4 PRINT PREVIEW MODAL */}
      {showPrintPreview && (
        <div className="no-print fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-start overflow-y-auto p-4 sm:p-6">
          {/* Modal Header */}
          <div className="w-full max-w-[210mm] flex items-center justify-between py-2 text-white mb-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
                1-Page A4 Sheet Guarantee
              </span>
              <span className="text-xs text-slate-300 hidden sm:inline">
                (Page fits 100% on a single printed sheet)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>Print Now</span>
              </button>
              <button
                type="button"
                onClick={() => setShowPrintPreview(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                title="Close Preview"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Actual 210mm x 297mm A4 Paper Canvas */}
          <div className="a4-page-frame">
            <PrimeViewReceipt
              data={receiptData}
              onChange={setReceiptData}
              copyType={copyType}
            />
          </div>
        </div>
      )}

      {/* Top Controls Toolbar */}
      <ReceiptControls
        copyType={copyType}
        setCopyType={setCopyType}
        onPrint={handlePrint}
        onReset={handleReset}
        onFillSample={handleFillSample}
        onSaveSlip={handleSaveSlip}
        savedCount={savedSlips.length}
        onToggleSaved={() => setShowHistory(true)}
        onTogglePreview={() => setShowPrintPreview(true)}
        isPreviewOpen={showPrintPreview}
      />

      {/* Printable Receipt Paper */}
      <div className="print-area w-full flex justify-center">
        <PrimeViewReceipt
          data={receiptData}
          onChange={setReceiptData}
          copyType={copyType}
        />
      </div>

      {/* Footer hint */}
      <div className="no-print mt-4 text-center text-xs text-slate-500 max-w-lg">
        <p className="font-medium">
          📄 Click <span className="font-bold text-[#15533e]">"1-Page Preview"</span> to view the exact A4 sheet boundary, or <span className="font-bold text-[#15533e]">"Print Receipt"</span> to print directly.
        </p>
      </div>

    </div>
  );
}
