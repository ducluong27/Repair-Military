// ============================================================
// PHÂN HỆ 1 — DASHBOARD ĐIỀU HÀNH
// ============================================================
import React, { useMemo, useState } from 'react';
import {
  Truck, Cog, Activity, AlertTriangle, ShieldCheck,
  Repeat, Boxes, Gauge, TrendingUp
} from 'lucide-react';
import { Section } from '../common/UI';

function KPI({ icon: Icon, title, value, sub, accent = 'cyber', alert = false }) {
  const accents = {
    cyber:   { bg: 'from-cyber-500 to-cyber-600',         text: 'text-cyber-700',   ring: 'ring-cyber-100' },
    military:{ bg: 'from-military-500 to-military-700',   text: 'text-military-700',ring: 'ring-military-100' },
    amber:   { bg: 'from-amber-500 to-orange-600',        text: 'text-amber-700',   ring: 'ring-amber-100' },
    rose:    { bg: 'from-rose-500 to-red-600',            text: 'text-rose-700',    ring: 'ring-rose-100' },
    emerald: { bg: 'from-emerald-500 to-emerald-600',     text: 'text-emerald-700', ring: 'ring-emerald-100' },
    blue:    { bg: 'from-techblue-500 to-techblue-600',   text: 'text-techblue-700',ring: 'ring-blue-100' },
  }[accent] || {};

  return (
    <div className={`card p-4 relative overflow-hidden group hover:shadow-lg transition-all ${alert ? 'ring-2 ring-rose-200' : ''}`}>
      {alert && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">{title}</p>
          <p className={`text-2xl sm:text-3xl font-bold mt-1 ${accents.text}`}>{value}</p>
          {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
        </div>
        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${accents.bg} text-white shadow-md`}>
          <Icon size={20} />
        </div>
      </div>
      <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${accents.bg} opacity-5 group-hover:opacity-10 transition`} />
    </div>
  );
}

// Biểu đồ cột giả lập bằng div
function BarChart({ data, valueKey = 'value', labelKey = 'label' }) {
  const max = Math.max(...data.map(d => d[valueKey]), 1);
  return (
    <div className="flex items-end justify-between gap-2 h-48 px-2">
      {data.map((d, i) => {
        const h = (d[valueKey] / max) * 100;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
            <span className="text-[10px] text-slate-500 font-semibold opacity-0 group-hover:opacity-100 transition">
              {d[valueKey]}
            </span>
            <div className="w-full relative rounded-t-md overflow-hidden bg-slate-100" style={{ height: '100%' }}>
              <div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-military-500 to-cyber-400 rounded-t-md transition-all duration-700"
                style={{ height: `${h}%`, minHeight: '4%' }}
              />
            </div>
            <span className="text-[10px] text-slate-600 font-medium truncate w-full text-center">{d[labelKey]}</span>
          </div>
        );
      })}
    </div>
  );
}

// Pie donut (SVG đơn giản)
function DonutChart({ value = 0, label = '', color = '#06b6d4', subText }) {
  const C = 2 * Math.PI * 36;
  const stroke = (value / 100) * C;
  return (
    <div className="flex flex-col items-center">
      <svg width="120" height="120" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="36" stroke="#e2e8f0" strokeWidth="10" fill="none" />
        <circle cx="50" cy="50" r="36" stroke={color} strokeWidth="10" fill="none"
                strokeDasharray={`${stroke} ${C}`} strokeLinecap="round"
                transform="rotate(-90 50 50)" />
        <text x="50" y="48" textAnchor="middle" fontSize="18" fontWeight="700" fill="#1e293b">{value}%</text>
        <text x="50" y="62" textAnchor="middle" fontSize="8" fill="#64748b">{subText}</text>
      </svg>
      <p className="text-sm font-medium text-slate-700 mt-1">{label}</p>
    </div>
  );
}

export default function Dashboard({ db }) {
  const [range, setRange] = useState('week');

  const stats = useMemo(() => {
    const vehiclesInRepair = db.vehicles.filter(v => v.dossierStatus === 'Đang sửa').length;
    const enginesInRepair  = db.engines.filter(e => e.dossierStatus === 'Đang sửa').length;

    // Tổng % tiến độ trung bình của các xe đang sửa
    const flowVals = Object.values(db.processFlow);
    let overallProgress = 0;
    if (flowVals.length) {
      const totals = flowVals.map(stages =>
        stages.reduce((a, s) => a + s.progress, 0) / (stages.length * 100) * 100
      );
      overallProgress = Math.round(totals.reduce((a,b) => a+b, 0) / totals.length);
    }

    const ongoingStages = flowVals.flat().filter(s => s.status === 'doing').length;

    // Chậm tiến độ — đếm những kế hoạch quá hạn nhưng chưa done
    const today = new Date('2026-06-06');
    const delayed = db.plans.filter(p => {
      if (p.status === 'done') return false;
      return new Date(p.dueDate) < today;
    }).length;

    // Tỷ lệ đạt KCS
    const totalKCS = db.kcsResults.length;
    const pass = db.kcsResults.filter(k => k.verdict === 'pass').length;
    const kcsPct = totalKCS ? Math.round((pass / totalKCS) * 100) : 100;

    // Tỷ lệ sửa lại = số công đoạn paused / tổng công đoạn doing+done
    const allStages = flowVals.flat();
    const paused = allStages.filter(s => s.status === 'paused').length;
    const reworkPct = allStages.length ? Math.round((paused / allStages.length) * 100) : 0;

    // Vật tư báo động
    const lowItems = db.inventory.filter(i => i.qty < i.min);

    return {
      vehiclesInRepair, enginesInRepair, overallProgress,
      ongoingStages, delayed, kcsPct, reworkPct, lowItems
    };
  }, [db]);

  // Dữ liệu biểu đồ giả lập theo range
  const chartData = {
    day: [
      { label:'6h', value:5 },{ label:'9h',value:12 },{ label:'12h',value:18 },
      { label:'15h',value:22 },{ label:'18h',value:14 },{ label:'21h',value:6 }
    ],
    week: [
      { label:'T2',value:8 },{ label:'T3',value:14 },{ label:'T4',value:11 },
      { label:'T5',value:19 },{ label:'T6',value:22 },{ label:'T7',value:9 },{ label:'CN',value:4 }
    ],
    month: [
      { label:'T1',value:62 },{ label:'T2',value:78 },{ label:'T3',value:90 },
      { label:'T4',value:71 },{ label:'T5',value:108 },{ label:'T6',value:45 }
    ],
  }[range];

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Banner */}
      <div className="card relative p-5 bg-gradient-to-br from-military-700 via-military-600 to-military-500 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10"
             style={{ backgroundImage:'radial-gradient(circle at 20px 20px, white 1px, transparent 0)', backgroundSize:'30px 30px' }} />
        <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-cyber-500/20 border border-cyber-400/40 rounded-full text-cyber-300 text-[10px] font-semibold uppercase tracking-widest mb-2">
              <span className="w-1.5 h-1.5 bg-cyber-400 rounded-full animate-pulse" />
              Online · Thời gian thực
            </div>
            <h1 className="text-xl sm:text-2xl font-bold">Trung tâm điều hành Nhà máy Z157</h1>
            <p className="text-sm text-slate-200/80 mt-1">
              Tổng quan tình trạng sửa chữa xe và động cơ – cập nhật 06/06/2026
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Gauge size={16} className="text-cyber-300" />
            <span>Hiệu suất nhà máy hôm nay: <b className="text-cyber-300">{stats.overallProgress}%</b></span>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <KPI icon={Truck}     accent="military" title="Xe đang sửa chữa" value={stats.vehiclesInRepair} sub="phương tiện" />
        <KPI icon={Cog}       accent="cyber"    title="Động cơ đang sửa"  value={stats.enginesInRepair} sub="động cơ"/>
        <KPI icon={TrendingUp}accent="blue"     title="Tiến độ tổng thể"  value={`${stats.overallProgress}%`} sub="trung bình toàn nhà máy"/>
        <KPI icon={Activity}  accent="emerald"  title="Công đoạn đang chạy" value={stats.ongoingStages} sub="công đoạn"/>
        <KPI icon={AlertTriangle} accent="rose" alert={stats.delayed > 0} title="Công việc chậm tiến độ" value={stats.delayed} sub="cần xử lý"/>
        <KPI icon={ShieldCheck}   accent="emerald" title="Tỷ lệ đạt KCS"  value={`${stats.kcsPct}%`} sub="phiếu đạt chuẩn"/>
        <KPI icon={Repeat}        accent="amber"   title="Tỷ lệ sửa lại"  value={`${stats.reworkPct}%`} sub="công đoạn tạm dừng"/>
        <KPI icon={Boxes}         accent="rose"    alert={stats.lowItems.length > 0} title="Vật tư báo động" value={stats.lowItems.length} sub={`/${db.inventory.length} mặt hàng dưới mức`}/>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Section
          className="lg:col-span-2"
          title="Tiến độ sửa chữa hoàn thành"
          subtitle="Số công việc done theo thời gian"
          action={
            <div className="flex bg-slate-100 rounded-lg p-0.5">
              {['day','week','month'].map(r => (
                <button key={r}
                  onClick={() => setRange(r)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                    range === r ? 'bg-white text-military-700 shadow-sm' : 'text-slate-600'
                  }`}>
                  {r === 'day' ? 'Ngày' : r === 'week' ? 'Tuần' : 'Tháng'}
                </button>
              ))}
            </div>
          }
        >
          <BarChart data={chartData} />
        </Section>

        <Section title="Chỉ số chất lượng">
          <div className="flex justify-around items-center py-2">
            <DonutChart value={stats.kcsPct} label="Đạt KCS" subText="Pass" color="#10b981" />
            <DonutChart value={stats.overallProgress} label="Tiến độ" subText="Avg" color="#06b6d4" />
          </div>
        </Section>
      </div>

      {/* Vật tư báo động */}
      {stats.lowItems.length > 0 && (
        <Section title="⚠️ Cảnh báo vật tư sắp hết" subtitle="Cần lên kế hoạch nhập kho ngay">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {stats.lowItems.map(item => (
              <div key={item.id} className="p-3 bg-gradient-to-br from-rose-50 to-orange-50 border border-rose-200 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800 text-sm">{item.name}</div>
                  <div className="text-xs text-slate-500">{item.code} · NCC: {item.supplier}</div>
                </div>
                <div className="text-right">
                  <div className="text-rose-600 font-bold text-lg">{item.qty}</div>
                  <div className="text-[10px] text-slate-500">/ Định mức {item.min}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
