import React, { useState } from 'react';
import { Printer, Copy, Check, FileDown, Sparkles, Hash, Clock, User, Phone, MapPin } from 'lucide-react';

export default function ReceiptPreview({ receipt, store, onSaveToQueue }) {
  const [copied, setCopied] = useState(false);
  const [paperSize, setPaperSize] = useState('thermal'); // 'thermal' (80mm) | 'compact' (58mm) | 'full'

  const subtotal = receipt.items.reduce((acc, item) => acc + (Number(item.price || 0) * Number(item.qty || 1)), 0);
  const discountAmount = (subtotal * (Number(receipt.discountPercent || 0))) / 100;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = (taxableAmount * (Number(receipt.taxPercent || 0))) / 100;
  const grandTotal = taxableAmount + taxAmount;

  const now = new Date();
  const dateStr = receipt.createdAt 
    ? new Date(receipt.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr = receipt.createdAt 
    ? new Date(receipt.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    : now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const textReceipt = `
========================================
       ${store.name.toUpperCase()}
       ${store.tagline || ''}
${store.address} | Tel: ${store.phone}
========================================
TOKEN: ${receipt.tokenNo}
Date: ${dateStr} ${timeStr}
Customer: ${receipt.customerName || 'Walk-in Guest'}
Counter: ${receipt.counterNo || 'Main'} | Category: ${receipt.category?.toUpperCase()}
----------------------------------------
ITEMS:
${receipt.items.map(i => `${i.name.padEnd(22)} x${i.qty}  ${store.currency}${(i.price * i.qty).toFixed(2)}`).join('\n')}
----------------------------------------
Subtotal:       ${store.currency}${subtotal.toFixed(2)}
Discount (${receipt.discountPercent}%): -${store.currency}${discountAmount.toFixed(2)}
Tax (${receipt.taxPercent}%):        +${store.currency}${taxAmount.toFixed(2)}
TOTAL:          ${store.currency}${grandTotal.toFixed(2)}
----------------------------------------
Payment: ${receipt.paymentMethod} (${receipt.paymentStatus})
${receipt.notes ? `Note: ${receipt.notes}\n` : ''}
${store.footerNote}
========================================
`.trim();

    navigator.clipboard.writeText(textReceipt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Top Action Bar (hidden on print) */}
      <div className="no-print w-full flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs mb-4">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <span className="hidden sm:inline">Paper Size:</span>
          <button 
            type="button"
            onClick={() => setPaperSize('thermal')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${paperSize === 'thermal' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Thermal 80mm
          </button>
          <button 
            type="button"
            onClick={() => setPaperSize('compact')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${paperSize === 'compact' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Compact 58mm
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyText}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition"
            title="Copy Text Receipt"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-xs shadow-blue-500/20 active:scale-98 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Slip</span>
          </button>
        </div>
      </div>

      {/* The Printable Thermal Paper */}
      <div 
        id="receipt-print-area"
        className={`print-area receipt-paper transition-all duration-200 rounded-lg border border-slate-200 text-slate-900 receipt-font p-6 ${
          paperSize === 'compact' ? 'max-w-[320px] text-xs' : 'max-w-[400px] text-sm'
        } w-full mx-auto select-text`}
      >
        {/* Top Paper Tear Decoration */}
        <div className="flex justify-center items-center gap-1 pb-3 mb-2 border-b border-dashed border-slate-300 no-print">
          <div className="w-2 h-2 rounded-full bg-slate-300"></div>
          <div className="text-[11px] font-sans uppercase tracking-widest text-slate-400 font-bold">Thermal Receipt</div>
          <div className="w-2 h-2 rounded-full bg-slate-300"></div>
        </div>

        {/* Store Header */}
        <div className="text-center pb-3">
          <h2 className="text-lg font-black tracking-tight uppercase text-slate-900 font-sans">
            {store.name}
          </h2>
          {store.tagline && (
            <p className="text-[11px] text-slate-500 font-sans tracking-wide mt-0.5">{store.tagline}</p>
          )}
          <p className="text-[11px] text-slate-600 mt-1 leading-tight font-sans">
            {store.address}
          </p>
          <p className="text-[11px] text-slate-600 font-sans">
            Tel: {store.phone}
          </p>
        </div>

        {/* Token Callout Box */}
        <div className="my-3 border-2 border-slate-900 bg-slate-50 p-3 rounded-md text-center">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block font-sans">
            Queue Token
          </span>
          <div className="text-3xl font-black text-slate-900 tracking-wider my-0.5">
            {receipt.tokenNo || 'T-001'}
          </div>
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 font-sans uppercase mt-1">
            <span className="bg-slate-200/80 px-2 py-0.5 rounded text-[11px]">
              {receipt.category || 'General'}
            </span>
            {receipt.counterNo && (
              <span className="bg-slate-200/80 px-2 py-0.5 rounded text-[11px]">
                {receipt.counterNo}
              </span>
            )}
            {receipt.tableNo && (
              <span className="bg-slate-200/80 px-2 py-0.5 rounded text-[11px]">
                {receipt.tableNo}
              </span>
            )}
          </div>
        </div>

        {/* Metadata section */}
        <div className="text-[11px] text-slate-600 space-y-1 py-2 border-y border-dashed border-slate-300 font-sans">
          <div className="flex justify-between">
            <span className="text-slate-500">Date & Time:</span>
            <span className="font-medium text-slate-800">{dateStr} {timeStr}</span>
          </div>
          {receipt.customerName && (
            <div className="flex justify-between">
              <span className="text-slate-500">Customer:</span>
              <span className="font-semibold text-slate-800">{receipt.customerName}</span>
            </div>
          )}
          {receipt.customerPhone && (
            <div className="flex justify-between">
              <span className="text-slate-500">Phone:</span>
              <span className="text-slate-800">{receipt.customerPhone}</span>
            </div>
          )}
        </div>

        {/* Line Items Table */}
        <div className="py-3">
          <div className="flex justify-between text-[11px] font-bold uppercase text-slate-600 pb-1 border-b border-slate-300 font-sans">
            <span>Item</span>
            <span className="text-right">Qty &times; Price = Amount</span>
          </div>

          <div className="divide-y divide-slate-100 py-1">
            {receipt.items && receipt.items.length > 0 ? (
              receipt.items.map((item, idx) => {
                const totalItem = (Number(item.qty || 1) * Number(item.price || 0)).toFixed(2);
                return (
                  <div key={item.id || idx} className="py-1.5 flex justify-between items-start gap-2">
                    <div className="flex-1 pr-2">
                      <div className="font-medium text-slate-900 leading-snug">{item.name || 'Unnamed item'}</div>
                      <div className="text-[11px] text-slate-500 font-sans">
                        {item.qty} &times; {store.currency}{Number(item.price || 0).toFixed(2)}
                      </div>
                    </div>
                    <div className="font-bold text-slate-900 text-right whitespace-nowrap">
                      {store.currency}{totalItem}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-2 text-center text-slate-400 text-xs italic">
                No items added yet
              </div>
            )}
          </div>
        </div>

        {/* Financial Calculation Summary */}
        <div className="border-t border-dashed border-slate-300 pt-2 pb-1 space-y-1 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal:</span>
            <span>{store.currency}{subtotal.toFixed(2)}</span>
          </div>

          {receipt.discountPercent > 0 && (
            <div className="flex justify-between text-emerald-700 font-medium">
              <span>Discount ({receipt.discountPercent}%):</span>
              <span>-{store.currency}{discountAmount.toFixed(2)}</span>
            </div>
          )}

          {receipt.taxPercent > 0 && (
            <div className="flex justify-between text-slate-600">
              <span>Tax ({receipt.taxPercent}%):</span>
              <span>+{store.currency}{taxAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="border-t-2 border-slate-900 pt-2 mt-2 flex justify-between text-base font-black text-slate-900">
            <span>TOTAL:</span>
            <span>{store.currency}{grandTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment info */}
        <div className="my-2.5 p-2 bg-slate-50 border border-slate-200 rounded flex justify-between items-center text-xs font-sans">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Payment:</span>
            <span className="font-bold text-slate-800">{receipt.paymentMethod || 'Cash'}</span>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
            receipt.paymentStatus === 'Paid' 
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
              : 'bg-amber-100 text-amber-800 border border-amber-300'
          }`}>
            {receipt.paymentStatus || 'Pending'}
          </span>
        </div>

        {/* Customer Notes */}
        {receipt.notes && (
          <div className="my-2 p-2 bg-amber-50/60 border border-dashed border-amber-200/80 rounded text-[11px] text-amber-900">
            <span className="font-bold">Note: </span>
            <span>{receipt.notes}</span>
          </div>
        )}

        {/* Barcode & Signature Simulation */}
        <div className="text-center pt-3 pb-1">
          {/* Simulated SVG Barcode */}
          <div className="flex justify-center items-center gap-0.5 h-10 px-4 overflow-hidden opacity-85">
            {[4, 2, 6, 1, 3, 5, 2, 1, 4, 6, 2, 3, 1, 5, 4, 2, 3, 1, 6, 2, 4, 3, 1, 5, 2, 4, 1, 3, 5, 2].map((height, i) => (
              <div 
                key={i} 
                className="bg-slate-900" 
                style={{ 
                  width: (i % 3 === 0 ? '3px' : i % 2 === 0 ? '1.5px' : '2px'), 
                  height: `${28 + (height * 2)}px` 
                }} 
              />
            ))}
          </div>
          <div className="text-[10px] tracking-widest text-slate-500 font-mono mt-1">
            *{receipt.tokenNo}-{receipt.category ? receipt.category.slice(0, 3).toUpperCase() : 'GEN'}-{(subtotal * 10).toFixed(0)}*
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-[10px] text-slate-500 pt-2 border-t border-dashed border-slate-300 font-sans leading-tight">
          <p>{store.footerNote}</p>
          <p className="text-[9px] text-slate-400 mt-1">Powered by Token & Receipt Studio</p>
        </div>
      </div>

      {/* Quick Add to Queue Button */}
      {onSaveToQueue && (
        <button
          type="button"
          onClick={() => onSaveToQueue(receipt)}
          className="no-print mt-4 w-full max-w-[400px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-md hover:bg-slate-800 transition active:scale-98"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Save Token to Live Queue & Print</span>
        </button>
      )}
    </div>
  );
}
