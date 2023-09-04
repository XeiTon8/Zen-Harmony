import React from 'react';
import { Link } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/users/selectors';

import { logo } from '../../assets/img';
import './sidebar-menu.scss'

export const SidebarMenu = () => {

    const user = useSelector(selectUser);
    return (
        <>
        <aside className={`sidebar-menu sidebar--active`}>
        <div className="sidebar__logo-wrapper">
            <Link to="/">
                <img src={logo} alt="Logotype" />
            </Link>
            <span className="sidebar__title">Zen Harmony</span>
        </div>
        <div className="sidebar-menu__links-list-wrapper">
            <ul className="sidebar-menu__links-list">
                <li><Link to="/">Dashboard</Link></li>
                <li><Link to="/projects">Projects</Link></li>
                <li><Link to="/team">Team</Link></li>
                <li><Link to="/customers">Customers</Link></li>
                <li><Link to="/calendar">Calendar</Link></li>
                <li><Link to="/reports">Reports</Link></li>
            </ul>
        </div>
        </aside>
        </>
    )
}