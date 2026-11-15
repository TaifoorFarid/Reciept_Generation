import React, { useState, useEffect } from 'react';
import PrimeViewReceipt from './components/PrimeViewReceipt';
import ReceiptControls from './components/ReceiptControls';
import { 
  CheckCircle2, 
  History, 
  X, 
  Trash2, 
  ArrowRight, 
  Printer, 
  RefreshCw, 
  Search, 
  AlertTriangle, 
  Loader2 
} from 'lucide-react';
import { supabase } from './supabaseClient';

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
  const [a4Scale, setA4Scale] = useState(1);
  const [isLoadingSlips, setIsLoadingSlips] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [slipToDelete, setSlipToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // Fetch receipts from Supabase on mount
  const fetchSlipsFromSupabase = async () => {
    setIsLoadingSlips(true);
    try {
      const { data, error } = await supabase
        .from('receipts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Could not fetch from Supabase:', error.message);
        return;
      }

      if (data) {
        const mapped = data.map((row) => ({
          id: row.id,
          receiptNo: row.receipt_no,
          receiptDate: row.receipt_date,
          paymentReceivedMethod: row.payment_received_method,
          bankName: row.bank_name,
          accountName: row.account_name,
          depositDate: row.deposit_date,
          memberName: row.member_name,
          guardianName: row.guardian_name,
          cnicNo: row.cnic_no,
          plotNo: row.plot_no,
          block: row.block,
          plotSize: row.plot_size,
          plotType: row.plot_type,
          paymentCategory: row.payment_category,
          paymentCategories: row.payment_categories || ['Other'],
          otherCategorySpecify: row.other_category_specify,
          membershipPlan: row.membership_plan,
          membershipPlans: row.membership_plans || ['Installments'],
          onAccountOf: row.on_account_of,
          amountReceived: row.amount_received,
          copyType: row.copy_type || 'MEMBER COPY',
          savedAt: row.created_at,
          ...(row.raw_data || {}),
        }));
        setSavedSlips(mapped);
      }
    } catch (err) {
      console.warn('Supabase fetch failed:', err);
    } finally {
      setIsLoadingSlips(false);
    }
  };

  useEffect(() => {
    fetchSlipsFromSupabase();
  }, []);

  useEffect(() => {
    localStorage.setItem('pv_active_receipt', JSON.stringify(receiptData));
  }, [receiptData]);

  useEffect(() => {
    localStorage.setItem('pv_saved_slips', JSON.stringify(savedSlips));
  }, [savedSlips]);

  // Compute A4 scale whenever preview opens or window resizes
  useEffect(() => {
    if (!showPrintPreview) return;

    const computeScale = () => {
      // A4 in pixels at 96 DPI: 210mm × 297mm
      const a4WidthPx  = (210 / 25.4) * 96;
      const a4HeightPx = (297 / 25.4) * 96;

      // Available space inside the modal (viewport minus header bar + padding)
      const availW = window.innerWidth  - 32;   // 16px padding each side
      const availH = window.innerHeight - 100;  // ~100px for the modal header

      const scaleByW = availW  / a4WidthPx;
      const scaleByH = availH  / a4HeightPx;
      const scale    = Math.min(scaleByW, scaleByH, 1); // never scale up beyond 1
      setA4Scale(scale);
    };

    computeScale();
    window.addEventListener('resize', computeScale);
    return () => window.removeEventListener('resize', computeScale);
  }, [showPrintPreview]);

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

  const handleSaveSlip = async () => {
    if (!receiptData.receiptNo || !receiptData.receiptNo.trim()) {
      showToast('Please enter a Receipt Number before saving');
      return;
    }

    if (!receiptData.memberName?.trim() && !receiptData.amountReceived) {
      showToast('Please enter Member Name or Amount before saving');
      return;
    }

    setIsSaving(true);
    try {
      const recordToInsert = {
        receipt_no: receiptData.receiptNo.trim(),
        receipt_date: receiptData.receiptDate || null,
        payment_received_method: receiptData.paymentReceivedMethod || 'Bank',
        bank_name: receiptData.bankName || null,
        account_name: receiptData.accountName || null,
        deposit_date: receiptData.depositDate || null,
        member_name: receiptData.memberName?.trim() || null,
        guardian_name: receiptData.guardianName?.trim() || null,
        cnic_no: receiptData.cnicNo?.trim() || null,
        plot_no: receiptData.plotNo || null,
        block: receiptData.block || null,
        plot_size: receiptData.plotSize || null,
        plot_type: receiptData.plotType || 'Residential',
        payment_category: receiptData.paymentCategory || 'Other',
        payment_categories: receiptData.paymentCategories || [],
        other_category_specify: receiptData.otherCategorySpecify || null,
        membership_plan: receiptData.membershipPlan || 'Installments',
        membership_plans: receiptData.membershipPlans || [],
        on_account_of: receiptData.onAccountOf || null,
        amount_received: Number(receiptData.amountReceived) || 0,
        copy_type: copyType,
        raw_data: { ...receiptData, copyType },
      };

      const { data, error } = await supabase
        .from('receipts')
        .insert([recordToInsert])
        .select()
        .single();

      if (error) {
        console.warn('Supabase save error, saving locally:', error);
        const fallbackSlip = {
          ...receiptData,
          id: `slip-${Date.now()}`,
          savedAt: new Date().toISOString(),
          copyType,
        };
        setSavedSlips((prev) => [fallbackSlip, ...prev]);
        showToast(`Saved locally (offline fallback)`);
      } else {
        const newSlip = {
          ...receiptData,
          id: data.id,
          savedAt: data.created_at,
          copyType: data.copy_type || copyType,
        };
        setSavedSlips((prev) => [newSlip, ...prev.filter((s) => s.id !== data.id)]);
        showToast(`Slip ${receiptData.receiptNo} saved to Database!`);
      }
    } catch (err) {
      console.error('Save failed:', err);
      const fallbackSlip = {
        ...receiptData,
        id: `slip-${Date.now()}`,
        savedAt: new Date().toISOString(),
        copyType,
      };
      setSavedSlips((prev) => [fallbackSlip, ...prev]);
      showToast(`Saved locally`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRequestDelete = (slip) => {
    setSlipToDelete(slip);
  };

  const handleConfirmDelete = async () => {
    if (!slipToDelete) return;
    const targetId = slipToDelete.id;
    setIsDeleting(true);

    try {
      if (targetId && !String(targetId).startsWith('slip-')) {
        const { error } = await supabase.from('receipts').delete().eq('id', targetId);
        if (error) {
          console.warn('Supabase delete error:', error.message);
        }
      }
      setSavedSlips((prev) => prev.filter((s) => s.id !== targetId));
      showToast(`Receipt ${slipToDelete.receiptNo} deleted`);
    } catch (err) {
      console.error('Delete failed:', err);
      setSavedSlips((prev) => prev.filter((s) => s.id !== targetId));
      showToast('Deleted locally');
    } finally {
      setIsDeleting(false);
      setSlipToDelete(null);
    }
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
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={fetchSlipsFromSupabase}
                  disabled={isLoadingSlips}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-slate-100 transition"
                  title="Refresh from Supabase"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingSlips ? 'animate-spin' : ''}`} />
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowHistory(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Search filter bar */}
            <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by receipt no, member, CNIC, or plot..."
                className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="p-4 overflow-y-auto space-y-2 flex-1">
              {savedSlips.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No saved receipts yet. Click "Save to Cloud" above to archive copies.
                </div>
              ) : (
                (() => {
                  const filtered = savedSlips.filter((s) => {
                    if (!searchQuery.trim()) return true;
                    const q = searchQuery.toLowerCase();
                    return (
                      (s.receiptNo && s.receiptNo.toLowerCase().includes(q)) ||
                      (s.memberName && s.memberName.toLowerCase().includes(q)) ||
                      (s.cnicNo && s.cnicNo.toLowerCase().includes(q)) ||
                      (s.plotNo && s.plotNo.toLowerCase().includes(q))
                    );
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="py-8 text-center text-slate-400 text-xs">
                        No receipts match "{searchQuery}".
                      </div>
                    );
                  }

                  return filtered.map((slip) => (
                    <div key={slip.id} className="p-3 rounded-xl border border-slate-200 hover:border-emerald-600 bg-slate-50 flex items-center justify-between gap-3 transition">
                      <div>
                        <div className="font-mono font-bold text-xs text-slate-900">{slip.receiptNo}</div>
                        <div className="text-xs text-slate-600">
                          {slip.memberName || 'Unnamed Member'} &bull; PKR {Number(slip.amountReceived || 0).toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {slip.plotNo ? `Plot #${slip.plotNo} (${slip.block || 'No block'}) • ` : ''}
                          {new Date(slip.savedAt).toLocaleString()}
                        </div>
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
                          onClick={() => handleRequestDelete(slip)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-md transition"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ));
                })()
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {slipToDelete && (
        <div className="no-print fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-50 text-red-600 flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Delete Receipt?</h4>
                <p className="text-xs text-slate-500">This record will be permanently deleted from the database.</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
              <div className="font-mono font-bold text-slate-900">{slipToDelete.receiptNo}</div>
              <div className="text-slate-600">
                {slipToDelete.memberName || 'Unnamed Member'} &bull; PKR {Number(slipToDelete.amountReceived || 0).toLocaleString()}
              </div>
              {slipToDelete.plotNo && (
                <div className="text-[11px] text-slate-400">
                  Plot: {slipToDelete.plotNo} ({slipToDelete.block || 'No block'})
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setSlipToDelete(null)}
                disabled={isDeleting}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition shadow-sm"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1-PAGE A4 PRINT PREVIEW MODAL */}
      {showPrintPreview && (
        <div className="no-print fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-start overflow-hidden p-4 sm:p-6">
          {/* Modal Header */}
          <div className="w-full flex items-center justify-between py-2 text-white mb-3 flex-shrink-0 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
                1-Page A4 Sheet Guarantee
              </span>
              <span className="text-xs text-slate-300 hidden sm:inline">
                (Scaled to fit your screen — prints full A4)
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

          {/* Scaled A4 canvas — always fits the viewport entirely */}
          <div
            className="a4-preview-scaler flex-shrink-0"
            style={{ '--a4-scale': a4Scale }}
          >
            <div
              className="a4-page-frame"
              style={{ '--a4-scale': a4Scale }}
            >
              <PrimeViewReceipt
                data={receiptData}
                onChange={setReceiptData}
                copyType={copyType}
              />
            </div>
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
        isSaving={isSaving}
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
