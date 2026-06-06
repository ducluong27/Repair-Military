// ============================================================
// PHÂN HỆ 4 — KẾ HOẠCH SỬA CHỮA
// ============================================================
import React, { useMemo, useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Calendar, Clock, AlertCircle } from 'lucide-react';
import { Modal, Section, StatusPill, ConfirmDialog } from '../common/UI';
import { WORK_STATUS, PRIORITY, PROCESS_STAGES, fmtDate, genId } from '../../data/mockData';

const emptyForm = { id:'', task:'', vehicleId:'', stage:1, assignee:'', equipment:'', startDate:'', dueDate:'', actualEnd:'', priority:'med', status:'pending' };

export default function PlanManager({ db, setDb, canEdit }) {
  const [view, setView]         = useState('week');  // day | week | month
  const [statusFilter, setStatusFilter] = useState('all');
  const [modal, setModal]       = useState({ open:false, mode:null });
  const [confirm, setConfirm]   = useState(null);
  const [form, setForm]         = useState(emptyForm);

  const plans = db.plans;

  const filtered = useMemo(() => {
    const today = '2026-06-06';
    return plans.filter(p => {
      if (view === 'day')   return p.startDate <= today && p.dueDate >= today;
      if (view === 'week')  {
        const start = '2026-06-01', end = '2026-06-07';
        return p.startDate <= end && p.dueDate >= start;
      }
      // month: trong T6/2026
      return p.startDate.startsWith('2026-06') || p.dueDate.startsWith('2026-06');
    }).filter(p => statusFilter === 'all' || p.status === statusFilter);
  }, [plans, view, statusFilter]);

  const stats = useMemo(() => ({
    total: filtered.length,
    doing: filtered.filter(p => p.status === 'doing').length,
    done:  filtered.filter(p => p.status === 'done').length,
    late:  filtered.filter(p => p.status !== 'done' && p.dueDate < '2026-06-06').length,
  }), [filtered]);

  const openCreate = () => { setForm({...emptyForm, id: genId('KH'), startDate:'2026-06-06', dueDate:'2026-06-10'}); setModal({open:true, mode:'create'}); };
  const openEdit   = (p) => { setForm({...p}); setModal({open:true, mode:'edit'}); };

  const save = () => {
    if (!form.task || !form.vehicleId) { alert('Nhập: tên công việc, mã xe'); return; }
    if (modal.mode === 'create') setDb({...db, plans: [...plans, {...form}]});
    else setDb({...db, plans: plans.map(p => p.id === form.id ? form : p)});
    setModal({open:false});
  };
  const remove = (id) => setDb({...db, plans: plans.filter(p => p.id !== id)});

  return (
    <div className="space-y-4 animate-fade-in">
      <Section
        title="Kế hoạch sửa chữa"
        subtitle="Quản lý công việc theo dòng thời gian"
        action={canEdit && <button onClick={openCreate} className="btn-primary"><Plus size={16}/> Thêm công việc</button>}
      >
        {/* View toggle + filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-4">
          <div className="flex bg-slate-100 rounded-lg p-0.5 self-start">
            {[
              {k:'day',l:'Ngày',i:Calendar},
              {k:'week',l:'Tuần',i:Clock},
              {k:'month',l:'Tháng',i:Calendar},
            ].map(v => (
              <button key={v.k} onClick={() => setView(v.k)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition flex items-center gap-1.5
                  ${view === v.k ? 'bg-white text-military-700 shadow-sm' : 'text-slate-600'}`}>
                <v.i size={13}/> {v.l}
              </button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              {k:'all',l:'Tất cả', color:'bg-slate-200 text-slate-700'},
              ...WORK_STATUS
            ].map(s => (
              <button key={s.key} onClick={() => setStatusFilter(s.key)}
                className={`badge cursor-pointer ${
                  statusFilter === s.key ? s.color + ' ring-2 ring-cyber-300' : s.color + ' opacity-60 hover:opacity-100'
                }`}>{s.l || s.label}</button>
            ))}
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div className="card p-3">
            <div className="text-[10px] text-slate-500 uppercase">Tổng công việc</div>
            <div className="text-2xl font-bold text-slate-800">{stats.total}</div>
          </div>
          <div className="card p-3 bg-blue-50/40">
            <div className="text-[10px] text-blue-700 uppercase">Đang thực hiện</div>
            <div className="text-2xl font-bold text-blue-700">{stats.doing}</div>
          </div>
          <div className="card p-3 bg-emerald-50/40">
            <div className="text-[10px] text-emerald-700 uppercase">Hoàn thành</div>
            <div className="text-2xl font-bold text-emerald-700">{stats.done}</div>
          </div>
          <div className={`card p-3 ${stats.late > 0 ? 'bg-rose-50/40 ring-2 ring-rose-200' : ''}`}>
            <div className={`text-[10px] uppercase ${stats.late > 0 ? 'text-rose-700' : 'text-slate-500'}`}>Chậm tiến độ</div>
            <div className={`text-2xl font-bold ${stats.late > 0 ? 'text-rose-700' : 'text-slate-800'}`}>{stats.late}</div>
          </div>
        </div>

        {/* Bảng */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-military-50 text-military-700 text-xs uppercase">
              <tr>
                <th className="text-left p-2.5">Mã KH</th>
                <th className="text-left p-2.5">Tên công việc</th>
                <th className="text-left p-2.5">Phương tiện / Công đoạn</th>
                <th className="text-left p-2.5">Người thực hiện</th>
                <th className="text-left p-2.5">Thiết bị</th>
                <th className="text-left p-2.5">Bắt đầu</th>
                <th className="text-left p-2.5">Dự kiến xong</th>
                <th className="text-left p-2.5">Thực tế</th>
                <th className="text-left p-2.5">Ưu tiên</th>
                <th className="text-left p-2.5">Trạng thái</th>
                <th className="text-right p-2.5">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const veh = db.vehicles.find(v => v.id === p.vehicleId);
                const stage = PROCESS_STAGES.find(s => s.id === p.stage);
                const isLate = p.status !== 'done' && p.dueDate < '2026-06-06';
                return (
                  <tr key={p.id} className={`border-b border-slate-100 hover:bg-cyber-50/40 ${isLate ? 'bg-rose-50/40' : ''}`}>
                    <td className="p-2.5 font-mono text-xs text-slate-500">{p.id}</td>
                    <td className="p-2.5 font-semibold text-slate-800">{p.task}</td>
                    <td className="p-2.5 text-xs">
                      <div className="font-semibold">{p.vehicleId}</div>
                      <div className="text-slate-500">{veh?.model}</div>
                      <div className="badge bg-cyber-50 text-cyber-700 mt-0.5">{stage?.code} · {stage?.shortName}</div>
                    </td>
                    <td className="p-2.5 text-xs">{p.assignee}</td>
                    <td className="p-2.5 text-xs">{p.equipment}</td>
                    <td className="p-2.5 text-xs">{fmtDate(p.startDate)}</td>
                    <td className="p-2.5 text-xs">
                      {fmtDate(p.dueDate)}
                      {isLate && <AlertCircle size={12} className="inline ml-1 text-rose-500"/>}
                    </td>
                    <td className="p-2.5 text-xs text-slate-600">{p.actualEnd ? fmtDate(p.actualEnd) : '—'}</td>
                    <td className="p-2.5"><StatusPill status={p.priority} list={PRIORITY} /></td>
                    <td className="p-2.5"><StatusPill status={p.status} list={WORK_STATUS}/></td>
                    <td className="p-2.5 text-right whitespace-nowrap">
                      {canEdit && <>
                        <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-amber-50 rounded text-amber-600"><Edit2 size={15}/></button>
                        <button onClick={() => setConfirm(p)} className="p-1.5 hover:bg-rose-50 rounded text-rose-600"><Trash2 size={15}/></button>
                      </>}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan="11" className="p-8 text-center text-slate-400 text-sm">Chưa có công việc nào trong khoảng này</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Section>

      <Modal open={modal.open} onClose={() => setModal({open:false})} size="lg"
        title={modal.mode === 'create' ? 'Lập kế hoạch mới' : `Cập nhật — ${form.id}`}
        footer={<>
          <button className="btn-outline" onClick={() => setModal({open:false})}><X size={14}/> Hủy</button>
          <button className="btn-primary" onClick={save}><Save size={14}/> Lưu kế hoạch</button>
        </>}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div><label className="label">Mã kế hoạch</label><input className="input bg-slate-50" value={form.id} disabled/></div>
          <div><label className="label">Phương tiện *</label>
            <select className="input" value={form.vehicleId} onChange={e => setForm({...form, vehicleId:e.target.value})}>
              <option value="">-- Chọn xe --</option>
              {db.vehicles.map(v => <option key={v.id} value={v.id}>{v.id} - {v.model}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2"><label className="label">Tên công việc *</label>
            <input className="input" value={form.task} onChange={e => setForm({...form, task:e.target.value})}/>
          </div>
          <div><label className="label">Công đoạn</label>
            <select className="input" value={form.stage} onChange={e => setForm({...form, stage:parseInt(e.target.value)})}>
              {PROCESS_STAGES.map(s => <option key={s.id} value={s.id}>{s.code} · {s.name}</option>)}
            </select>
          </div>
          <div><label className="label">Người thực hiện</label>
            <select className="input" value={form.assignee} onChange={e => setForm({...form, assignee:e.target.value})}>
              <option value="">-- Chọn --</option>
              {db.users.filter(u => ['engineer','kcs','admin'].includes(u.role)).map(u => <option key={u.id}>{u.name}</option>)}
            </select>
          </div>
          <div><label className="label">Thiết bị sử dụng</label>
            <input className="input" value={form.equipment} onChange={e => setForm({...form, equipment:e.target.value})}/>
          </div>
          <div><label className="label">Mức độ ưu tiên</label>
            <select className="input" value={form.priority} onChange={e => setForm({...form, priority:e.target.value})}>
              {PRIORITY.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
            </select>
          </div>
          <div><label className="label">Ngày bắt đầu</label><input type="date" className="input" value={form.startDate} onChange={e => setForm({...form, startDate:e.target.value})}/></div>
          <div><label className="label">Ngày dự kiến xong</label><input type="date" className="input" value={form.dueDate} onChange={e => setForm({...form, dueDate:e.target.value})}/></div>
          <div><label className="label">Ngày hoàn thành thực tế</label><input type="date" className="input" value={form.actualEnd} onChange={e => setForm({...form, actualEnd:e.target.value})}/></div>
          <div><label className="label">Trạng thái</label>
            <select className="input" value={form.status} onChange={e => setForm({...form, status:e.target.value})}>
              {WORK_STATUS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => remove(confirm.id)}
        title="Xóa kế hoạch" message={`Bạn chắc chắn muốn xóa ${confirm?.id}?`}/>
    </div>
  );
}
