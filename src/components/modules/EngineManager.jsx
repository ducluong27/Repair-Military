// ============================================================
// PHÂN HỆ 3 — QUẢN LÝ ĐỘNG CƠ
// ============================================================
import React, { useMemo, useState } from 'react';
import { Plus, Edit2, Trash2, Search, Save, X, Cog } from 'lucide-react';
import { Modal, Section, QRCanvas, ConfirmDialog } from '../common/UI';
import { PROCESS_STAGES, fmtDate, genId } from '../../data/mockData';

const emptyForm = { id:'', qr:'', model:'', serial:'', vehicleRef:'', unit:'', initStatus:'', receivedAt:'', dossierStatus:'Đang sửa', currentStage:1 };

export default function EngineManager({ db, setDb, canEdit }) {
  const [search, setSearch]   = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modal, setModal]     = useState({ open:false, mode:null });
  const [confirm, setConfirm] = useState(null);
  const [form, setForm]       = useState(emptyForm);

  const engines = db.engines;

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return engines.filter(e => {
      const matchQ = !q ||
        e.id.toLowerCase().includes(q) || e.qr.toLowerCase().includes(q) ||
        e.model.toLowerCase().includes(q) || e.serial.toLowerCase().includes(q) ||
        e.vehicleRef.toLowerCase().includes(q) || e.unit.toLowerCase().includes(q);
      const matchS = statusFilter === 'all' || e.dossierStatus === statusFilter;
      return matchQ && matchS;
    });
  }, [engines, search, statusFilter]);

  const openCreate = () => { setForm({...emptyForm, id: genId('DC'), qr:'QRE'+Math.floor(Math.random()*9999)}); setModal({open:true, mode:'create'}); };
  const openEdit   = (e) => { setForm({...e}); setModal({open:true, mode:'edit'}); };

  const save = () => {
    if (!form.model || !form.serial) { alert('Vui lòng nhập: loại động cơ, số serial'); return; }
    if (modal.mode === 'create') setDb({...db, engines: [...engines, {...form}]});
    else setDb({...db, engines: engines.map(e => e.id === form.id ? form : e)});
    setModal({open:false});
  };

  const remove = (id) => setDb({...db, engines: engines.filter(e => e.id !== id)});

  return (
    <div className="space-y-4 animate-fade-in">
      <Section
        title="Hồ sơ điện tử — Động cơ"
        subtitle="Quản lý động cơ tháo rã & phục hồi"
        action={canEdit && <button onClick={openCreate} className="btn-primary"><Plus size={16}/> Tiếp nhận động cơ</button>}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
            <input className="input pl-9" placeholder="Tìm theo mã, số serial, đơn vị…"
                   value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="input" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">Tất cả trạng thái</option>
            <option>Đang sửa</option><option>Chờ nghiệm thu</option><option>Hoàn thành</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead className="bg-military-50 text-military-700 text-xs uppercase">
              <tr>
                <th className="text-left p-2.5">QR / Mã</th>
                <th className="text-left p-2.5">Loại động cơ</th>
                <th className="text-left p-2.5">Số serial</th>
                <th className="text-left p-2.5">Thuộc xe</th>
                <th className="text-left p-2.5">Đơn vị</th>
                <th className="text-left p-2.5">Tiếp nhận</th>
                <th className="text-left p-2.5">Công đoạn</th>
                <th className="text-left p-2.5">Trạng thái</th>
                <th className="text-right p-2.5">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => {
                const stage = PROCESS_STAGES.find(s => s.id === e.currentStage);
                return (
                  <tr key={e.id} className="border-b border-slate-100 hover:bg-cyber-50/40">
                    <td className="p-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 grid place-items-center bg-military-700 text-cyber-400 rounded">
                          <Cog size={18}/>
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">{e.id}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{e.qr}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-2.5 font-semibold">{e.model}</td>
                    <td className="p-2.5 font-mono text-xs">{e.serial}</td>
                    <td className="p-2.5 text-xs">
                      <span className="badge bg-cyber-50 text-cyber-700">{e.vehicleRef || '—'}</span>
                    </td>
                    <td className="p-2.5 text-xs">{e.unit}</td>
                    <td className="p-2.5 text-xs">{fmtDate(e.receivedAt)}</td>
                    <td className="p-2.5 text-xs"><span className="badge bg-cyber-50 text-cyber-700">{stage?.code}</span></td>
                    <td className="p-2.5">
                      <span className={`badge ${
                        e.dossierStatus === 'Hoàn thành' ? 'bg-emerald-100 text-emerald-700' :
                        e.dossierStatus === 'Chờ nghiệm thu' ? 'bg-amber-100 text-amber-700' :
                        'bg-cyber-50 text-cyber-700'}`}>{e.dossierStatus}</span>
                    </td>
                    <td className="p-2.5 text-right whitespace-nowrap">
                      <div className="flex justify-center mb-1"><QRCanvas value={e.qr} size={32} /></div>
                      {canEdit && <div className="flex gap-1 justify-end">
                        <button onClick={() => openEdit(e)} className="p-1.5 hover:bg-amber-50 rounded text-amber-600"><Edit2 size={15}/></button>
                        <button onClick={() => setConfirm(e)} className="p-1.5 hover:bg-rose-50 rounded text-rose-600"><Trash2 size={15}/></button>
                      </div>}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan="9" className="p-8 text-center text-slate-400 text-sm">Không có động cơ nào</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Section>

      <Modal open={modal.open} onClose={() => setModal({open:false})} size="lg"
        title={modal.mode === 'create' ? 'Tiếp nhận động cơ mới' : `Cập nhật — ${form.id}`}
        footer={<>
          <button className="btn-outline" onClick={() => setModal({open:false})}><X size={14}/> Hủy</button>
          <button className="btn-primary" onClick={save}><Save size={14}/> Lưu</button>
        </>}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div><label className="label">Mã động cơ</label><input className="input bg-slate-50" value={form.id} disabled/></div>
          <div><label className="label">Mã QR</label><input className="input font-mono" value={form.qr} onChange={e => setForm({...form, qr:e.target.value.toUpperCase()})}/></div>
          <div><label className="label">Loại động cơ *</label><input className="input" placeholder="VD: YAMZ-238" value={form.model} onChange={e => setForm({...form, model:e.target.value})}/></div>
          <div><label className="label">Số serial *</label><input className="input font-mono" value={form.serial} onChange={e => setForm({...form, serial:e.target.value})}/></div>
          <div><label className="label">Thuộc phương tiện</label>
            <select className="input" value={form.vehicleRef} onChange={e => setForm({...form, vehicleRef:e.target.value})}>
              <option value="">-- Không --</option>
              {db.vehicles.map(v => <option key={v.id} value={v.id}>{v.id} - {v.model}</option>)}
            </select>
          </div>
          <div><label className="label">Đơn vị</label><input className="input" value={form.unit} onChange={e => setForm({...form, unit:e.target.value})}/></div>
          <div><label className="label">Ngày tiếp nhận</label><input type="date" className="input" value={form.receivedAt} onChange={e => setForm({...form, receivedAt:e.target.value})}/></div>
          <div><label className="label">Công đoạn</label>
            <select className="input" value={form.currentStage} onChange={e => setForm({...form, currentStage:parseInt(e.target.value)})}>
              {PROCESS_STAGES.map(s => <option key={s.id} value={s.id}>{s.code} · {s.name}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2"><label className="label">Tình trạng kỹ thuật</label>
            <textarea rows="2" className="input" value={form.initStatus} onChange={e => setForm({...form, initStatus:e.target.value})}/>
          </div>
          <div><label className="label">Trạng thái hồ sơ</label>
            <select className="input" value={form.dossierStatus} onChange={e => setForm({...form, dossierStatus:e.target.value})}>
              <option>Đang sửa</option><option>Chờ nghiệm thu</option><option>Hoàn thành</option>
            </select>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => remove(confirm.id)}
        title="Xóa động cơ" message={`Bạn chắc chắn muốn xóa ${confirm?.id}?`}/>
    </div>
  );
}
