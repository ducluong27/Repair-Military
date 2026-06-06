// ============================================================
// PHÂN HỆ 6 — KCS ĐIỆN TỬ
// ============================================================
import React, { useMemo, useState } from 'react';
import {
  ClipboardCheck, Save, X, Printer, FileCheck2, AlertCircle, CheckCircle2, XCircle
} from 'lucide-react';
import { Modal, Section } from '../common/UI';
import { KCS_STANDARDS, PROCESS_STAGES, genId, fmtDate } from '../../data/mockData';

const FIELDS = [
  { key: 'gap',         step: 0.001 },
  { key: 'taper',       step: 0.001 },
  { key: 'oval',        step: 0.001 },
  { key: 'pressure',    step: 0.1 },
  { key: 'temperature', step: 1 },
  { key: 'roughness',   step: 0.1 },
  { key: 'dimension',   step: 0.01 },
];

const emptyReading = { gap:0, taper:0, oval:0, pressure:0, temperature:0, roughness:0, dimension:0 };

function checkValue(key, val) {
  const std = KCS_STANDARDS[key];
  if (val < std.min) return { ok:false, type:'low' };
  if (val > std.max) return { ok:false, type:'high' };
  return { ok:true };
}

export default function KCS({ db, setDb, canEdit, currentRole }) {
  const [selectedVeh, setSelectedVeh] = useState('XE-001');
  const [stage, setStage]   = useState(4);
  const [readings, setReadings] = useState(emptyReading);
  const [note, setNote]     = useState('');
  const [receipt, setReceipt] = useState(null);

  const veh = db.vehicles.find(v => v.id === selectedVeh);
  const flow = db.processFlow[selectedVeh] || [];
  const stageData = flow.find(s => s.stage === stage);

  const isKCSRole = currentRole === 'kcs' || currentRole === 'admin' || currentRole === 'engineer';

  const setField = (k, v) => setReadings(r => ({...r, [k]: parseFloat(v) || 0}));

  const verdict = useMemo(() => {
    const fails = FIELDS.filter(f => !checkValue(f.key, readings[f.key]).ok);
    return fails.length === 0 ? 'pass' : 'fail';
  }, [readings]);

  const save = () => {
    if (!readings.gap && !readings.pressure) {
      alert('Vui lòng nhập tối thiểu các thông số đo kiểm');
      return;
    }
    const record = {
      id: genId('KCS'),
      vehicleId: selectedVeh,
      stage,
      date: '2026-06-06',
      inspector: 'Đại úy Lê Văn Cường',
      readings: {...readings},
      verdict,
      note
    };
    const next = [record, ...db.kcsResults];
    let nextDb = {...db, kcsResults: next};

    // Nếu đạt → cập nhật processFlow đánh dấu approvedKCS = true
    if (verdict === 'pass') {
      const nextFlow = (nextDb.processFlow[selectedVeh] || []).map(s =>
        s.stage === stage ? {...s, approvedKCS: true} : s
      );
      nextDb.processFlow = {...nextDb.processFlow, [selectedVeh]: nextFlow};
    }
    setDb(nextDb);
    setReceipt({...record, vehicle: veh, stageName: PROCESS_STAGES.find(s=>s.id===stage).name});
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <Section title="KCS điện tử" subtitle="Nhập thông số đo kiểm – Tự động so sánh tiêu chuẩn kỹ thuật">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Form */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-military-50 rounded-lg border border-military-100">
              <div>
                <label className="label">Phương tiện</label>
                <select className="input" value={selectedVeh} onChange={e => setSelectedVeh(e.target.value)}>
                  {db.vehicles.map(v => <option key={v.id} value={v.id}>{v.id} · {v.model}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Công đoạn KCS</label>
                <select className="input" value={stage} onChange={e => setStage(parseInt(e.target.value))}>
                  {PROCESS_STAGES.map(s => <option key={s.id} value={s.id}>{s.code} · {s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Ngày kiểm</label>
                <input type="date" className="input" defaultValue="2026-06-06"/>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                <ClipboardCheck size={16} className="text-military-600"/> Bảng thông số đo kiểm
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {FIELDS.map(f => {
                  const std = KCS_STANDARDS[f.key];
                  const val = readings[f.key];
                  const ck = checkValue(f.key, val);
                  return (
                    <div key={f.key} className={`p-2.5 border rounded-lg ${!ck.ok ? 'border-rose-300 bg-rose-50/40' : 'border-slate-200 bg-white'}`}>
                      <label className="label flex items-center justify-between">
                        <span>{std.label}</span>
                        <span className="text-[10px] font-mono text-slate-500">[{std.min} – {std.max}]</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <input type="number" step={f.step} className="input" value={val}
                               onChange={e => setField(f.key, e.target.value)}
                               disabled={!isKCSRole}/>
                        {val !== 0 && (
                          !ck.ok
                            ? <XCircle size={18} className="text-rose-500 shrink-0"/>
                            : <CheckCircle2 size={18} className="text-emerald-500 shrink-0"/>
                        )}
                      </div>
                      {!ck.ok && val !== 0 && (
                        <p className="text-[10px] text-rose-600 mt-1 flex items-center gap-1">
                          <AlertCircle size={10}/> {ck.type === 'low' ? 'Dưới' : 'Vượt'} ngưỡng cho phép
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="label">Ghi chú đánh giá</label>
              <textarea rows="2" className="input" value={note} onChange={e => setNote(e.target.value)} placeholder="Nhận xét của KCS viên..." disabled={!isKCSRole}/>
            </div>

            <div className={`p-3 rounded-lg border-2 ${verdict === 'pass' ? 'bg-emerald-50 border-emerald-300' : 'bg-rose-50 border-rose-300'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold">
                  {verdict === 'pass' ? <CheckCircle2 className="text-emerald-600"/> : <XCircle className="text-rose-600"/>}
                  <span className={verdict === 'pass' ? 'text-emerald-700' : 'text-rose-700'}>
                    {verdict === 'pass' ? 'ĐẠT — Toàn bộ thông số trong ngưỡng cho phép' : 'KHÔNG ĐẠT — Có thông số vượt ngưỡng'}
                  </span>
                </div>
                {isKCSRole && (
                  <button onClick={save} className={verdict === 'pass' ? 'btn-primary' : 'btn-danger'}>
                    <Save size={14}/> {verdict === 'pass' ? 'Duyệt & Lưu' : 'Lưu (Không đạt)'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Panel bên: tiêu chuẩn + lịch sử */}
          <div className="space-y-3">
            <div className="card p-3 bg-military-50/40">
              <h4 className="font-semibold text-sm text-military-800 mb-2">Tiêu chuẩn áp dụng</h4>
              <ul className="text-xs space-y-1 text-slate-700">
                {Object.entries(KCS_STANDARDS).map(([k, v]) => (
                  <li key={k} className="flex items-center justify-between border-b border-military-100 pb-0.5">
                    <span>{v.label}</span>
                    <span className="font-mono text-military-700">{v.min} → {v.max}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-3">
              <h4 className="font-semibold text-sm text-slate-800 mb-2">Lịch sử phiếu KCS</h4>
              <div className="space-y-1.5 max-h-64 overflow-y-auto scroll-thin">
                {db.kcsResults.map(r => (
                  <div key={r.id} className="text-xs p-2 bg-slate-50 rounded border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-slate-500">{r.id}</span>
                      {r.verdict === 'pass'
                        ? <span className="badge bg-emerald-100 text-emerald-700">Đạt</span>
                        : <span className="badge bg-rose-100 text-rose-700">Không đạt</span>}
                    </div>
                    <div className="font-semibold mt-0.5">{r.vehicleId} · Cđ {r.stage}</div>
                    <div className="text-slate-500">{fmtDate(r.date)} · {r.inspector}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Phiếu KCS in */}
      <Modal open={!!receipt} onClose={() => setReceipt(null)} size="lg"
        title="Phiếu KCS điện tử"
        footer={<>
          <button className="btn-outline" onClick={() => setReceipt(null)}><X size={14}/> Đóng</button>
          <button className="btn-primary" onClick={() => window.print()}><Printer size={14}/> In phiếu</button>
        </>}>
        {receipt && (
          <div className="print-area p-6 border-2 border-dashed border-slate-300 bg-white">
            <div className="text-center mb-4">
              <div className="text-xs uppercase tracking-widest text-slate-500">Bộ Quốc phòng — Nhà máy Sửa chữa Ô tô Quân sự</div>
              <h2 className="text-xl font-bold text-military-700 mt-1">PHIẾU KIỂM TRA CHẤT LƯỢNG ĐIỆN TỬ</h2>
              <div className="text-xs text-slate-500 mt-1">Mã phiếu: <span className="font-mono font-semibold">{receipt.id}</span> · Ngày: {fmtDate(receipt.date)}</div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm mb-4 p-3 bg-slate-50 rounded">
              <div><b>Phương tiện:</b> {receipt.vehicle.id} – {receipt.vehicle.model}</div>
              <div><b>Số khung:</b> <span className="font-mono">{receipt.vehicle.chassis}</span></div>
              <div><b>Đơn vị:</b> {receipt.vehicle.unit}</div>
              <div><b>Công đoạn:</b> {receipt.stageName}</div>
              <div><b>KCS viên:</b> {receipt.inspector}</div>
              <div><b>Kết luận:</b>
                <span className={receipt.verdict === 'pass' ? 'text-emerald-700 font-bold ml-1' : 'text-rose-700 font-bold ml-1'}>
                  {receipt.verdict === 'pass' ? 'ĐẠT' : 'KHÔNG ĐẠT'}
                </span>
              </div>
            </div>

            <table className="w-full text-sm border border-slate-300">
              <thead className="bg-military-50 text-military-800">
                <tr>
                  <th className="border border-slate-300 p-2 text-left">Hạng mục</th>
                  <th className="border border-slate-300 p-2 text-center">Giá trị đo</th>
                  <th className="border border-slate-300 p-2 text-center">Tiêu chuẩn</th>
                  <th className="border border-slate-300 p-2 text-center">Kết quả</th>
                </tr>
              </thead>
              <tbody>
                {FIELDS.map(f => {
                  const v = receipt.readings[f.key];
                  const std = KCS_STANDARDS[f.key];
                  const ok = checkValue(f.key, v).ok;
                  return (
                    <tr key={f.key}>
                      <td className="border border-slate-300 p-2">{std.label}</td>
                      <td className="border border-slate-300 p-2 text-center font-mono font-semibold">{v}</td>
                      <td className="border border-slate-300 p-2 text-center font-mono text-xs">{std.min} - {std.max}</td>
                      <td className={`border border-slate-300 p-2 text-center font-bold ${ok ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {ok ? '✓' : '✗'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="mt-4 text-sm">
              <div><b>Ghi chú:</b> {receipt.note || '—'}</div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-8 text-center text-sm">
              <div>
                <div className="font-semibold">KCS viên</div>
                <div className="h-16"></div>
                <div className="border-t border-slate-400 pt-1">{receipt.inspector}</div>
              </div>
              <div>
                <div className="font-semibold">Trưởng phòng KCS</div>
                <div className="h-16"></div>
                <div className="border-t border-slate-400 pt-1">Lê Văn Cường</div>
              </div>
              <div>
                <div className="font-semibold">Chỉ huy Nhà máy</div>
                <div className="h-16"></div>
                <div className="border-t border-slate-400 pt-1">Nguyễn Văn An</div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
