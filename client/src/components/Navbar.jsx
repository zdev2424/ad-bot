import React from 'react';
import { LayoutDashboard, Tv, Users, Wallet, Trophy, ShieldAlert } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, isAdmin }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks', icon: Tv },
    { id: 'refer', label: 'Refer', icon: Users },
    { id: 'withdraw', label: 'Withdraw', icon: Wallet },
    { id: 'leaderboard', label: 'Activity', icon: Trophy }
  ];

  if (isAdmin) {
    navItems.push({ id: 'admin', label: 'Admin', icon: ShieldAlert });
  }

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
