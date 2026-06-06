// ============================================================
// PHÂN HỆ 5 — QUẢN LÝ CÔNG ĐOẠN CÔNG NGHỆ (PIPELINE)
// ============================================================
import React, { useMemo, useState } from 'react';
import {
  CheckCircle2, Clock, AlertTriangle, Lock, Play, Pause, User, Wrench,
  ChevronRight, Activity, Truck
} from 'lucide-react';
import { Modal, Section } from '../common/UI';
import { PROCESS_STAGES } from '../../data/mockData';

function StageCard({ stage, data, onClick, alert }) {
  const statusMap = {
    done:    { bg: 'bg-emerald-50 border-emerald-300', text: 'text-emerald-700', bar: 'bg-emerald-500', label: 'Hoàn thành' },
    doing:   { bg: 'bg-cyber-50 border-cyber-400 ring-2 ring-cyber-200', text: 'text-cyber-700', bar: 'bg-cyber-500', label: 'Đang thực hiện' },
    pending: { bg: 'bg-slate-50 border-slate-200', text: 'text-slate-500', bar: 'bg-slate-300', label: 'Chưa tới' },
    paused:  { bg: 'bg-rose-50 border-rose-300', text: 'text-rose-700', bar: 'bg-rose-500', label: 'Tạm dừng' },
    awaiting:{ bg: 'bg-amber-50 border-amber-300', text: 'text-amber-700', bar: 'bg-amber-500', label: 'Chờ KCS' },
  };
  const s = statusMap[data.status] || statusMap.pending;

  return (
    <button onClick={onClick}
      className={`group relative text-left w-full p-3 rounded-lg border ${s.bg} ${s.text} hover:shadow-md transition-all`}>
      {alert && <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full animate-pulse" />}
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-bold text-xs">{stage.code}</span>
        <span className="text-[10px] font-semibold uppercase">{s.label}</span>
      </div>
      <div className="text-sm font-semibold leading-tight mb-2">{stage.shortName}</div>
      <div className="w-full bg-white/70 rounded-full h-1.5 mb-1">
        <div className={`h-1.5 rounded-full ${s.bar} transition-all`} style={{ width: `${data.progress}%` }} />
      </div>
      <div className="flex items-center justify-between text-[10px]">
        <span>{data.progress}%</span>
        {!data.approvedKCS && data.status === 'done' && <span className="text-amber-700 flex items-center gap-0.5"><Lock size={9}/> KCS</span>}
        {data.approvedKCS && <span className="text-emerald-700 flex items-center gap-0.5"><CheckCircle2 size={9}/> KCS</span>}
      </div>
    </button>
  );
}

export default function ProcessManager({ db, setDb, canEdit, currentRole }) {
  const [selected, setSelected] = useState(db.vehicles[0]?.id || '');
  const [detailModal, setDetailModal] = useState(null);

  const veh = db.vehicles.find(v => v.id === selected);
  const flow = db.processFlow[selected] || [];

  // Cảnh báo: công đoạn chậm, tạm dừng, chờ KCS quá lâu (giả lập)
  const alerts = useMemo(() => {
    return flow.filter(s => s.status === 'paused' || (s.status === 'doing' && s.progress < 30));
  }, [flow]);

  const updateStage = (stageIdx, patch) => {
    const next = flow.map((s, i) => i === stageIdx ? {...s, ...patch} : s);
    setDb({...db, processFlow: {...db.processFlow, [selected]: next}});
  };

  const advance = (stageIdx) => {
    // Công đoạn hiện tại đạt 100% và KCS đạt → chuyển sang tiếp theo
    const cur = flow[stageIdx];
    if (cur.progress < 100) {
      alert('Công đoạn phải đạt 100% tiến độ mới được chuyển tiếp.');
      return;
    }
    if (!cur.approvedKCS) {
      alert('Công đoạn chưa được KCS duyệt/đạt — không thể chuyển tiếp.');
      return;
    }
    // Cập nhật flow + currentStage của xe
    const next = flow.map((s, i) => {
      if (i === stageIdx) return {...s, status:'done', time: '2026-06-06'};
      if (i === stageIdx + 1) return {...s, status:'doing', progress: Math.max(s.progress, 10), assignee: s.assignee === '-' ? 'Thượng úy Trần Đức Bình' : s.assignee, time:'2026-06-06'};
      return s;
    });
    setDb({
      ...db,
      processFlow: {...db.processFlow, [selected]: next},
      vehicles: db.vehicles.map(v => v.id === selected
        ? {...v, currentStage: Math.min(v.currentStage + 1, 9),
             dossierStatus: v.currentStage + 1 === 9 ? 'Chờ nghiệm thu' : 'Đang sửa'}
        : v)
    });
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <Section
        title="Quản lý Công đoạn Công nghệ"
        subtitle="Pipeline 9 bước bắt buộc cho mỗi phương tiện"
      >
        {/* Vehicle selector */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <label className="text-sm font-medium text-slate-700 sm:self-center">Chọn phương tiện:</label>
          <select className="input sm:max-w-sm" value={selected} onChange={e => setSelected(e.target.value)}>
            {db.vehicles.filter(v => v.dossierStatus !== 'Hoàn thành').map(v => (
              <option key={v.id} value={v.id}>{v.id} · {v.model} · {v.unit}</option>
            ))}
            {db.vehicles.filter(v => v.dossierStatus === 'Hoàn thành').map(v => (
              <option key={v.id} value={v.id}>✓ {v.id} · {v.model} (Hoàn thành)</option>
            ))}
          </select>
          {alerts.length > 0 && (
            <div className="sm:ml-auto flex items-center gap-2 px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs font-semibold">
              <AlertTriangle size={14}/> {alerts.length} cảnh báo: {alerts.map(a => PROCESS_STAGES.find(s=>s.id===a.stage)?.code).join(', ')}
            </div>
          )}
        </div>

        {/* Pipeline 9 steps */}
        {veh && (
          <>
            <div className="card-dark p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-cyber-300 text-[10px] font-semibold uppercase tracking-widest">Phương tiện đang theo dõi</div>
                  <div className="text-white text-lg font-bold">{veh.id} · {veh.model}</div>
                  <div className="text-slate-300 text-xs">{veh.unit} · Số khung {veh.chassis}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-cyber-300 uppercase">Tổng tiến độ</div>
                  <div className="text-2xl font-bold text-white">
                    {Math.round(flow.reduce((a, s) => a + s.progress, 0) / 9)}%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-9 gap-2">
                {PROCESS_STAGES.map((stage, i) => {
                  const data = flow.find(s => s.stage === stage.id) || {stage: stage.id, progress:0, status:'pending', assignee:'-', equipment:'-', time:'-', approvedKCS:false};
                  const alert = alerts.some(a => a.stage === stage.id);
                  return (
                    <StageCard key={stage.id} stage={stage} data={data} alert={alert}
                               onClick={() => setDetailModal({stage, data, idx: i})}/>
                  );
                })}
              </div>
            </div>

            {/* Detailed table */}
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-slate-800 mb-2 flex items-center gap-2">
                <Activity size={16} className="text-military-600"/> Chi tiết tiến độ 9 công đoạn
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[720px]">
                  <thead className="bg-military-50 text-military-700 text-xs uppercase">
                    <tr>
                      <th className="text-left p-2.5">#</th>
                      <th className="text-left p-2.5">Công đoạn</th>
                      <th className="text-left p-2.5">Thời gian</th>
                      <th className="text-left p-2.5">Tiến độ</th>
                      <th className="text-left p-2.5">Người phụ trách</th>
                      <th className="text-left p-2.5">Thiết bị</th>
                      <th className="text-left p-2.5">KCS</th>
                      <th className="text-right p-2.5">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flow.map((s, i) => {
                      const stage = PROCESS_STAGES.find(p => p.id === s.stage);
                      return (
                        <tr key={s.stage} className="border-b border-slate-100 hover:bg-cyber-50/40">
                          <td className="p-2.5 font-mono text-slate-500">{stage.code}</td>
                          <td className="p-2.5 font-semibold">{stage.name}</td>
                          <td className="p-2.5 text-xs">{s.time}</td>
                          <td className="p-2.5">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 max-w-[120px] bg-slate-200 rounded-full h-2">
                                <div className={`h-2 rounded-full ${
                                  s.status === 'done' ? 'bg-emerald-500' :
                                  s.status === 'paused' ? 'bg-rose-500' :
                                  s.status === 'doing' ? 'bg-cyber-500' : 'bg-slate-300'
                                }`} style={{width: `${s.progress}%`}}/>
                              </div>
                              <span className="text-xs font-semibold w-9 text-right">{s.progress}%</span>
                            </div>
                          </td>
                          <td className="p-2.5 text-xs">{s.assignee}</td>
                          <td className="p-2.5 text-xs">{s.equipment}</td>
                          <td className="p-2.5">
                            {s.approvedKCS
                              ? <span className="badge bg-emerald-100 text-emerald-700"><CheckCircle2 size={10}/> Đạt</span>
                              : s.status === 'done' ? <span className="badge bg-amber-100 text-amber-700"><Clock size={10}/> Chờ duyệt</span>
                              : <span className="badge bg-slate-100 text-slate-500">—</span>}
                          </td>
                          <td className="p-2.5 text-right whitespace-nowrap">
                            {canEdit && currentRole === 'engineer' && s.status !== 'done' && (
                              <button onClick={() => updateStage(i, {progress: Math.min(100, s.progress + 25), status: s.progress+25 >= 100 ? 'awaiting' : 'doing'})}
                                className="text-cyber-600 hover:bg-cyber-50 p-1 rounded" title="Tăng tiến độ +25%">
                                <Play size={14}/>
                              </button>
                            )}
                            {canEdit && s.status === 'awaiting' && (
                              <button onClick={() => updateStage(i, {status: 'doing'})}
                                className="text-blue-600 hover:bg-blue-50 p-1 rounded" title="Tiếp tục">
                                <Play size={14}/>
                              </button>
                            )}
                            {canEdit && s.status === 'doing' && (
                              <button onClick={() => updateStage(i, {status: 'paused'})}
                                className="text-amber-600 hover:bg-amber-50 p-1 rounded" title="Tạm dừng">
                                <Pause size={14}/>
                              </button>
                            )}
                            {canEdit && s.status === 'paused' && (
                              <button onClick={() => updateStage(i, {status: 'doing'})}
                                className="text-emerald-600 hover:bg-emerald-50 p-1 rounded" title="Tiếp tục">
                                <Play size={14}/>
                              </button>
                            )}
                            {canEdit && s.status === 'done' && s.approvedKCS && i < 8 && (
                              <button onClick={() => advance(i)}
                                className="text-cyber-700 hover:bg-cyber-50 p-1 rounded text-xs font-semibold flex items-center gap-0.5 ml-auto" title="Chuyển công đoạn kế tiếp">
                                <ChevronRight size={14}/> Tiếp
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </Section>

      <Modal open={!!detailModal} onClose={() => setDetailModal(null)} size="md"
        title={`${detailModal?.stage?.code} · ${detailModal?.stage?.name}`}>
        {detailModal && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-slate-500 text-xs">Tiến độ:</span>
                <div className="font-bold text-lg">{detailModal.data.progress}%</div>
              </div>
              <div><span className="text-slate-500 text-xs">Trạng thái:</span>
                <div className="font-bold">{detailModal.data.status}</div>
              </div>
              <div><span className="text-slate-500 text-xs">Người phụ trách:</span>
                <div className="font-semibold flex items-center gap-1"><User size={12}/> {detailModal.data.assignee}</div>
              </div>
              <div><span className="text-slate-500 text-xs">Thời gian thực hiện:</span>
                <div className="font-semibold">{detailModal.data.time}</div>
              </div>
              <div className="col-span-2"><span className="text-slate-500 text-xs">Thiết bị:</span>
                <div className="font-semibold flex items-center gap-1"><Wrench size={12}/> {detailModal.data.equipment}</div>
              </div>
              <div className="col-span-2"><span className="text-slate-500 text-xs">KCS:</span>
                <div className="font-semibold">{detailModal.data.approvedKCS ? '✅ Đã duyệt' : '⏳ Chưa duyệt'}</div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
