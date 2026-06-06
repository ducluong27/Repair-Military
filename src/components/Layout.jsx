// ============================================================
// HEADER + SIDEBAR + ROLE SWITCHER
// ============================================================
import React, { useState } from 'react';
import {
  LayoutDashboard, Truck, Cog, CalendarRange, Workflow,
  ClipboardCheck, Boxes, BarChart3, Settings, ShieldCheck,
  Menu, ChevronDown, LogOut, Bell, Search, Users
} from 'lucide-react';
import { ROLES } from '../data/mockData';
import Logo from '../data/Image/logo.png';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard điều hành', icon: LayoutDashboard, roles: ['leader','engineer','kcs','material','admin'] },
  { id: 'vehicles',  label: 'Quản lý Phương tiện',   icon: Truck,          roles: ['leader','engineer','kcs','admin'] },
  { id: 'engines',   label: 'Quản lý Động cơ',       icon: Cog,            roles: ['leader','engineer','kcs','admin'] },
  { id: 'plans',     label: 'Kế hoạch sửa chữa',     icon: CalendarRange,  roles: ['leader','engineer','admin'] },
  { id: 'process',   label: 'Công đoạn công nghệ',   icon: Workflow,       roles: ['leader','engineer','kcs','admin'] },
  { id: 'kcs',       label: 'KCS điện tử',           icon: ClipboardCheck, roles: ['leader','engineer','kcs','admin'] },
  { id: 'inventory', label: 'Vật tư – Phụ tùng',     icon: Boxes,          roles: ['leader','material','admin'] },
  { id: 'reports',   label: 'Báo cáo – Thống kê',    icon: BarChart3,      roles: ['leader','admin'] },
  { id: 'admin',     label: 'Quản trị hệ thống',     icon: Settings,       roles: ['admin'] },
];

export function Sidebar({ active, setActive, currentRole, mobileOpen, setMobileOpen }) {
  const items = NAV_ITEMS.filter(i => i.roles.includes(currentRole));
  return (
    <>
      {/* Backdrop mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-slate-900/50 lg:hidden"
             onClick={() => setMobileOpen(false)} />
      )}
      <aside className={`
        fixed lg:static z-40 inset-y-0 left-0
        w-64 lg:w-60 xl:w-64 shrink-0
        bg-gradient-to-b from-military-700 to-military-800
        text-slate-100 border-r border-military-600
        transform transition-transform duration-200
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Logo */}
        <div className="px-4 py-4 border-b border-military-600 flex items-center gap-3">
          <img
            src={Logo}
            alt="MARS-MES logo"
            className="w-10 h-10 rounded-lg object-cover shadow-lg"
          />
          <div className="leading-tight">
            <div className="font-bold text-base tracking-wide">MARS-MES</div>
            <div className="text-[10px] text-cyber-400 uppercase tracking-wider">Military Auto Repair</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 scroll-thin">
          {items.map(it => {
            const Icon = it.icon;
            const isActive = active === it.id;
            return (
              <button
                key={it.id}
                onClick={() => { setActive(it.id); setMobileOpen(false); }}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium
                  transition relative
                  ${isActive
                    ? 'bg-military-600/80 text-white shadow-inner border-l-4 border-cyber-400'
                    : 'text-slate-300 hover:bg-military-600/40 hover:text-white border-l-4 border-transparent'}
                `}
              >
                <Icon size={18} className={isActive ? 'text-cyber-400' : 'text-slate-400'} />
                <span className="truncate">{it.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-military-600 text-[11px] text-slate-400 text-center">
          © 2026 • Bộ Quốc phòng
          <div className="text-cyber-400/80 font-semibold mt-0.5">Digital Factory v1.0</div>
        </div>
      </aside>
    </>
  );
}

export function Header({ currentRole, setCurrentRole, currentUser, setMobileOpen }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="flex items-center justify-between gap-3 px-4 sm:px-6 h-14">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 hover:bg-slate-100 rounded">
            <Menu size={20} />
          </button>

          {/* Search */}
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
            <div className="relative w-full">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
              <input className="input pl-9 h-9 text-sm" placeholder="Tìm xe, công đoạn, vật tư…"/>
            </div>
          </div>
        </div>

        <div className="flex-1 md:hidden" />

        {/* Right */}
        <div className="flex items-center gap-2 shrink-0">
          <button className="relative p-2 hover:bg-slate-100 rounded">
            <Bell size={18} className="text-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
          </button>

          {/* Role switcher */}
          <div className="relative">
            <button
              onClick={() => setOpen(v => !v)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-left"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-military-500 to-military-700 grid place-items-center text-white font-bold text-sm">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden sm:block leading-tight">
                <div className="text-sm font-semibold text-slate-800 truncate max-w-[350px]">{currentUser.name}</div>
                <div className="text-[10px] text-cyber-600 font-semibold uppercase">
                  {ROLES.find(r => r.key === currentRole)?.label}
                </div>
              </div>
              <ChevronDown size={14} className="text-slate-500" />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl border border-slate-200 shadow-xl py-2 animate-fade-in">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <div className="text-[11px] text-slate-500 uppercase font-semibold">Chuyển đổi vai trò</div>
                </div>
                {ROLES.map(r => (
                  <button
                    key={r.key}
                    onClick={() => { setCurrentRole(r.key); setOpen(false); }}
                    className={`w-full flex items-start gap-3 px-3 py-2 text-left hover:bg-slate-50 ${r.key === currentRole ? 'bg-cyber-50' : ''}`}
                  >
                    <Users size={16} className={r.key === currentRole ? 'text-cyber-600 mt-0.5' : 'text-slate-400 mt-0.5'} />
                    <div className="flex-1">
                      <div className={`text-sm font-medium ${r.key === currentRole ? 'text-cyber-700' : 'text-slate-800'}`}>{r.label}</div>
                      <div className="text-[11px] text-slate-500">{r.desc}</div>
                    </div>
                  </button>
                ))}
                <div className="px-3 pt-2 mt-2 border-t border-slate-100">
                  <button className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-rose-600 hover:bg-rose-50 rounded">
                    <LogOut size={14} /> Đăng xuất (mock)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
