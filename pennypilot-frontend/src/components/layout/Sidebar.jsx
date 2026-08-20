import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, PlusCircle, Compass } from 'lucide-react';

export const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <Compass size={22} />
        </div>
        <span className="brand-name">PennyPilot</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          end
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/expenses"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          end
        >
          <Receipt size={20} />
          <span>All Expenses</span>
        </NavLink>

        <NavLink
          to="/expenses/new"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <PlusCircle size={20} />
          <span>Add Expense</span>
        </NavLink>
      </nav>
    </aside>
  );
};
