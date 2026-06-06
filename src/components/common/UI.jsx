// ============================================================
// SHARED UI COMPONENTS – Modal, Section, QR mock, Badges, etc.
// ============================================================
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

// ---------- Modal cơ bản ----------
export function Modal({ open, onClose, title, children, size = 'md', footer = null }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  const sizeCls = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  }[size];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
         onClick={onClose}>
      <div className={`w-full ${sizeCls} bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col`}
           onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-military-600 to-military-500 text-white">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-white/15 transition">
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto p-5 scroll-thin">{children}</div>
        {footer && (
          <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- Section card ----------
export function Section({ title, subtitle, action, children, className = '' }) {
  return (
    <section className={`card p-4 sm:p-5 ${className}`}>
      {(title || action) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div>
            {title && <h2 className="text-base sm:text-lg font-semibold text-slate-800">{title}</h2>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="flex gap-2 flex-wrap">{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

// ---------- StatusPill / Badge ----------
export function StatusPill({ status, list }) {
  const item = list.find(x => x.key === status) || list[0];
  return <span className={`badge ${item.color}`}>{item.label}</span>;
}

// ---------- QR Code mock (canvas, không cần thư viện) ----------
export function QRCanvas({ value, size = 80 }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const N = 21;          // 21x21 mạng giả lập QR
    const cell = size / N;
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#0f1f14';
    // Hash đơn giản từ value
    let seed = 0;
    for (let i = 0; i < value.length; i++) seed = (seed * 31 + value.charCodeAt(i)) >>> 0;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 0xffffffff;
    };
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        if (rand() > 0.55) ctx.fillRect(x * cell, y * cell, cell, cell);
      }
    }
    // 3 finder pattern ở 3 góc
    const drawFinder = (cx, cy) => {
      ctx.fillStyle = '#ffffff'; ctx.fillRect(cx*cell, cy*cell, 7*cell, 7*cell);
      ctx.fillStyle = '#0f1f14'; ctx.fillRect(cx*cell, cy*cell, 7*cell, 7*cell);
      ctx.fillStyle = '#ffffff'; ctx.fillRect((cx+1)*cell, (cy+1)*cell, 5*cell, 5*cell);
      ctx.fillStyle = '#0f1f14'; ctx.fillRect((cx+2)*cell, (cy+2)*cell, 3*cell, 3*cell);
    };
    drawFinder(0, 0);
    drawFinder(N-7, 0);
    drawFinder(0, N-7);
  }, [value, size]);

  return <canvas ref={canvasRef} width={size} height={size} className="rounded border border-slate-300 bg-white" />;
}

// ---------- Empty state ----------
export function EmptyState({ icon: Icon, title, hint }) {
  return (
    <div className="text-center py-10 text-slate-400">
      {Icon && <Icon size={42} className="mx-auto mb-2 opacity-40" />}
      <p className="font-medium text-slate-500">{title}</p>
      {hint && <p className="text-xs mt-1">{hint}</p>}
    </div>
  );
}

// ---------- Confirm dialog ----------
export function ConfirmDialog({ open, onClose, onConfirm, title = 'Xác nhận', message }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm"
      footer={<>
        <button className="btn-outline" onClick={onClose}>Hủy</button>
        <button className="btn-danger" onClick={() => { onConfirm(); onClose(); }}>Đồng ý</button>
      </>}>
      <p className="text-slate-700">{message}</p>
    </Modal>
  );
}
