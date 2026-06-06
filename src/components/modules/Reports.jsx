// ============================================================
// PHÂN HỆ 8 — BÁO CÁO THỐNG KÊ + QUẢN TRỊ HỆ THỐNG
// ============================================================
import React, { useMemo, useState } from 'react';
import {
  FileSpreadsheet, FileText, Download, Users, ShieldCheck,
  Activity, Clock, BarChart3
} from 'lucide-react';
import { Section } from '../common/UI';
import { ROLES, fmtDate } from '../../data/mockData';

function ReportSummary({ db }) {
  const totalVehicles = db.vehicles.length;
  const completedVehicles = db.vehicles.filter(v => v.dossierStatus === 'Hoàn thành').length;
  const ongoingVehicles   = db.vehicles.filter(v => v.dossierStatus === 'Đang sửa').length;
  const awaitingVehicles  = db.vehicles.filter(v => v.dossierStatus === 'Chờ nghiệm thu').length;

  const totalKCS = db.kcsResults.length;
  const passKCS  = db.kcsResults.filter(k => k.verdict === 'pass').length;
  const kcsPct   = totalKCS ? Math.round((passKCS / totalKCS) * 100) : 100;

  const colorMap = {
    military: 'text-military-700',
    cyber:    'text-cyber-700',
    emerald:  'text-emerald-700',
    amber:    'text-amber-700',
    rose:     'text-rose-700',
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {[
        {l:'Tổng phương tiện', v:totalVehicles,   c:'military'},
        {l:'Đang sửa chữa',   v:ongoingVehicles, c:'cyber'},
        {l:'Hoàn thành',       v:completedVehicles,c:'emerald'},
        {l:'Chờ nghiệm thu',   v:awaitingVehicles, c:'amber'},
        {l:'Tổng phiếu KCS',   v:totalKCS,        c:'military'},
        {l:'KCS đạt',          v:passKCS,         c:'emerald'},
        {l:'Tỷ lệ đạt KCS',    v:`${kcsPct}%`,    c:'cyber'},
        {l:'Vật tư dưới mức',  v:db.inventory.filter(i => i.qty < i.min).length, c:'rose'},
      ].map((s,i) => (
        <div key={i} className="card p-3">
          <div className="text-[10px] text-slate-500 uppercase">{s.l}</div>
          <div className={`text-2xl font-bold ${colorMap[s.c]}`}>{s.v}</div>
        </div>
      ))}
    </div>
  );
}

function ReportTable({ db, range }) {
  // Giả lập lọc theo range
  const today = '2026-06-06';
  const inRange = (date) => {
    if (range === 'day')   return date === today;
    if (range === 'week')  return date >= '2026-06-01' && date <= '2026-06-07';
    if (range === 'month') return date.startsWith('2026-06');
    if (range === 'quarter') return date >= '2026-04-01' && date <= '2026-06-30';
    return true;
  };
  const plans = db.plans.filter(p => inRange(p.startDate) || inRange(p.dueDate));

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[700px]">
        <thead className="bg-military-50 text-military-700 text-xs uppercase">
          <tr>
            <th className="text-left p-2.5">Mã</th>
            <th className="text-left p-2.5">Công việc</th>
            <th className="text-left p-2.5">Phương tiện</th>
            <th className="text-left p-2.5">Bắt đầu</th>
            <th className="text-left p-2.5">Kết thúc (dự kiến)</th>
            <th className="text-left p-2.5">Trạng thái</th>
            <th className="text-left p-2.5">Ưu tiên</th>
          </tr>
        </thead>
        <tbody>
          {plans.map(p => (
            <tr key={p.id} className="border-b border-slate-100">
              <td className="p-2.5 font-mono text-xs">{p.id}</td>
              <td className="p-2.5 font-semibold">{p.task}</td>
              <td className="p-2.5 text-xs">{p.vehicleId}</td>
              <td className="p-2.5 text-xs">{fmtDate(p.startDate)}</td>
              <td className="p-2.5 text-xs">{fmtDate(p.dueDate)}</td>
              <td className="p-2.5 text-xs">{p.status}</td>
              <td className="p-2.5 text-xs">{p.priority}</td>
            </tr>
          ))}
          {plans.length === 0 && (
            <tr><td colSpan="7" className="p-6 text-center text-slate-400">Không có dữ liệu trong khoảng này</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export function Reports({ db }) {
  const [range, setRange] = useState('month');
  const exportFile = (type) => {
    alert(`✅ Đang xuất dữ liệu thành công!\n\nĐịnh dạng: ${type}\nKhoảng thời gian: ${range}\nTổng ${db.plans.length} bản ghi.`);
  };
  return (
    <div className="space-y-4 animate-fade-in">
      <Section
        title="Báo cáo – Thống kê tổng hợp"
        subtitle="Xuất dữ liệu phục vụ chỉ huy, lãnh đạo"
        action={
          <>
            <button onClick={() => exportFile('Excel')} className="btn-accent">
              <FileSpreadsheet size={15}/> Xuất Excel
            </button>
            <button onClick={() => exportFile('PDF')} className="btn-danger">
              <FileText size={15}/> Xuất PDF
            </button>
          </>
        }
      >
        {/* Range */}
        <div className="flex bg-slate-100 rounded-lg p-0.5 self-start mb-4 inline-flex">
          {[
            {k:'day',l:'Ngày'},
            {k:'week',l:'Tuần'},
            {k:'month',l:'Tháng'},
            {k:'quarter',l:'Quý'},
          ].map(r => (
            <button key={r.k} onClick={() => setRange(r.k)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition ${
                range === r.k ? 'bg-white text-military-700 shadow-sm' : 'text-slate-600'
              }`}>{r.l}</button>
          ))}
        </div>

        <ReportSummary db={db}/>

        <div className="mt-4">
          <h3 className="text-sm font-semibold text-slate-800 mb-2 flex items-center gap-2">
            <BarChart3 size={16} className="text-military-600"/> Danh sách kế hoạch chi tiết
          </h3>
          <ReportTable db={db} range={range}/>
        </div>
      </Section>
    </div>
  );
}

export function Admin({ db, setDb }) {
  const [tab, setTab] = useState('users');
  return (
    <div className="space-y-4 animate-fade-in">
      <Section title="Quản trị hệ thống" subtitle="Tài khoản, phân quyền, nhật ký hoạt động">
        <div className="flex border-b border-slate-200 mb-4">
          {[
            {k:'users', l:'Tài khoản', i: Users},
            {k:'logs',  l:'Nhật ký',  i: Activity},
            {k:'data',  l:'Dữ liệu',  i: ShieldCheck},
          ].map(t => {
            const Icon = t.i;
            return (
              <button key={t.k} onClick={() => setTab(t.k)}
                className={`px-4 py-2 text-sm font-semibold border-b-2 transition flex items-center gap-1.5 ${
                  tab === t.k ? 'border-military-600 text-military-700' : 'border-transparent text-slate-500'
                }`}><Icon size={14}/>{t.l}</button>
            );
          })}
        </div>

        {tab === 'users' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead className="bg-military-50 text-military-700 text-xs uppercase">
                <tr>
                  <th className="text-left p-2.5">Mã</th>
                  <th className="text-left p-2.5">Họ tên</th>
                  <th className="text-left p-2.5">Đơn vị</th>
                  <th className="text-left p-2.5">Vai trò</th>
                  <th className="text-left p-2.5">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {db.users.map(u => {
                  const r = ROLES.find(x => x.key === u.role);
                  return (
                    <tr key={u.id} className="border-b border-slate-100">
                      <td className="p-2.5 font-mono text-xs">{u.id}</td>
                      <td className="p-2.5 font-semibold">{u.name}</td>
                      <td className="p-2.5 text-xs">{u.unit}</td>
                      <td className="p-2.5"><span className="badge bg-cyber-50 text-cyber-700">{r?.label}</span></td>
                      <td className="p-2.5"><span className="badge bg-emerald-100 text-emerald-700">● Hoạt động</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'logs' && (
          <div className="space-y-2">
            {db.activityLog.map(l => (
              <div key={l.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <Clock size={14} className="text-military-600 mt-0.5 shrink-0"/>
                <div className="flex-1">
                  <div className="text-xs text-slate-500 font-mono">{l.date} · {l.id}</div>
                  <div className="text-sm font-semibold text-slate-800 mt-0.5">{l.user}</div>
                  <div className="text-sm text-slate-600">{l.action}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'data' && (
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="card p-4 bg-military-50/40">
              <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                <Download size={16} className="text-military-600"/> Sao lưu dữ liệu
              </h4>
              <p className="text-xs text-slate-600 mb-3">Xuất toàn bộ dữ liệu LocalStorage ra file JSON để lưu trữ/khôi phục.</p>
              <button onClick={() => {
                const blob = new Blob([JSON.stringify(db, null, 2)], {type: 'application/json'});
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; a.download = 'mars-mes-backup.json'; a.click();
                URL.revokeObjectURL(url);
              }} className="btn-primary w-full"><Download size={14}/> Tải file backup</button>
            </div>
            <div className="card p-4 bg-rose-50/40 border-rose-200">
              <h4 className="font-semibold text-rose-800 mb-2 flex items-center gap-2">
                <ShieldCheck size={16}/> Khôi phục dữ liệu
              </h4>
              <p className="text-xs text-slate-600 mb-3">Reset toàn bộ dữ liệu về trạng thái mặc định ban đầu (mock data gốc).</p>
              <button onClick={() => {
                if (window.confirm('Bạn chắc chắn muốn reset toàn bộ dữ liệu?')) {
                  localStorage.removeItem('mars_mes_db_v1');
                  window.location.reload();
                }
              }} className="btn-danger w-full">⚠ Reset dữ liệu mẫu</button>
            </div>
          </div>
        )}
      </Section>
    </div>
  );
}
