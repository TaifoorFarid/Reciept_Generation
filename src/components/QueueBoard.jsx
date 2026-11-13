import React, { useState } from 'react';
import { Volume2, CheckCircle2, Clock, Play, Trash2, Printer, Search, ArrowRight, User, Phone, AlertCircle } from 'lucide-react';

export default function QueueBoard({ queue, onUpdateStatus, onRemoveToken, onSelectToken, currency = '$' }) {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [announcing, setAnnouncing] = useState(null);

  // Announce token with Voice Synthesis
  const handleAnnounce = (token) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `Token number ${token.tokenNo.replace('-', ' ')}. Please proceed to ${token.counterNo || 'the service counter'}.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      setAnnouncing(token.id);
      utterance.onend = () => setAnnouncing(null);
      utterance.onerror = () => setAnnouncing(null);
      window.speechSynthesis.speak(utterance);
    } else {
      alert(`Calling Token: ${token.tokenNo} to ${token.counterNo || 'Counter'}`);
    }
  };

  const currentServing = queue.find((q) => q.status === 'serving');
  const nextInLine = queue.find((q) => q.status === 'waiting');

  const filteredQueue = queue.filter((item) => {
    const matchesFilter = filter === 'all' ? true : item.status === filter;
    const matchesSearch = 
      item.tokenNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.customerName && item.customerName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const countWaiting = queue.filter((q) => q.status === 'waiting').length;
  const countServing = queue.filter((q) => q.status === 'serving').length;
  const countCompleted = queue.filter((q) => q.status === 'completed').length;
  const totalRevenue = queue
    .filter((q) => q.status !== 'cancelled')
    .reduce((acc, q) => {
      const sub = (q.items || []).reduce((s, it) => s + (it.price * it.qty), 0);
      return acc + sub;
    }, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner: Real-time Call Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Currently Serving Box */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-blue-400/40">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
              </span>
              <span className="text-xs uppercase font-extrabold tracking-wider text-blue-100">
                Now Calling / Serving
              </span>
            </div>
            {currentServing && (
              <button
                type="button"
                onClick={() => handleAnnounce(currentServing)}
                className={`p-2 rounded-lg bg-white/10 hover:bg-white/20 transition ${announcing === currentServing.id ? 'ring-2 ring-white animate-pulse' : ''}`}
                title="Voice Call"
              >
                <Volume2 className="w-4 h-4 text-white" />
              </button>
            )}
          </div>

          <div className="py-4 text-center">
            {currentServing ? (
              <div>
                <div className="text-5xl font-black tracking-tight drop-shadow-sm font-mono">
                  {currentServing.tokenNo}
                </div>
                <div className="text-sm font-semibold text-blue-100 mt-2">
                  {currentServing.customerName || 'Walk-in Customer'} &bull; {currentServing.counterNo || 'Main Counter'}
                </div>
              </div>
            ) : (
              <div className="py-4 text-blue-200 text-sm font-medium">
                No token currently being served.
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2 border-t border-blue-400/30">
            {currentServing && (
              <button
                type="button"
                onClick={() => onUpdateStatus(currentServing.id, 'completed')}
                className="flex-1 py-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Completed</span>
              </button>
            )}
            {nextInLine && (
              <button
                type="button"
                onClick={() => {
                  if (currentServing) onUpdateStatus(currentServing.id, 'completed');
                  onUpdateStatus(nextInLine.id, 'serving');
                  handleAnnounce(nextInLine);
                }}
                className="flex-1 py-2 px-3 rounded-lg bg-white text-blue-700 hover:bg-blue-50 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Call Next ({nextInLine.tokenNo})</span>
              </button>
            )}
          </div>
        </div>

        {/* Queue Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Waiting</span>
            <div className="text-3xl font-black text-amber-600 my-1">{countWaiting}</div>
            <span className="text-[11px] text-slate-400">In line for service</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Completed</span>
            <div className="text-3xl font-black text-emerald-600 my-1">{countCompleted}</div>
            <span className="text-[11px] text-slate-400">Tokens served today</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Active Queue</span>
            <div className="text-3xl font-black text-blue-600 my-1">{queue.length}</div>
            <span className="text-[11px] text-slate-400">Total tokens issued</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Queue Sales</span>
            <div className="text-2xl font-black text-slate-800 my-1 truncate">
              {currency}{totalRevenue.toFixed(2)}
            </div>
            <span className="text-[11px] text-slate-400">Total bill value</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
          {['all', 'waiting', 'serving', 'completed', 'cancelled'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg capitalize transition ${
                filter === tab
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search token # or name..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" />
        </div>
      </div>

      {/* Queue List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {filteredQueue.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <AlertCircle className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-sm font-medium">No tokens found</p>
            <p className="text-xs">Create and issue new tokens from the Generator tab</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredQueue.map((item) => {
              const itemTotal = (item.items || []).reduce((acc, it) => acc + (it.price * it.qty), 0);
              return (
                <div
                  key={item.id}
                  className="p-4 hover:bg-slate-50/80 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-14 text-center py-2 bg-slate-100 rounded-xl border border-slate-200 font-mono font-black text-sm text-slate-800">
                      {item.tokenNo}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">
                          {item.customerName || 'Walk-in Guest'}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          item.status === 'serving' ? 'bg-blue-100 text-blue-700 animate-pulse' :
                          item.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                          item.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {item.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span>{item.counterNo || 'Counter 1'}</span>
                        <span>&bull;</span>
                        <span>{item.items?.length || 0} items</span>
                        <span>&bull;</span>
                        <span className="font-bold text-slate-800">{currency}{itemTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleAnnounce(item)}
                      className="p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition"
                      title="Announce by Voice"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectToken(item)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                      title="View & Edit Receipt"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Slip</span>
                    </button>

                    {item.status === 'waiting' && (
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateStatus(item.id, 'serving');
                          handleAnnounce(item);
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition"
                      >
                        Serve
                      </button>
                    )}

                    {item.status === 'serving' && (
                      <button
                        type="button"
                        onClick={() => onUpdateStatus(item.id, 'completed')}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition"
                      >
                        Complete
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onRemoveToken(item.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                      title="Delete from Queue"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
