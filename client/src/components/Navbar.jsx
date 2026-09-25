import React from 'react';
import { LayoutDashboard, Tv, Users, Wallet, Trophy, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { triggerHaptic } from '../utils/haptics';

export default function Navbar({ activeTab, setActiveTab, isAdmin }) {
  const { t } = useLanguage();

  const navItems = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { id: 'tasks', label: t('nav.tasks'), icon: Tv },
    { id: 'refer', label: t('nav.refer'), icon: Users },
    { id: 'withdraw', label: t('nav.withdraw'), icon: Wallet },
    { id: 'leaderboard', label: t('nav.activity'), icon: Trophy }
  ];

  if (isAdmin) {
    navItems.push({ id: 'admin', label: t('nav.admin'), icon: ShieldAlert });
  }

  const handleTabClick = (tabId) => {
    if (activeTab !== tabId) {
      triggerHaptic('selection');
      setActiveTab(tabId);
    }
  };

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => handleTabClick(item.id)}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
