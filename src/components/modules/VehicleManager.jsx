// ============================================================
// PHÂN HỆ 2 — QUẢN LÝ PHƯƠNG TIỆN
// ============================================================
import React, { useMemo, useState } from 'react';
import {
  Plus, Edit2, Trash2, Search, QrCode, FileText,
  History, Save, X
} from 'lucide-react';
import { Modal, Section, QRCanvas, ConfirmDialog } from '../common/UI';
import { PROCESS_STAGES, fmtDate, genId } from '../../data/mockData';

const emptyForm = {
  id:'', qr:'', model:'', chassis:'', engineNo:'',
  unit:'', km:0, initStatus:'', receivedAt:'', dossierStatus:'Đang sửa', currentStage:1
};

export default function VehicleManager({ db, setDb, canEdit }) {
  const [search, setSearch]   = useState('');
  const [qrInput, setQrInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modal, setModal]     = useState({ open:false, mode:null, data:null });
  const [history, setHistory] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [form, setForm]       = useState(emptyForm);

  const vehicles = db.vehicles;

  const filtered = useMemo(() => {
    const q = (search + qrInput).toLowerCase().trim();
    return vehicles.filter(v => {
      const matchQ = !q ||
        v.id.toLowerCase().includes(q) ||
        v.qr.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.chassis.toLowerCase().includes(q) ||
        v.engineNo.toLowerCase().includes(q) ||
        v.unit.toLowerCase().includes(q);
      const matchS = statusFilter === 'all' || v.dossierStatus === statusFilter;
      return matchQ && matchS;
    });
  }, [vehicles, search, qrInput, statusFilter]);

  const openCreate = () => { setForm({...emptyForm, id: genId('XE'), qr:'QRX'+Math.floor(Math.random()*9999)}); setModal({open:true, mode:'create'}); };
  const openEdit   = (v) => { setForm({...v}); setModal({open:true, mode:'edit'}); };

  const save = () => {
    if (!form.model || !form.chassis || !form.engineNo) {
      alert('Vui lòng nhập đầy đủ: loại xe, số khung, số máy');
      return;
    }
    if (modal.mode === 'create') {
      setDb({ ...db, vehicles: [...vehicles, { ...form }] });
    } else {
      setDb({ ...db, vehicles: vehicles.map(v => v.id === form.id ? form : v) });
    }
    setModal({open:false, mode:null});
  };

  const remove = (id) => setDb({...db, vehicles: vehicles.filter(v => v.id !== id)});

  const statuses = ['all', 'Đang sửa', 'Chờ nghiệm thu', 'Hoàn thành'];

  return (
    <div className="space-y-4 animate-fade-in">
      <Section
        title="Hồ sơ điện tử — Phương tiện"
        subtitle="Quản lý xe ô tô quân sự tiếp nhận sửa chữa"
        action={canEdit && <button onClick={openCreate} className="btn-primary"><Plus size={16}/> Tiếp nhận xe</button>}
      >
        {/* Bộ lọc */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          <div className="relative md:col-span-2">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
            <input className="input pl-9" placeholder="Tìm theo mã, số khung, số máy, đơn vị…"
                   value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="relative">
            <QrCode size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-500"/>
            <input className="input pl-9 font-mono" placeholder="Quét/ nhập mã QR (VD: QRX001)"
                   value={qrInput} onChange={e => setQrInput(e.target.value.toUpperCase())} />
          </div>
          <select className="input" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            {statuses.map(s => <option key={s}>{s === 'all' ? 'Tất cả trạng thái' : s}</option>)}
          </select>
        </div>

        {/* Bảng */}
        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <table className="w-full text-sm min-w-[820px]">
            <thead className="bg-military-50 text-military-700 text-xs uppercase">
              <tr>
                <th className="text-left p-2.5">QR / Mã</th>
                <th className="text-left p-2.5">Loại xe</th>
                <th className="text-left p-2.5">Số khung</th>
                <th className="text-left p-2.5">Số máy</th>
                <th className="text-left p-2.5">Đơn vị</th>
                <th className="text-right p-2.5">Km</th>
                <th className="text-left p-2.5">Ngày tiếp nhận</th>
                <th className="text-left p-2.5">Công đoạn</th>
                <th className="text-left p-2.5">Trạng thái</th>
                <th className="text-right p-2.5">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(v => {
                const stage = PROCESS_STAGES.find(s => s.id === v.currentStage);
                return (
                  <tr key={v.id} className="border-b border-slate-100 hover:bg-cyber-50/40">
                    <td className="p-2.5">
                      <div className="flex items-center gap-2">
                        <QRCanvas value={v.qr} size={36} />
                        <div>
                          <div className="font-semibold text-slate-800">{v.id}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{v.qr}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-2.5 font-semibold">{v.model}</td>
                    <td className="p-2.5 font-mono text-xs">{v.chassis}</td>
                    <td className="p-2.5 font-mono text-xs">{v.engineNo}</td>
                    <td className="p-2.5 text-xs">{v.unit}</td>
                    <td className="p-2.5 text-right font-mono">{v.km.toLocaleString()}</td>
                    <td className="p-2.5 text-xs">{fmtDate(v.receivedAt)}</td>
                    <td className="p-2.5 text-xs"><span className="badge bg-cyber-50 text-cyber-700">{stage?.code} · {stage?.shortName}</span></td>
                    <td className="p-2.5">
                      <span className={`badge ${
                        v.dossierStatus === 'Hoàn thành' ? 'bg-emerald-100 text-emerald-700' :
                        v.dossierStatus === 'Chờ nghiệm thu' ? 'bg-amber-100 text-amber-700' :
                        'bg-cyber-50 text-cyber-700'}`}>{v.dossierStatus}</span>
                    </td>
                    <td className="p-2.5 text-right whitespace-nowrap">
                      <button title="Hồ sơ" onClick={() => setHistory(v)} className="p-1.5 hover:bg-cyber-50 rounded text-cyber-600"><FileText size={15}/></button>
                      {canEdit && <>
                        <button title="Sửa" onClick={() => openEdit(v)} className="p-1.5 hover:bg-amber-50 rounded text-amber-600"><Edit2 size={15}/></button>
                        <button title="Xóa" onClick={() => setConfirm(v)} className="p-1.5 hover:bg-rose-50 rounded text-rose-600"><Trash2 size={15}/></button>
                      </>}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan="10" className="p-8 text-center text-slate-400 text-sm">Không có phương tiện nào khớp điều kiện</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Form modal */}
      <Modal open={modal.open} onClose={() => setModal({open:false})} size="lg"
        title={modal.mode === 'create' ? 'Tiếp nhận phương tiện mới' : `Cập nhật hồ sơ — ${form.id}`}
        footer={<>
          <button className="btn-outline" onClick={() => setModal({open:false})}><X size={14}/> Hủy</button>
          <button className="btn-primary" onClick={save}><Save size={14}/> Lưu</button>
        </>}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div><label className="label">Mã phương tiện</label><input className="input bg-slate-50" value={form.id} disabled/></div>
          <div><label className="label">Mã QR</label><input className="input font-mono bg-slate-50" value={form.qr} onChange={e => setForm({...form, qr:e.target.value.toUpperCase()})}/></div>
          <div><label className="label">Loại xe *</label>
            <input className="input" placeholder="VD: Ural-4320, Kamaz-43114…" value={form.model} onChange={e => setForm({...form, model:e.target.value})}/>
          </div>
          <div><label className="label">Đơn vị sử dụng</label>
            <input className="input" placeholder="VD: Sư đoàn 308" value={form.unit} onChange={e => setForm({...form, unit:e.target.value})}/>
          </div>
          <div><label className="label">Số khung *</label><input className="input font-mono" value={form.chassis} onChange={e => setForm({...form, chassis:e.target.value})}/></div>
          <div><label className="label">Số máy *</label><input className="input font-mono" value={form.engineNo} onChange={e => setForm({...form, engineNo:e.target.value})}/></div>
          <div><label className="label">Số km khai thác</label><input type="number" className="input" value={form.km} onChange={e => setForm({...form, km:parseInt(e.target.value||0)})}/></div>
          <div><label className="label">Ngày tiếp nhận</label><input type="date" className="input" value={form.receivedAt} onChange={e => setForm({...form, receivedAt:e.target.value})}/></div>
          <div className="sm:col-span-2"><label className="label">Tình trạng kỹ thuật ban đầu</label>
            <textarea rows="2" className="input" value={form.initStatus} onChange={e => setForm({...form, initStatus:e.target.value})}/>
          </div>
          <div><label className="label">Công đoạn hiện tại</label>
            <select className="input" value={form.currentStage} onChange={e => setForm({...form, currentStage:parseInt(e.target.value)})}>
              {PROCESS_STAGES.map(s => <option key={s.id} value={s.id}>{s.code} · {s.name}</option>)}
            </select>
          </div>
          <div><label className="label">Trạng thái hồ sơ</label>
            <select className="input" value={form.dossierStatus} onChange={e => setForm({...form, dossierStatus:e.target.value})}>
              <option>Đang sửa</option><option>Chờ nghiệm thu</option><option>Hoàn thành</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Hồ sơ sửa chữa điện tử */}
      <Modal open={!!history} onClose={() => setHistory(null)} size="lg"
        title={`Hồ sơ sửa chữa điện tử — ${history?.id}`}>
        {history && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-military-50 rounded-lg border border-military-100">
              <div>
                <div className="text-[10px] text-slate-500 uppercase">Loại xe</div>
                <div className="font-semibold">{history.model}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase">Số khung / số máy</div>
                <div className="font-mono text-xs">{history.chassis} · {history.engineNo}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase">Đơn vị</div>
                <div className="font-semibold">{history.unit}</div>
              </div>
              <div className="flex justify-center sm:col-span-3">
                <QRCanvas value={history.qr} size={120} />
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                <History size={16} className="text-military-600" /> Lịch sử sửa chữa
              </h4>
              <div className="space-y-2">
                {db.repairHistory.filter(h => h.vehicleId === history.id).map((h, i) => (
                  <div key={i} className="p-3 border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <div className="font-semibold text-slate-800">{h.work}</div>
                      <div className="text-xs text-slate-500 mt-0.5">Ngày: {fmtDate(h.date)}</div>
                      <div className="text-xs text-slate-600 mt-1">Phụ tùng thay: <span className="font-mono">{h.parts.join(', ')}</span></div>
                    </div>
                    <span className="badge bg-emerald-100 text-emerald-700">{h.result}</span>
                  </div>
                ))}
                {db.repairHistory.filter(h => h.vehicleId === history.id).length === 0 && (
                  <p className="text-sm text-slate-400 italic">Chưa có lịch sử sửa chữa trước đó.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => remove(confirm.id)}
        title="Xóa phương tiện" message={`Bạn chắc chắn muốn xóa xe ${confirm?.id} khỏi hệ thống?`}/>
    </div>
  );
}
