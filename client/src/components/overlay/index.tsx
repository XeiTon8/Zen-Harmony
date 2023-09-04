import React from 'react';
import { AppContext } from '../../context/generalContext';

import './overlay.scss'

export const Overlay = () => {

    const {popups} = React.useContext(AppContext)
    return (
        <div className={`${popups.isOverlay ? 'overlay-active' : 'overlay'}`}></div>
    )
}