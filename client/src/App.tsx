import React from 'react';
import axios from 'axios';
import _debounce from 'lodash/debounce';
import {  Routes, Route } from 'react-router-dom';
import {auth} from './firebase.config'
import {onAuthStateChanged} from 'firebase/auth';
import { AppProvider } from './context/generalContext';
import { WebSocketProvider } from './context/socketContext';
import { MySQLService } from './services/MySQLService';
import './App.scss';

// Components
import { Auth } from './components/auth';
import {Header} from './components/header';
import { SidebarMenu } from './components/sidebar-menu';
import { Dashboard } from './components/dashboard';
import { Profile } from './components/users/profile';
import { Team } from './components/users/team';
import { UserCard } from './components/users/userCard';
import { Departments } from './components/users/team/departments';
import { Positions } from './components/users/team/positions';
import { ProjectBoard } from './components/project-board';
import { DetailedTask } from './components/tasks/detailed-task';
import { CalendarComponent } from './components/calendar';

// Pages
import { Reports } from './pages/reports';
import { Customers } from './pages/customers';
import { Projects } from './pages/projects';


// Redux selectors
import { useSelector } from 'react-redux';
import { useAppDispatch } from './redux/hooks';
import { selectIsLoggedIn, selectIsUserCardOpened, selectSelectedUserID, selectSubscribedTasks, selectUser, selectUserByID, selectUserID } from './redux/users/selectors'
import { selectIsNewComment, selectSelectedTaskID, selectTaskByID } from './redux/tasks/selectors';

// Redux reducers
import { getUser, setIsLoggedIn } from './redux/users/slice';
import { fetchArchivedTasks, fetchAllTaks, setIsNewComment } from './redux/tasks/slice';
import { fetchProjects } from './redux/projects/slice';
import { fetchDepartments } from './redux/users/departments/slice';
import { fetchPositions } from './redux/users/positions/slice';
import { getUsers } from './redux/users/slice';
import { fetchLabels } from './redux/tasks/slice';
import { fetchCustomers } from './redux/customers/slice';
import { selectIsNewNotification, selectTaskIDAddToStack, selectTaskIDFromStack, selectNotificationTaskIDStack, selectCommentCreatedBy } from './redux/notifications/selectors';
import { addNewTaskIDToStack, addNotification, clearSubscribedTasksStack, fetchNotifications, setIsNewNotification, setNotificationLastTaskID } from './redux/notifications/slice';
import { INotification } from './redux/notifications/types';


function App() {
  const dispatch = useAppDispatch();
  const delayedDispatch = _debounce((taskID: number) => {
    dispatch(setNotificationLastTaskID(taskID))
  }, 300)
  const service = new MySQLService();
  const url = "http://localhost:8081";

  
  // User
  const currentUser = useSelector(selectUser)
  const userId = useSelector(selectUserID);
  const selectedUserID = useSelector(selectSelectedUserID)
  const selectedUser = useSelector(selectUserByID(selectedUserID))
  const isUserCardOpened = useSelector(selectIsUserCardOpened);

  // Projects and tasks
  const selectedTaskID = useSelector(selectSelectedTaskID);
  const selectedTask = useSelector(selectTaskByID(selectedTaskID))
  const isLoggedIn = useSelector(selectIsLoggedIn);

  // Notifications
  const subscribedTaskID = useSelector(selectTaskIDFromStack);
  const taskIDToStack = useSelector(selectTaskIDAddToStack);
  const subscribedTasksList = useSelector(selectSubscribedTasks);
  const taskIDStack = useSelector(selectNotificationTaskIDStack);
  const isNewComment = useSelector(selectIsNewComment);
  const isNewNotification = useSelector(selectIsNewNotification);
  const commentCreatedByUserID = useSelector(selectCommentCreatedBy);
  const [isUserVerified, setIsUserVerified] = React.useState(false);

  const fetchData =  async () => {
    await dispatch(fetchCustomers());
    await dispatch(fetchNotifications());
    await dispatch(fetchProjects());
    await dispatch(fetchArchivedTasks());
    await dispatch(getUsers());
    await dispatch(fetchAllTaks());
    await dispatch(fetchDepartments());
    await dispatch(fetchPositions());
    await dispatch(fetchLabels());
  }

  React.useEffect(() => {
    try {
      onAuthStateChanged(auth, async (user) => {
        user = auth.currentUser;
          if (user) {
          const token = await user.getIdToken();
          const res = await axios.post(`${url}/users/verify`, {
            token: token
          });
          const uid = res.data.uid;
          if (uid) {
            setIsUserVerified(true);
            await dispatch(getUser(uid));
            await fetchData();
            await dispatch(setIsLoggedIn(true));
          }}
    }) 
    } catch (error) {
      console.error(error);
    }
  }, [])

  // Notifications

  // Step 1 - adding new task ID to stack
  React.useEffect(() => {
    if (isNewComment) {
      currentUser.subscribedTasks?.forEach((task) => {
        console.log("For each running")
        console.log(taskIDToStack)
        console.log(task.taskID);
        if (Number(task.taskID) == taskIDToStack!) {
          console.log("Adding to stack")
        
        dispatch(addNewTaskIDToStack(taskIDToStack)) 

        }})
    }}, [isNewComment])

   // Step 2 - setting each ID from stack to redux
  React.useEffect(() => {
    if (taskIDStack.length > 0) {
      console.log("Stack ID: ", taskIDStack)
      taskIDStack.forEach((updatedTaskID) => {
        delayedDispatch(updatedTaskID);
      });
      dispatch(setIsNewNotification(true));
    }
    setTimeout(() => {
      dispatch(setIsNewNotification(false));
      dispatch(setIsNewComment(false))
    }, 900)
  }, [taskIDStack])
  
  // Step 3 - creating a notification if there's a new task ID from redux and new commentary was added
  React.useEffect(() => {
    const createNotifications = async () => {

      if (taskIDStack.length > 0) {
        const lastTask = subscribedTasksList?.find((task) => task.taskID === subscribedTaskID)

        if (isNewNotification && lastTask !== undefined && currentUser.userID !== commentCreatedByUserID) {
          const expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() + 30);
          const newNotification: INotification = {
            userID: userId!,
            projectID: lastTask!.projectID,
            taskID: lastTask!.taskID!,
            notificationTaskTitle: lastTask!.taskTitle,
            notificationContent: `New commentary in task `,
            notificationCreateDate: new Date(),
            notificationExpireDate: expirationDate,
            isRead: false,
          }
          const res = await service.createNotification(newNotification);
          const fetchedNotification = await service.getNotificationByID(res.data.insertId);
          const notificationToAdd = fetchedNotification.data[0];
          dispatch(addNotification(notificationToAdd));
          dispatch(clearSubscribedTasksStack);
        }
      }
    }

    createNotifications();
  }, [subscribedTaskID, isNewNotification])

  return (
    <WebSocketProvider>
    <AppProvider>
    <>
    {isUserVerified && isLoggedIn ? 
    <div className="wrapper">
      <SidebarMenu />
      <main>
        <Header />
        <Routes>
          <Route  path="/" element={<Dashboard />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/employee" element={<Auth />} />
          <Route path= "/:userID/projects/:projectID/tasks" element={<ProjectBoard/>} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/team" element={<Team />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/positions" element={<Positions />} />
          <Route path="/calendar" element={<CalendarComponent />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/customers" element={<Customers />} />

          {isUserCardOpened && selectedUser && (
            <Route path="/users/:userName" element={
              <UserCard 
              userName={selectedUser.userName}
              userEmail={selectedUser.userEmail} 
              userID={selectedUser.userID!}
              userRole={selectedUser.userRole}
              boss={selectedUser.boss}
              department={selectedUser.department}
              position={selectedUser.position}
              />}  />
          )}

          {selectedTask && (
            <Route path="/projects/:projectID/tasks/:taskID" element={
            <DetailedTask 
                taskID={selectedTask.taskID}
                taskTitle={selectedTask.taskTitle}
                taskDescription={selectedTask.taskDescription}
                dateCreated={selectedTask.dateCreated}
                deadline={selectedTask.deadline}
                status={selectedTask.status}
                position={selectedTask.position}
                taskLabels={selectedTask.taskLabels}
                isArchived={selectedTask.isArchived}
                projectID={selectedTask.projectID}
                taskCreatedBy={selectedTask.taskCreatedBy}
                comments={selectedTask.comments}
                timeSpent={selectedTask.timeSpent}
                costs={selectedTask.costs}
                assignedUsers={selectedTask.assignedUsers}
                dateFinished={selectedTask.dateFinished}
            /> } />
          )}
        
        </Routes>
        </main>
    </div>
    : (
      <div>
        <Header/>
        <Routes>
        <Route>
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/employee" element={<Auth />} />
        </Route>
        </Routes>
      </div>
      )}
    </>
    </AppProvider>
    </WebSocketProvider>
  );
}

export default App