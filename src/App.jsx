// ============================================================
// APP.JSX — Điều phối tổng, render Sidebar + Header + Module
// ============================================================
import React, { useEffect, useMemo, useState } from 'react';
import { Sidebar, Header } from './components/Layout';
import { loadDB, saveDB } from './data/mockData';

import Dashboard       from './components/modules/Dashboard';
import VehicleManager  from './components/modules/VehicleManager';
import EngineManager   from './components/modules/EngineManager';
import PlanManager     from './components/modules/PlanManager';
import ProcessManager  from './components/modules/ProcessManager';
import KCS             from './components/modules/KCS';
import Inventory       from './components/modules/Inventory';
import { Reports, Admin } from './components/modules/Reports';

export default function App() {
  const [active, setActive]   = useState('dashboard');
  const [role, setRole]       = useState('admin');   // role hiện tại
  const [db, setDbRaw]        = useState(() => loadDB());
  const [mobileOpen, setMobileOpen] = useState(false);

  // Tìm user tương ứng role
  const currentUser = useMemo(() => {
    return db.users.find(u => u.role === role) || db.users[0];
  }, [db, role]);

  // Quyền chỉnh sửa
  const canEdit = role !== 'leader';

  // Cập nhật DB xuống LocalStorage
  useEffect(() => { saveDB(db); }, [db]);

  // Wrapper setter – chấp nhận cả object lẫn updater function
  const setDb = (updater) => {
    setDbRaw(prev => typeof updater === 'function' ? updater(prev) : updater);
  };

  const renderModule = () => {
    switch (active) {
      case 'dashboard': return <Dashboard db={db}/>;
      case 'vehicles':  return <VehicleManager db={db} setDb={setDb} canEdit={canEdit}/>;
      case 'engines':   return <EngineManager  db={db} setDb={setDb} canEdit={canEdit}/>;
      case 'plans':     return <PlanManager    db={db} setDb={setDb} canEdit={canEdit}/>;
      case 'process':   return <ProcessManager db={db} setDb={setDb} canEdit={canEdit} currentRole={role}/>;
      case 'kcs':       return <KCS            db={db} setDb={setDb} canEdit={canEdit} currentRole={role}/>;
      case 'inventory': return <Inventory      db={db} setDb={setDb} canEdit={canEdit}/>;
      case 'reports':   return <Reports        db={db}/>;
      case 'admin':     return <Admin          db={db} setDb={setDb}/>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-100">
      <Sidebar
        active={active}
        setActive={setActive}
        currentRole={role}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          currentRole={role}
          setCurrentRole={setRole}
          currentUser={currentUser}
          setMobileOpen={setMobileOpen}
        />

        <main className="flex-1 p-4 sm:p-5 overflow-x-hidden">
          {renderModule()}
        </main>

        <footer className="px-5 py-3 text-center text-xs text-slate-500 border-t border-slate-200 bg-white">
          MARS-MES v1.0 · Hệ thống Điều hành Nhà máy Sửa chữa Ô tô Quân sự ·
          Bản demo Frontend lưu trữ bằng LocalStorage
        </footer>
      </div>
    </div>
  );
}
