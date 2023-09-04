import React from 'react'


interface AppContextValues {
  popups: {
    isOverlay: boolean;
    isSidebar: boolean;
    isTimerPopup: boolean;
    isAddEmployee: boolean;
    isCalendarEventCard: boolean;
    isCustomerCard: boolean;
    isDepartmentCard: boolean;
    isPositionCard: boolean;
    isAddDepartment: boolean;
    isAddPosition: boolean;
    isAddCustomer: boolean;
    isNotificationsPopup: boolean;
    setIsOverlay: (val: boolean) => void;
    setIsSidebar: (val: boolean) => void;
    setIsTimerPopup: (val: boolean) => void;
    setIsAddEmployee: (val: boolean) => void;
    setIsCalendarEventCard: (val: boolean) => void;
    setIsCustomerCard: (val: boolean) => void;
    setIsDepartmentCard: (val: boolean) => void;
    setIsPositionCard: (val: boolean) => void;
    setIsAddDepartment: (val: boolean) => void;
    setIsAddPosition: (val: boolean) => void;
    setIsAddCustomer: (val: boolean) => void;
    setIsNotificationsPopup: (val: boolean) => void;
  }
    
    isLoggedIn: React.MutableRefObject<boolean>;
    timer: ITimer;
    setTimer: (val: any) => void;
  
  }

export  interface ITimer {
    running: boolean,
    startTime: number | null,
    passedTime: number,
    timerTaskID: number | null,
  }

const AppContext = React.createContext<AppContextValues>({} as AppContextValues);

const AppProvider: React.FC<{children: any}>= ({ children }) => {

  const [isOverlay, setIsOverlay] = React.useState(false);
  const [isSidebar, setIsSidebar] = React.useState(false);
  const [isTimerPopup, setIsTimerPopup] = React.useState(false);
  const [isNotificationsPopup, setIsNotificationsPopup] = React.useState(false);
  

  const [isCalendarEventCard, setIsCalendarEventCard] = React.useState(false);
  const [isCustomerCard, setIsCustomerCard] = React.useState(false);
  const [isPositionCard, setIsPositionCard] = React.useState(false);
  const [isDepartmentCard, setIsDepartmentCard] = React.useState(false);

  const [isAddDepartment, setIsAddDepartment] = React.useState(false);
  const [isAddEmployee, setIsAddEmployee] = React.useState(false);
  const [isAddPosition, setIsAddPosition] = React.useState(false);
  const [isAddCustomer, setIsAddCustomer] = React.useState(false);

  const [timer, setTimer] = React.useState<ITimer>({
    running: false,
    startTime: 0,
    passedTime: 0,
    timerTaskID: null
  });

  const isLoggedIn = React.useRef<boolean>(false);
  
  return (
    <AppContext.Provider value={{ 
      popups: {
        isOverlay, 
        setIsOverlay, 
        isSidebar, 
        setIsSidebar, 
        isAddEmployee,
        setIsAddEmployee,
        isTimerPopup, 
        setIsTimerPopup,
        isNotificationsPopup,
        setIsNotificationsPopup,
        isCalendarEventCard,
        setIsCalendarEventCard,
        isCustomerCard,
        setIsCustomerCard,
        isPositionCard,
        setIsPositionCard,
        isDepartmentCard,
        setIsDepartmentCard,
        isAddDepartment,
        setIsAddDepartment,
        isAddPosition,
        setIsAddPosition,
        isAddCustomer,
        setIsAddCustomer,
      },
      timer, 
      setTimer, 
      isLoggedIn,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };