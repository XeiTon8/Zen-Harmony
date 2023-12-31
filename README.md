﻿# 📜 Zen Harmony
A project management system built on React-Redux with Node.js, mySQL and Web-Sockets.

 **Functionality**:
+ Auth via Firebase and JWT;
+ Projects and tasks;
+ Timer, labels, status and other features for tasks;
+ Filtering tasks (by status, deadline, labels);
+ Search;
+ 2-step inviting new users with sending them invitation link;
+ Access to app's features based on user's role;
+ Calendar and calendar events;
+ Notifications;
+ Reports for each project;

## 🚀 Stack
+ Frontend: React, Redux;
+ Backend: MySQL, Node.js, Express, WebSockets;
+ Auth: Firebase Authentication, MySQL;
+ Libraries: Axios, React Router, Draft-js, Date-fns, Lodash, Node-Cron, Node-mailer;
+ Additional: SASS, BEM, WebPack, Babel;

## Project's key features showcase 

### Auth
![Auth-gif](https://github.com/XeiTon8/Zen-Harmony/blob/main/gifs/Auth.gif)
Auth's realized with Firebase and JWT. Includes 3 steps:
1. Creating firebase account.
2. Setting user's credentials to the database (e.g. userID, email, username).
3. Checking user with JWT before displaying content for him. Checking occurs every time users signs-in the app. 
If the user was verified, then user's credentials will be downloaded from mySQL, along with other data.
Auth also has validation of user's email and password for sign-up and sign-in. 

### Projects and tasks
![Projects-and-tasks-gif](https://github.com/XeiTon8/Zen-Harmony/blob/main/gifs/Project%20and%20tasks.gif)
Users with role "Executive" or "Owner" can create projects. Each project can have its own tasks and assigned customer. Last 4 projects are displayed on the dashboard, all projects are rendered on the projects' page. 

Tasks include such main features:
+ Filtering by status, labels or deadline (e.g. for today/tomorrow, or with status "In Progress);
+ Starting a timer that would show the running time, stopping timer and setting the time to the task (or canceling timer and all passed time);
+ Real-time commentaries with Web-Sockets;
+ Subscribing for new commentaries in task;
+ Closing task and setting it to archive, so the task for that project will be displayed on reports page;

Both projects and tasks can be filtered via search:
![search-gif](https://github.com/XeiTon8/Zen-Harmony/blob/main/gifs/Search.gif)

### Users

Each user can have 1 of 3 roles: "Owner", "Executive" or "Employee". Based on current user's role, some features may be disabled or enabled (e.g. employees can not invite other users or edit their profiles, delete projects).

Executives and Owner can invite new employees. Inviting includes 2 steps:
![users-step-1-gif](https://github.com/XeiTon8/Zen-Harmony/blob/main/gifs/Users-step-1.gif)
1. Setting an email of the employee that will be invited, with optional department and position. Once all info was set, user can call API request that will send to employee's email invite link and set temporary account in mySQL with info about employee's email, department and position.

![users-step-2-gif](https://github.com/XeiTon8/Zen-Harmony/blob/main/gifs/Users-step-2.gif)
2. Once employee received an email and clicked the invite link, they can sign-up with other credentials such as username. Auth for employees includes creating firebase account and updating temporary account in mySQL, filling it with other credentials. 

All users are displayed on the users page. 

### Calendar
![calendar-gif](https://github.com/XeiTon8/Zen-Harmony/blob/main/gifs/Calendar.gif)
User can use calendar to create calendar events, for example, planning an employee's vacation or setting up a meeting. Displayed events will be automatically rendered on calendar inside table cells. User can edit events, setting up different event type, assigning another user or changing date range. 

### Notifications
![notifications-gif](https://github.com/XeiTon8/Zen-Harmony/blob/main/gifs/Notifications.gif)
User can subscribe to tasks, so they will be added to array in current user's profile in redux. After subscribing, user will receive notifications if new comments were added by another user. Each notification includes a link to the task with a new comment and is stored for 30 days, then deleted with Node-cron.

From a technical side, notifications are created in 3 steps:
1. Using debouced dispatch to set a taskID to state's property in redux toolkit, then adding that property to an array of task IDs.
2. Performing forEach loop for the array, setting every task ID from the array to a number property in redux that will be used for creating notification.
3. Creating new notification every time there's new change in taskIDFromStack. 

Debounced dispatch is used in case 2 or more users add a new commentary in tasks at the same time, so their taskIDs won't overwrite each other.

### Reports
![reports-gif](https://github.com/XeiTon8/Zen-Harmony/blob/main/gifs/Reports.gif)
Reports are generated for each project if any task was archived. On reports page, users can see info about archived tasks (e.g. assigned user, spent time on the task, date when the task was archived) and total costs. Users can find reports for specific project with filters.  
