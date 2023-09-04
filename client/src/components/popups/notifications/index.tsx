import React from 'react';
import { Link  } from 'react-router-dom';
import { AppContext } from '../../../context/generalContext';
import { formatDistanceToNow } from 'date-fns';

import { useAppDispatch } from '../../../redux/hooks';
import { useSelector } from 'react-redux';
import { selectNotifications } from '../../../redux/notifications/selectors';
import { selectUserID } from '../../../redux/users/selectors';
import { setSelectedTaskID } from '../../../redux/tasks/slice';
import { INotification } from '@/redux/notifications/types';

import './notifications.scss'

export const Notifications = () => {
    const dispatch = useAppDispatch();
    const notifications = useSelector(selectNotifications);
    const userID = useSelector(selectUserID);
    const {popups} = React.useContext(AppContext)

    const closePopup = (taskID: number) => {
        dispatch(setSelectedTaskID(taskID));
        popups.setIsNotificationsPopup(false);
    }

    const timeAgo = (timestamp: Date) => {
        return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    };

    const renderNotifications = () => {
        const notificationsToRender = notifications.filter((notification) => notification.userID === userID).sort((a, b) => 
        new Date(b.notificationCreateDate!).getMilliseconds() - new Date(a.notificationCreateDate!).getMilliseconds());
        
        return notificationsToRender.map((notification) => {
            return (
                <div className="notification-item">
                    <span>
                    🔥 {notification.notificationContent}
                    <Link to={`/projects/${notification.projectID}/tasks/${notification.taskID}`} onClick={() => closePopup(notification.taskID!)}>{notification.notificationTaskTitle}</Link>
                    </span> 
                    |
                    <span>{timeAgo(new Date(notification.notificationCreateDate!))}</span>
                </div>
            )
        })
    }

    const countNotifications = (notifications: INotification[]) => {
        if (notifications.length === 1) {
            return (
                <span>1 new notification</span>
            );
        } else if (notifications.length > 0) {
            return (
                <span>{notifications.length} new notifications</span>
            )
        }
    }

    return (
        <div className={`notifications-wrapper ${popups.isNotificationsPopup ? "notifications-wrapper--active" : "notifications-wrapper--hidden"}`} > 
        <span>Notifications are stored for 30 days.</span>
        {notifications.length > 0 ?
            <>
                {countNotifications(notifications)}
                {renderNotifications()}
            </>
            : 
            <span>No new notifications.</span>}
        </div>
    )
}