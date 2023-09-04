import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../../firebase.config';
import { useNavigate, useLocation } from 'react-router-dom';
import {signOut, onAuthStateChanged} from 'firebase/auth';
import { AppContext } from '../../context/generalContext';

// Redux
import { useAppDispatch } from '../../redux/hooks';
import { useSelector } from 'react-redux';
import { selectSearchProjectValue } from '../../redux/projects/selectors';
import { selectSearchValue } from '../../redux/tasks/selectors';
import { selectUser } from '../../redux/users/selectors';
import { updateSearchValue } from '../../redux/tasks/slice';
import { setIsAddNewProjectOpened, updateSearchProjectValue } from '../../redux/projects/slice';
import { setAddTaskOpened } from '../../redux/tasks/slice';
import { setIsLoggedIn } from '../../redux/users/slice';

// Components
import { TimerPopup } from '../popups/timerPopup';
import { Notifications } from '../popups/notifications';

// Images
import { userIcon } from '../../assets/img';
import { bellIcon } from '../../assets/img';
import { logo } from '../../assets/img';

import './header.scss'



export const Header = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const searchTaskValue = useSelector(selectSearchValue);
    const searchProjectValue = useSelector(selectSearchProjectValue);
    const currentUser = useSelector(selectUser);
  
    
    const [isUser, setIsUSer] = React.useState(false);
    const {popups, isLoggedIn, timer} = React.useContext(AppContext);

    const handleSearchTaskUpdate = (e: React.ChangeEvent) => {
        const searchTarget = e.target as HTMLInputElement;
        const searchVal = searchTarget.value;
        dispatch(updateSearchValue(searchVal));
      }

    const handleSeacrchProjectUpdate = (e: React.ChangeEvent) => {
        const searchTarget = e.target as HTMLInputElement;
        const searchVal = searchTarget.value;
        dispatch(updateSearchProjectValue(searchVal));
      }

      const handleCloseNotifications = (e: any) => {
        if (!e.target.closest(".notifications-wrapper")) {
          popups.setIsNotificationsPopup(false);
        }
      }
      
        React.useEffect(() => {
          if (popups && popups.isNotificationsPopup) {
            document.addEventListener("mousedown", handleCloseNotifications)
          } else {
            document.removeEventListener("mousedown", handleCloseNotifications)
          }
          return () => {
            document.removeEventListener("mousedown", handleCloseNotifications)
          }
          
        }, [popups])

    const userSignOut = async () => {
        try {
            await signOut(auth);
            navigate("/")
            dispatch(setIsLoggedIn(false));  

        } catch(e) {
            console.error(e)
        }
    }

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setIsUSer(user ? true : false);
        });
        return () => unsubscribe();
      }, []);

    const openAddProjectForm = () => {
        dispatch(setIsAddNewProjectOpened(true));
        popups.setIsOverlay(true);
        }

    const openAddTaskForm = () => {
        dispatch(setAddTaskOpened(true))
        popups.setIsOverlay(true);
        }


    const openAddCustomerForm = () => {
        popups.setIsAddCustomer(true);
        popups.setIsOverlay(true);
      }
        
    const formatTime = (time: number): string => {
        const hours = Math.floor(time / 3600000).toString().padStart(2, '0');
        const minutes = Math.floor((time % 3600000) / 60000).toString().padStart(2, '0');
        const seconds = Math.floor((time % 60000) / 1000).toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
      };

      const openTimerPopup = () => {
        popups.setIsTimerPopup(true);
      }

      const openNotificationsPopup =() => {
        popups.setIsNotificationsPopup(true);
      }

    return (
        <> {isUser ?  
        <header className="header">
          <div className="header__right">
            {location.pathname === `/` || location.pathname === '/projects' ? 
              <>
              {currentUser.userRole?.includes("Executive") || currentUser.userRole?.includes("Owner") ? <button className='button' onClick={() => openAddProjectForm()}>Add new project</button> : null}
                <input className="header__search" type="text" onChange={handleSeacrchProjectUpdate} value={searchProjectValue} placeholder='Search projects'/> 
              </>
              : <>
              {location.pathname.includes("/tasks") ?  <button className="button" onClick={() => openAddTaskForm()}>Add new task</button> : null }
              {location.pathname.includes("/tasks") ? <input className="header__search" type="text" onChange={handleSearchTaskUpdate} value={searchTaskValue} placeholder='Search tasks'/> : null}
              {location.pathname.includes("/customers") ? <button className="button" onClick={() => openAddCustomerForm()}>Add new customer</button> : null}
                </>

                }
                {timer.running || timer.passedTime > 0 ? 
                <>
                <div className="header__timer" onClick={() => openTimerPopup()}>{formatTime(timer.passedTime)}</div> 
                </>
                : null}

                <TimerPopup isCalled={popups.isTimerPopup} />
                <Link to="/profile"><img  src={userIcon} /></Link>
                <img src={bellIcon} onClick={() => openNotificationsPopup()} alt="" />
                <Notifications />
                <button className="button" onClick={() => userSignOut()}>Sign out</button>
            </div>
        </header>
        :
        <header className="header">
          <img src={logo} alt="Logo" />
          <span className="sidebar__title">Zen Harmony</span>
            <Link to="/auth" className="header__auth">Log In/Sign-up</Link>
        </header>
        }
        </>
    )
}