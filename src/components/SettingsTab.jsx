import React from 'react';
import { Store, DollarSign, Percent, Save, RefreshCw } from 'lucide-react';
import { DEFAULT_STORE } from '../data/sampleData';

export default function SettingsTab({ store, onSave, onResetDefaults }) {
  const [formData, setFormData] = React.useState(store);
  const [saved, setSaved] = React.useState(false);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Store & Receipt Configuration</h2>
            <p className="text-xs text-slate-500">Custom business name, address, tax, and branding on receipts</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setFormData(DEFAULT_STORE);
            onResetDefaults();
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Default</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Store / Business Name
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tagline / Slogan
            </label>
            <input
              type="text"
              value={formData.tagline || ''}
              onChange={(e) => handleChange('tagline', e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Quality Fast Food & Cafe"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Branch / Location
            </label>
            <input
              type="text"
              value={formData.branch || ''}
              onChange={(e) => handleChange('branch', e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Contact Phone
            </label>
            <input
              type="text"
              value={formData.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Physical Address
          </label>
          <input
            type="text"
            value={formData.address || ''}
            onChange={(e) => handleChange('address', e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Currency Symbol
            </label>
            <select
              value={formData.currency || '$'}
              onChange={(e) => handleChange('currency', e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="$">$ (USD)</option>
              <option value="€">€ (EUR)</option>
              <option value="£">£ (GBP)</option>
              <option value="₨">₨ (PKR / INR)</option>
              <option value="₹">₹ (INR)</option>
              <option value="AED">AED</option>
              <option value="SAR">SAR</option>
              <option value="¥">¥ (JPY / CNY)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Default Tax Rate (%)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={formData.taxRate ?? 0}
              onChange={(e) => handleChange('taxRate', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Default Counter Name
            </label>
            <input
              type="text"
              value={formData.counterName || 'Counter 01'}
              onChange={(e) => handleChange('counterName', e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Receipt Footer Note / Terms
          </label>
          <textarea
            rows={2}
            value={formData.footerNote || ''}
            onChange={(e) => handleChange('footerNote', e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition active:scale-98"
          >
            <Save className="w-4 h-4" />
            <span>{saved ? 'Saved Successfully!' : 'Save Store Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
