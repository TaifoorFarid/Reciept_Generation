import React, { useRef } from 'react';
import { 
  Receipt, 
  CreditCard, 
  User, 
  Home, 
  FileText, 
  Calendar, 
  Building2,
  Check,
  Link
} from 'lucide-react';
import { numberToWords } from '../utils/numberToWords';

export default function PrimeViewReceipt({ data, onChange, copyType = 'MEMBER COPY' }) {
  const receiptDateInputRef = useRef(null);
  const depositDateInputRef = useRef(null);

  const toIsoDate = (dStr) => {
    if (!dStr) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(dStr)) return dStr;
    const parts = dStr.split('/');
    if (parts.length === 3) {
      const [d, m, y] = parts;
      if (d && m && y && y.length === 4) {
        return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
      }
    }
    return '';
  };

  const fromIsoDate = (isoStr) => {
    if (!isoStr) return '';
    const parts = isoStr.split('-');
    if (parts.length === 3) {
      const [y, m, d] = parts;
      return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
    }
    return '';
  };

  const openDatePicker = (ref) => {
    if (!ref.current) return;
    try {
      if (typeof ref.current.showPicker === 'function') {
        ref.current.showPicker();
      } else {
        ref.current.focus();
      }
    } catch {
      ref.current.focus();
    }
  };

  const updateField = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const handleCategorySelect = (category) => {
    const isCurrent = isCategoryChecked(category);
    const updated = isCurrent ? '' : category;
    onChange({
      ...data,
      paymentCategory: updated,
      paymentCategories: updated ? [updated] : []
    });
  };

  const handlePlanSelect = (plan) => {
    const isCurrent = isPlanChecked(plan);
    const updated = isCurrent ? '' : plan;
    onChange({
      ...data,
      membershipPlan: updated,
      membershipPlans: updated ? [updated] : []
    });
  };

  const isCategoryChecked = (cat) => {
    if (data.paymentCategory !== undefined) {
      return data.paymentCategory === cat;
    }
    const arr = data.paymentCategories || [];
    return arr.length > 0 ? arr[0] === cat : false;
  };

  const isPlanChecked = (plan) => {
    if (data.membershipPlan !== undefined) {
      return data.membershipPlan === plan;
    }
    const arr = data.membershipPlans || [];
    return arr.length > 0 ? arr[0] === plan : false;
  };

  const amountInWords = numberToWords(data.amountReceived);

  return (
    <div className="receipt-outer-frame w-full max-w-[800px] mx-auto bg-white rounded-2xl border-2 border-[#15533e] p-2 sm:p-2.5 shadow-xl relative select-text flex flex-col">
      <div className="receipt-inner-frame w-full bg-white rounded-xl border-[1.5px] border-[#15533e] px-5 sm:px-6 py-3 sm:py-3.5 text-slate-800 text-[12px] leading-tight flex-1 flex flex-col justify-between">
      
      {/* ================= HEADER SECTION ================= */}
      <div className="receipt-header relative pb-1 flex-shrink-0">
        <div className="flex items-start justify-between gap-2">
          
          {/* Left: Prime View Society Emblem Logo */}
          <div className="w-20 sm:w-24 flex-shrink-0 pt-0.5 flex flex-col items-center">
            <img 
              src="/assets/prime-view-official-logo.png" 
              alt="Prime View Emblem" 
              className="h-16 sm:h-20 w-auto object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>

          {/* Center: Society Information Letterhead */}
          <div className="flex-1 text-center px-1">
            <h1 className="font-cinzel text-lg sm:text-[22px] font-black tracking-wide text-[#15533e] uppercase leading-tight">
              PRIME VIEW COOPERATIVE
            </h1>
            <h2 className="font-cinzel text-base sm:text-[18px] font-bold tracking-widest text-[#15533e] uppercase leading-tight mb-1">
              HOUSING SOCIETY
            </h2>

            <div className="text-[10px] sm:text-[11px] text-slate-700 space-y-0.5 font-medium">
              <p>
                <span className="font-bold text-slate-900">Head Office:</span> House No. CB-946/2, Near Silk Plaza, Supply, Abbottabad
              </p>
              <p>
                <span className="font-bold text-slate-900">Site Office:</span> Rajoiya Road, Near Bypass Havelian, Abbottabad
              </p>
              <p className="font-semibold text-slate-900">
                <span>Phones:</span> 0333 01 111 12 &nbsp;|&nbsp; +92 312 9980707
              </p>
            </div>

            {/* Decorative Ornamental Divider */}
            <div className="flex justify-center items-center my-1">
              <svg width="34" height="10" viewBox="0 0 40 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 6L10 2L20 10L30 2L38 6" stroke="#b48c48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* Right: Co-operative Department Logo & Copy Badge */}
          <div className="w-20 sm:w-24 flex-shrink-0 flex flex-col items-center pt-0.5 text-center">
            <img 
              src="/assets/coop-official-logo.png" 
              alt="Co-operative Department KPK" 
              className="h-12 sm:h-14 w-auto object-contain mb-1"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            
            <div className="border border-slate-400 rounded-full px-2 py-0.5 w-full max-w-[110px] bg-slate-50/80">
              <span className="block font-bold text-[9px] sm:text-[10px] text-slate-800 leading-tight uppercase tracking-wider">
                {copyType}
              </span>
              <span className="block text-[7px] sm:text-[8px] text-slate-500 font-semibold tracking-tight">
                (OFFICIAL VERIFIED RECEIPT)
              </span>
            </div>
          </div>
        </div>

        {/* PAYMENT RECEIPT Oval Ribbon Banner */}
        <div className="flex items-center justify-center my-2 relative">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[1px] bg-[#c59b27]/70"></div>
          <div className="relative px-6 py-0.5 rounded-full bg-[#e8f2eb] border border-[#a6ceb7]">
            <span className="font-cinzel text-xs sm:text-[13px] font-black tracking-widest text-[#15533e] uppercase">
              PAYMENT RECEIPT
            </span>
          </div>
        </div>
      </div>

      {/* ================= FORM BODY (SECTIONS 1 TO 5) ================= */}
      <div className="receipt-body flex-1 flex flex-col justify-between py-0.5 space-y-1">

      {/* ================= SECTION 1: RECEIPT DETAILS ================= */}
      <div className="my-2">
        <div className="bg-[#e8f2eb] border border-[#bcdbc8] rounded px-2.5 py-0.5 flex items-center gap-1.5 mb-1.5">
          <Receipt className="w-3.5 h-3.5 text-[#15533e]" />
          <span className="text-[10.5px] font-black uppercase tracking-wider text-[#15533e]">
            RECEIPT DETAILS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-1 text-[11.5px]">
          {/* Receipt No */}
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-700 whitespace-nowrap min-w-[75px]">
              Receipt No.
            </span>
            <input
              type="text"
              value={data.receiptNo || ''}
              onChange={(e) => updateField('receiptNo', e.target.value)}
              placeholder="PV-SLIP-2026-5370"
              className="flex-1 px-2.5 py-0.5 bg-white border border-slate-300 rounded font-mono font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          {/* Receipt Date */}
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded bg-[#15533e] text-white flex items-center justify-center flex-shrink-0">
              <Calendar className="w-3 h-3 stroke-[2.5]" />
            </div>
            <span className="font-bold text-slate-700 whitespace-nowrap min-w-[80px]">
              Receipt Date
            </span>
            <div className="relative flex-1">
              <input
                type="text"
                value={data.receiptDate || ''}
                onChange={(e) => updateField('receiptDate', e.target.value)}
                placeholder="13/11/2026"
                className="w-full px-2.5 py-0.5 pr-7 bg-white border border-slate-300 rounded font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
              <button
                type="button"
                onClick={() => openDatePicker(receiptDateInputRef)}
                className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded cursor-pointer transition focus:outline-none"
                title="Select Date from Calendar"
              >
                <Calendar className="w-3.5 h-3.5" />
              </button>
              <input
                ref={receiptDateInputRef}
                type="date"
                value={toIsoDate(data.receiptDate)}
                onChange={(e) => {
                  if (e.target.value) {
                    updateField('receiptDate', fromIsoDate(e.target.value));
                  }
                }}
                className="absolute right-0 bottom-0 w-0 h-0 opacity-0 pointer-events-none"
                tabIndex={-1}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================= SECTION 2: PAYMENT RECEIVED IN ================= */}
      <div className="my-2">
        <div className="bg-[#e8f2eb] border border-[#bcdbc8] rounded px-2.5 py-0.5 flex items-center gap-1.5 mb-1.5">
          <CreditCard className="w-3.5 h-3.5 text-[#15533e]" />
          <span className="text-[10.5px] font-black uppercase tracking-wider text-[#15533e]">
            PAYMENT RECEIVED IN
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 px-1 items-start text-[11.5px]">
          
          {/* Left: Cash, Bank, Cheque Checkboxes */}
          <div className="md:col-span-4 flex items-center justify-between sm:justify-start sm:gap-4 pt-1">
            {[
              { id: 'Cash', label: 'Cash' },
              { id: 'Bank', label: 'Bank' },
              { id: 'Cheque', label: 'Cheque' },
            ].map((method) => {
              const isChecked = data.paymentReceivedMethod === method.id;
              return (
                <label 
                  key={method.id} 
                  className="inline-flex items-center gap-1.5 cursor-pointer select-none font-semibold text-slate-800"
                  onClick={() => updateField('paymentReceivedMethod', method.id)}
                >
                  <div className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center transition ${
                    isChecked ? 'bg-[#15533e] border-[#15533e] text-white' : 'border-slate-400 bg-white'
                  }`}>
                    {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                  <span>{method.label}</span>
                </label>
              );
            })}
          </div>

          {/* Right: Bank Name, Account Name (Changed from Ref), Deposit Date */}
          <div className="md:col-span-8 space-y-1.5 border-t md:border-t-0 md:border-l md:border-slate-200 md:pl-3 pt-1 md:pt-0">
            <div className="flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-[#15533e] flex-shrink-0" />
              <span className="font-bold text-slate-700 min-w-[95px]">
                Bank Name
              </span>
              <span className="text-slate-400 font-bold">:</span>
              <input
                type="text"
                value={data.bankName || ''}
                onChange={(e) => updateField('bankName', e.target.value)}
                placeholder="Bank Name"
                className="flex-1 border-b border-slate-300 pb-0.5 px-1 bg-transparent text-slate-800 font-medium focus:outline-none focus:border-emerald-600"
              />
            </div>

            {/* Changed from 'Transaction / Reference No.' to 'Account Name' as requested */}
            <div className="flex items-center gap-2 pl-5.5">
              <span className="font-bold text-slate-700 min-w-[95px]">
                Account Name
              </span>
              <span className="text-slate-400 font-bold">:</span>
              <input
                type="text"
                value={data.accountName || ''}
                onChange={(e) => updateField('accountName', e.target.value)}
                placeholder="Account Name"
                className="flex-1 border-b border-slate-300 pb-0.5 px-1 bg-transparent text-slate-800 font-medium focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="flex items-center gap-2 pl-5.5">
              <span className="font-bold text-slate-700 min-w-[95px]">
                Deposit Date
              </span>
              <span className="text-slate-400 font-bold">:</span>
              <div className="relative flex-1">
                <input
                  type="text"
                  value={data.depositDate || ''}
                  onChange={(e) => updateField('depositDate', e.target.value)}
                  placeholder="13/11/2026"
                  className="w-full border-b border-slate-300 pb-0.5 px-1 pr-6 bg-transparent text-slate-800 font-medium focus:outline-none focus:border-emerald-600"
                />
                <button
                  type="button"
                  onClick={() => openDatePicker(depositDateInputRef)}
                  className="absolute right-0.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded cursor-pointer transition focus:outline-none"
                  title="Select Date from Calendar"
                >
                  <Calendar className="w-3.5 h-3.5" />
                </button>
                <input
                  ref={depositDateInputRef}
                  type="date"
                  value={toIsoDate(data.depositDate)}
                  onChange={(e) => {
                    if (e.target.value) {
                      updateField('depositDate', fromIsoDate(e.target.value));
                    }
                  }}
                  className="absolute right-0 bottom-0 w-0 h-0 opacity-0 pointer-events-none"
                  tabIndex={-1}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ================= SECTION 3: MEMBER DETAILS ================= */}
      {/* Note: 'Membership No.' was removed as requested */}
      <div className="my-2">
        <div className="bg-[#e8f2eb] border border-[#bcdbc8] rounded px-2.5 py-0.5 flex items-center gap-1.5 mb-1.5">
          <User className="w-3.5 h-3.5 text-[#15533e]" />
          <span className="text-[10.5px] font-black uppercase tracking-wider text-[#15533e]">
            MEMBER DETAILS
          </span>
        </div>

        <div className="space-y-1.5 px-1 text-[11.5px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Member Name */}
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-700 whitespace-nowrap min-w-[50px]">
                Name
              </span>
              <span className="text-slate-400 font-bold">:</span>
              <input
                type="text"
                value={data.memberName || ''}
                onChange={(e) => updateField('memberName', e.target.value)}
                placeholder="Member Name"
                className="flex-1 border-b border-slate-300 pb-0.5 px-1 bg-transparent text-slate-800 font-medium focus:outline-none focus:border-emerald-600"
              />
            </div>

            {/* Father's / Husband's Name */}
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-700 whitespace-nowrap min-w-[145px]">
                Father's / Husband's Name
              </span>
              <span className="text-slate-400 font-bold">:</span>
              <input
                type="text"
                value={data.guardianName || ''}
                onChange={(e) => updateField('guardianName', e.target.value)}
                placeholder="Father's / Husband's Name"
                className="flex-1 border-b border-slate-300 pb-0.5 px-1 bg-transparent text-slate-800 font-medium focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          {/* CNIC No. (Membership No. removed) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-700 whitespace-nowrap min-w-[50px]">
                CNIC No.
              </span>
              <span className="text-slate-400 font-bold">:</span>
              <input
                type="text"
                value={data.cnicNo || ''}
                onChange={(e) => updateField('cnicNo', e.target.value)}
                placeholder="XXXXX-XXXXXXX-X"
                className="flex-1 border-b border-slate-300 pb-0.5 px-1 bg-transparent text-slate-800 font-mono font-medium focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div className="hidden sm:block"></div>
          </div>
        </div>
      </div>

      {/* ================= SECTION 4: PROPERTY DETAILS ================= */}
      <div className="my-2">
        <div className="bg-[#e8f2eb] border border-[#bcdbc8] rounded px-2.5 py-0.5 flex items-center gap-1.5 mb-1.5">
          <Home className="w-3.5 h-3.5 text-[#15533e]" />
          <span className="text-[10.5px] font-black uppercase tracking-wider text-[#15533e]">
            PROPERTY DETAILS
          </span>
        </div>

        <div className="space-y-1.5 px-1 text-[11.5px]">
          {/* Row 1: Plot No & Block */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-700 whitespace-nowrap min-w-[55px]">
                Plot No.
              </span>
              <span className="text-slate-400 font-bold">:</span>
              <input
                type="text"
                value={data.plotNo || ''}
                onChange={(e) => updateField('plotNo', e.target.value)}
                placeholder="Plot No."
                className="flex-1 border-b border-slate-300 pb-0.5 px-1 bg-transparent text-slate-800 font-medium focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-700 whitespace-nowrap min-w-[55px]">
                Block
              </span>
              <span className="text-slate-400 font-bold">:</span>
              <input
                type="text"
                value={data.block || ''}
                onChange={(e) => updateField('block', e.target.value)}
                placeholder="Block"
                className="flex-1 border-b border-slate-300 pb-0.5 px-1 bg-transparent text-slate-800 font-medium focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Row 2: Plot Size & Plot Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-700 whitespace-nowrap min-w-[55px]">
                Plot Size
              </span>
              <span className="text-slate-400 font-bold">:</span>
              <input
                type="text"
                value={data.plotSize || ''}
                onChange={(e) => updateField('plotSize', e.target.value)}
                placeholder="Plot Size"
                className="flex-1 border-b border-slate-300 pb-0.5 px-1 bg-transparent text-slate-800 font-medium focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-slate-700 whitespace-nowrap min-w-[55px]">
                Plot Type
              </span>
              <span className="text-slate-400 font-bold">:</span>
              <div className="flex items-center gap-2 flex-wrap text-[11px]">
                {['Residential', 'Commercial', 'Farm Houses'].map((type) => {
                  const isChecked = (data.plotType || 'Residential') === type;
                  return (
                    <label
                      key={type}
                      className="inline-flex items-center gap-1 cursor-pointer select-none font-semibold text-slate-800"
                      onClick={() => updateField('plotType', type)}
                    >
                      <div className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center ${
                        isChecked ? 'bg-[#15533e] border-[#15533e] text-white' : 'border-slate-400 bg-white'
                      }`}>
                        {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                      <span className={type === 'Residential' ? 'font-bold' : ''}>
                        {type}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= SECTION 5: PAYMENT DETAILS ================= */}
      <div className="my-2">
        <div className="bg-[#e8f2eb] border border-[#bcdbc8] rounded px-2.5 py-0.5 flex items-center gap-1.5 mb-1.5">
          <FileText className="w-3.5 h-3.5 text-[#15533e]" />
          <span className="text-[10.5px] font-black uppercase tracking-wider text-[#15533e]">
            PAYMENT DETAILS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-1 py-1 text-[11.5px]">
          
          {/* Left Column: PAYMENT CATEGORY */}
          <div>
            <h4 className="font-black text-[11px] text-slate-800 uppercase tracking-wider mb-1.5">
              PAYMENT CATEGORY
            </h4>

            <div className="grid grid-cols-2 gap-y-1.5 gap-x-2">
              {[
                'Installment',
                'Full settlement',
                'Booking',
                'Transfer Fee',
                'Down Payment',
                'Other',
              ].map((cat) => {
                const checked = isCategoryChecked(cat);
                return (
                  <label
                    key={cat}
                    className="inline-flex items-center gap-1.5 cursor-pointer select-none font-medium text-slate-800"
                    onClick={() => handleCategorySelect(cat)}
                  >
                    <div className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center transition ${
                      checked ? 'bg-[#15533e] border-[#15533e] text-white' : 'border-slate-400 bg-white'
                    }`}>
                      {checked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                    <span>{cat}</span>
                  </label>
                );
              })}
            </div>

            {/* Other Specify field */}
            <div className="mt-2 flex items-center gap-1.5">
              <span className="font-bold text-slate-700 whitespace-nowrap">
                Other Specify:
              </span>
              <input
                type="text"
                value={data.otherCategorySpecify || ''}
                onChange={(e) => updateField('otherCategorySpecify', e.target.value)}
                placeholder="Specify payment category..."
                className="flex-1 border-b border-slate-300 pb-0.5 px-1 bg-transparent text-slate-800 font-medium focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Right Column: MEMBERSHIP PLAN (with Token Fee added!) */}
          <div className="border-t md:border-t-0 md:border-l md:border-slate-200 md:pl-4 pt-2 md:pt-0">
            <h4 className="font-black text-[11px] text-slate-800 uppercase tracking-wider mb-1.5">
              MEMBERSHIP PLAN
            </h4>

            {/* Checkboxes: Full Payment, Installments, Token Fee (New!) */}
            <div className="flex items-center flex-wrap gap-3 mb-2">
              {[
                'Full Payment',
                'Installments',
                'Token Fee', // Added as instructed!
              ].map((plan) => {
                const checked = isPlanChecked(plan);
                return (
                  <label
                    key={plan}
                    className="inline-flex items-center gap-1.5 cursor-pointer select-none font-medium text-slate-800"
                    onClick={() => handlePlanSelect(plan)}
                  >
                    <div className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center transition ${
                      checked ? 'bg-[#15533e] border-[#15533e] text-white' : 'border-slate-400 bg-white'
                    }`}>
                      {checked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                    <span>
                      {plan}
                    </span>
                  </label>
                );
              })}
            </div>

            {/* On Account Of */}
            <div className="flex items-center gap-1.5 mt-2">
              <span className="font-bold text-slate-700 whitespace-nowrap min-w-[85px]">
                On Account Of
              </span>
              <span className="text-slate-400 font-bold">:</span>
              <input
                type="text"
                value={data.onAccountOf || ''}
                onChange={(e) => updateField('onAccountOf', e.target.value)}
                placeholder="On Account Of"
                className="flex-1 border-b border-slate-300 pb-0.5 px-1 bg-transparent text-slate-800 font-medium focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

        </div>

        {/* BOTTOM ROW: Amount Received (Number) & IN WORDS (Automatic English Conversion) */}
        <div className="mt-2.5 p-2.5 bg-[#e8f2eb] border border-[#bcdbc8] rounded-lg flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Left: Amount Received Number Input */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="w-6 h-6 rounded-full bg-[#15533e] flex items-center justify-center text-white flex-shrink-0">
              <Link className="w-3.5 h-3.5 rotate-45 stroke-[2.5]" />
            </div>
            
            <div className="flex items-center gap-2 flex-1 md:flex-initial">
              <span className="font-bold text-[11px] uppercase text-slate-800 whitespace-nowrap">
                Amount Received
              </span>
              
              <div className="flex items-center bg-white border border-slate-300 rounded px-2 py-0.5">
                <span className="font-black text-xs text-slate-700 mr-1">PKR</span>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={data.amountReceived ?? ''}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/[^0-9]/g, '');
                    updateField('amountReceived', numericValue);
                  }}
                  placeholder="0"
                  className="w-24 sm:w-32 text-xs sm:text-sm font-black text-slate-900 bg-transparent focus:outline-none text-right pr-1"
                />
                <span className="font-bold text-slate-400 ml-0.5">/-</span>
              </div>
            </div>
          </div>

          {/* Right: IN WORDS (Automatically converted!) */}
          <div className="w-full md:flex-1 md:pl-3 border-t md:border-t-0 md:border-l md:border-[#bcdbc8] pt-1.5 md:pt-0">
            <div className="text-[9.5px] font-black uppercase tracking-wider text-slate-500 mb-0.5">
              IN WORDS
            </div>
            <div className="font-bold text-[11.5px] text-[#15533e] italic min-h-[18px] leading-snug">
              {amountInWords}
            </div>
          </div>

        </div>
      </div>
      </div>

      {/* ================= FOOTER (CENTER ALIGNED & NO-BREAK FORMATTING) ================= */}
      <div className="receipt-footer mt-2 pt-1.5 border-t border-slate-300 text-center font-sans text-slate-700 flex-shrink-0">
        <h4 className="font-cinzel text-[11.5px] sm:text-xs font-black tracking-wide text-slate-900 uppercase mb-1">
          PRIME VIEW COOPERATIVE HOUSING SOCIETY LIMITED
        </h4>
        <div className="text-[9.5px] sm:text-[10px] text-slate-600 space-y-0.5 leading-snug flex flex-col items-center justify-center">
          <p className="inline-block whitespace-normal sm:whitespace-nowrap">
            <span className="font-bold text-slate-800">Head Office:</span> House No. CB-946/2, Near Silk Plaza, Supply, Abbottabad
          </p>
          <p className="inline-block whitespace-normal sm:whitespace-nowrap">
            &bull; <span className="font-bold text-slate-800">Site Office:</span> Rajoiya Road, Near Bypass Havelian, Abbottabad
          </p>
          <p className="inline-block whitespace-nowrap text-slate-800">
            &bull; <span className="font-bold text-slate-800">Contact:</span> <span className="whitespace-nowrap font-bold">0333 01 111 12</span> &nbsp;|&nbsp; <span className="whitespace-nowrap font-bold">+92 312 9980707</span>
          </p>
        </div>
      </div>

    </div>
  </div>
);
}
