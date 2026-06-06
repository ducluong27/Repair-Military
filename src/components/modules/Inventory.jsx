// ============================================================
// PHÂN HỆ 7 — QUẢN LÝ VẬT TƯ PHỤ TÙNG
// ============================================================
import React, { useMemo, useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, ArrowDownCircle, ArrowUpCircle, Search, AlertTriangle, History } from 'lucide-react';
import { Modal, Section, ConfirmDialog } from '../common/UI';
import { genId, fmtDate } from '../../data/mockData';

const emptyItem = { id:'', name:'', code:'', qty:0, min:0, unit:'', supplier:'', lastIO:'' };
const emptyIO   = { id:'', itemId:'', type:'in', qty:1, date:'2026-06-06', user:'Trung úy Phạm Thị Duyên', ref:'' };

export default function Inventory({ db, setDb, canEdit }) {
  const [search, setSearch] = useState('');
  const [modal, setModal]   = useState({ open:false, mode:null, type:'item' });
  const [confirm, setConfirm] = useState(null);
  const [form, setForm]     = useState(emptyItem);
  const [ioForm, setIOForm] = useState(emptyIO);
  const [tab, setTab]       = useState('list');

  const inventory = db.inventory;
  const log = db.inventoryLog;

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return inventory.filter(i =>
      !q || i.name.toLowerCase().includes(q) || i.code.toLowerCase().includes(q) || i.supplier.toLowerCase().includes(q)
    );
  }, [inventory, search]);

  const lowCount = inventory.filter(i => i.qty < i.min).length;

  const openCreate = () => { setForm({...emptyItem, id: genId('VT')}); setModal({open:true, mode:'create', type:'item'}); };
  const openEdit   = (i) => { setForm({...i}); setModal({open:true, mode:'edit', type:'item'}); };

  const openIO = (item, type) => {
    setIOForm({...emptyIO, id: genId('IO'), itemId: item.id, type, ref: type==='in' ? `Nhập kho từ ${item.supplier}` : `Xuất cấp cho XE-001`});
    setModal({open:true, mode:'create', type:'io'});
  };

  const saveItem = () => {
    if (!form.name || !form.code) { alert('Nhập tên & mã vật tư'); return; }
    if (modal.mode === 'create') setDb({...db, inventory: [...inventory, {...form}]});
    else setDb({...db, inventory: inventory.map(i => i.id === form.id ? form : i)});
    setModal({open:false});
  };
  const removeItem = (id) => setDb({...db, inventory: inventory.filter(i => i.id !== id)});

  const saveIO = () => {
    if (!ioForm.qty || ioForm.qty <= 0) { alert('Số lượng phải > 0'); return; }
    const item = inventory.find(i => i.id === ioForm.itemId);
    if (!item) return;
    const delta = ioForm.type === 'in' ? ioForm.qty : -ioForm.qty;
    if (delta < 0 && item.qty < ioForm.qty) {
      alert(`Tồn kho không đủ (hiện có ${item.qty} ${item.unit})`);
      return;
    }
    const nextInv = inventory.map(i => i.id === item.id
      ? {...i, qty: i.qty + delta, lastIO: ioForm.date}
      : i);
    const nextLog = [{...ioForm}, ...log];
    setDb({...db, inventory: nextInv, inventoryLog: nextLog});
    setModal({open:false});
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <Section
        title="Quản lý Vật tư – Phụ tùng"
        subtitle={`Tổng ${inventory.length} mặt hàng · ${lowCount} mặt hàng sắp hết`}
        action={canEdit && <button onClick={openCreate} className="btn-primary"><Plus size={16}/> Thêm vật tư</button>}
      >
        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-4">
          {[
            {k:'list', l:'Danh mục vật tư'},
            {k:'log',  l:'Nhật ký nhập/xuất'},
          ].map(t => (
            <button key={t.k} onClick={() => setTab(t.k)}
              className={`px-4 py-2 text-sm font-semibold border-b-2 transition ${
                tab === t.k ? 'border-military-600 text-military-700' : 'border-transparent text-slate-500'
              }`}>{t.l}</button>
          ))}
        </div>

        {tab === 'list' && (<>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <div className="relative md:col-span-2">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
              <input className="input pl-9" placeholder="Tìm tên, mã, nhà cung cấp…" value={search} onChange={e => setSearch(e.target.value)}/>
            </div>
            <div className={`p-2 px-3 rounded-lg flex items-center gap-2 text-sm font-semibold ${
              lowCount > 0 ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
              <AlertTriangle size={16}/> {lowCount > 0 ? `${lowCount} mặt hàng dưới mức tối thiểu` : 'Tồn kho an toàn'}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[820px]">
              <thead className="bg-military-50 text-military-700 text-xs uppercase">
                <tr>
                  <th className="text-left p-2.5">Mã</th>
                  <th className="text-left p-2.5">Tên phụ tùng</th>
                  <th className="text-right p-2.5">Tồn kho</th>
                  <th className="text-right p-2.5">Định mức min</th>
                  <th className="text-left p-2.5">ĐVT</th>
                  <th className="text-left p-2.5">Nhà cung cấp</th>
                  <th className="text-left p-2.5">Cập nhật</th>
                  <th className="text-center p-2.5">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(i => {
                  const isLow = i.qty < i.min;
                  return (
                    <tr key={i.id} className={`border-b border-slate-100 hover:bg-cyber-50/40 ${
                      isLow ? 'bg-rose-50/60' : ''
                    }`}>
                      <td className="p-2.5 font-mono text-xs">{i.code}</td>
                      <td className="p-2.5">
                        <div className="font-semibold flex items-center gap-1">
                          {isLow && <AlertTriangle size={13} className="text-rose-500"/>}
                          {i.name}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">{i.id}</div>
                      </td>
                      <td className="p-2.5 text-right">
                        <span className={`font-bold ${isLow ? 'text-rose-600' : 'text-slate-800'}`}>{i.qty}</span>
                      </td>
                      <td className="p-2.5 text-right text-slate-600">{i.min}</td>
                      <td className="p-2.5 text-xs">{i.unit}</td>
                      <td className="p-2.5 text-xs">{i.supplier}</td>
                      <td className="p-2.5 text-xs">{fmtDate(i.lastIO)}</td>
                      <td className="p-2.5">
                        <div className="flex items-center justify-center gap-1">
                          {canEdit && <>
                            <button onClick={() => openIO(i,'in')}  className="p-1 px-1.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded inline-flex items-center gap-0.5" title="Nhập kho">
                              <ArrowDownCircle size={11}/> Nhập
                            </button>
                            <button onClick={() => openIO(i,'out')} className="p-1 px-1.5 text-[10px] font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 rounded inline-flex items-center gap-0.5" title="Xuất kho">
                              <ArrowUpCircle size={11}/> Xuất
                            </button>
                            <button onClick={() => openEdit(i)} className="p-1.5 hover:bg-cyber-50 rounded text-cyber-600"><Edit2 size={13}/></button>
                            <button onClick={() => setConfirm(i)} className="p-1.5 hover:bg-rose-50 rounded text-rose-600"><Trash2 size={13}/></button>
                          </>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>)}

        {tab === 'log' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead className="bg-military-50 text-military-700 text-xs uppercase">
                <tr>
                  <th className="text-left p-2.5">Mã</th>
                  <th className="text-left p-2.5">Ngày</th>
                  <th className="text-left p-2.5">Phụ tùng</th>
                  <th className="text-left p-2.5">Loại</th>
                  <th className="text-right p-2.5">Số lượng</th>
                  <th className="text-left p-2.5">Người thực hiện</th>
                  <th className="text-left p-2.5">Diễn giải</th>
                </tr>
              </thead>
              <tbody>
                {log.map(io => {
                  const item = inventory.find(i => i.id === io.itemId);
                  return (
                    <tr key={io.id} className="border-b border-slate-100">
                      <td className="p-2.5 font-mono text-xs">{io.id}</td>
                      <td className="p-2.5 text-xs">{fmtDate(io.date)}</td>
                      <td className="p-2.5 text-xs">{item?.name || '—'}</td>
                      <td className="p-2.5">
                        {io.type === 'in'
                          ? <span className="badge bg-emerald-100 text-emerald-700">↓ Nhập kho</span>
                          : <span className="badge bg-amber-100 text-amber-700">↑ Xuất kho</span>}
                      </td>
                      <td className="p-2.5 text-right font-semibold">{io.qty}</td>
                      <td className="p-2.5 text-xs">{io.user}</td>
                      <td className="p-2.5 text-xs">{io.ref}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {/* Modal thêm/sửa vật tư */}
      <Modal open={modal.open && modal.type === 'item'} onClose={() => setModal({open:false})} size="md"
        title={modal.mode === 'create' ? 'Thêm vật tư mới' : `Cập nhật — ${form.id}`}
        footer={<>
          <button className="btn-outline" onClick={() => setModal({open:false})}><X size={14}/> Hủy</button>
          <button className="btn-primary" onClick={saveItem}><Save size={14}/> Lưu</button>
        </>}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div><label className="label">Mã vật tư</label><input className="input bg-slate-50" value={form.id} disabled/></div>
          <div><label className="label">Mã code</label><input className="input font-mono" value={form.code} onChange={e => setForm({...form, code:e.target.value.toUpperCase()})}/></div>
          <div className="sm:col-span-2"><label className="label">Tên phụ tùng *</label>
            <input className="input" value={form.name} onChange={e => setForm({...form, name:e.target.value})}/>
          </div>
          <div><label className="label">Tồn kho</label><input type="number" className="input" value={form.qty} onChange={e => setForm({...form, qty:parseInt(e.target.value||0)})}/></div>
          <div><label className="label">Định mức tối thiểu</label><input type="number" className="input" value={form.min} onChange={e => setForm({...form, min:parseInt(e.target.value||0)})}/></div>
          <div><label className="label">Đơn vị tính</label>
            <select className="input" value={form.unit} onChange={e => setForm({...form, unit:e.target.value})}>
              <option value="">--</option>
              <option>cái</option><option>bộ</option><option>lít</option><option>kg</option>
            </select>
          </div>
          <div><label className="label">Nhà cung cấp</label><input className="input" value={form.supplier} onChange={e => setForm({...form, supplier:e.target.value})}/></div>
        </div>
      </Modal>

      {/* Modal nhập/xuất kho */}
      <Modal open={modal.open && modal.type === 'io'} onClose={() => setModal({open:false})} size="md"
        title={ioForm.type === 'in' ? 'Nhập kho' : 'Xuất kho'}
        footer={<>
          <button className="btn-outline" onClick={() => setModal({open:false})}><X size={14}/> Hủy</button>
          <button className="btn-primary" onClick={saveIO}><Save size={14}/> Xác nhận</button>
        </>}>
        <div className="space-y-3">
          <div className="p-3 bg-slate-50 rounded text-sm">
            <div className="text-slate-500 text-xs">Vật tư</div>
            <div className="font-semibold">{inventory.find(i => i.id === ioForm.itemId)?.name}</div>
            <div className="text-xs text-slate-600">Tồn hiện tại: <b>{inventory.find(i => i.id === ioForm.itemId)?.qty}</b></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Số lượng</label><input type="number" className="input" value={ioForm.qty} onChange={e => setIOForm({...ioForm, qty:parseInt(e.target.value||0)})}/></div>
            <div><label className="label">Ngày</label><input type="date" className="input" value={ioForm.date} onChange={e => setIOForm({...ioForm, date:e.target.value})}/></div>
          </div>
          <div><label className="label">Diễn giải / Lý do</label><input className="input" value={ioForm.ref} onChange={e => setIOForm({...ioForm, ref:e.target.value})}/></div>
        </div>
      </Modal>

      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => removeItem(confirm.id)}
        title="Xóa vật tư" message={`Bạn chắc chắn muốn xóa ${confirm?.name}?`}/>
    </div>
  );
}
