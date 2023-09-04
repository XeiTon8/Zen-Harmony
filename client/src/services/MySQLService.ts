import axios from 'axios';
import React from 'react'

// Types
import { IPosition } from '../redux/users/positions/types';
import { IComment, ILabel, ITask } from '../redux/tasks/types';
import { IUser } from '../redux/users/types';
import { IDepartment } from '../redux/users/departments/types';
import { ICalendarEvent } from '../redux/calendarEvents/types';
import { ICustomer } from '@/redux/customers/types';
import { INotification } from '@/redux/notifications/types';



export class MySQLService {
  constructor() {}
  private url = "http://localhost:8081";



  //* TASKS *//
  public async getAllTasks() {
    try {
      const res = await axios.get(`${this.url}/tasks/all`);
      console.log(res.data);
      return res.data;
    } catch (e: any) {
      throw new Error(e);
    }
  }

  public async addTask(userID: string, projectID: number, task: any) {
    try {
      const res = await axios.post(`${this.url}/${userID}/projects/${projectID}/tasks`, task);
      console.log(res.data);
      return res.data;
    } catch (e: any) {
      throw new Error(e);
    }
  }

  public async getTaskByID(userID: string, projectID: number, taskID: number) {
    try {
      const res = await axios.get(`${this.url}/${userID}/projects/${projectID}/tasks/${taskID}`);
      console.log(res.data);
      return res.data;
    } catch (e: any) {
      throw new Error(e);
    }
  }

  public async getTaskFromArchive(userID: string, projectID: number, taskID: number) {
    try {
      const res = await axios.get(`${this.url}/${userID}/projects/${projectID}/tasks/${taskID}/archive`);
      console.log(res.data);
      return res.data;
    } catch (e: any) {
      throw new Error(e);
    }

  }

  public async getAllArchivedTasks() {
    try {
      const res = await axios.get(`${this.url}/tasks/archived`);
      console.log(res.data);
      return res.data;

    } catch (e: any) {
      throw new Error(e);
    }

  }

  public async updateTask(projectID: number, taskID: number, task: any) {
    try {
      const res = await axios.put(`${this.url}/projects/${projectID}/tasks/${taskID}`, task)
      console.log(res.data);
      return res.data;
    } catch (e: any) {
      throw new Error(e);
    }
  }

  public async updateTaskTimeSpent(projectID: number, taskID: number, timeSpent: number) {
    try {
      const res = await axios.put(`${this.url}/projects/${projectID}/tasks/${taskID}/updateTimeSpent`, { timeSpent: timeSpent });
      console.log(res.data);
      return res.data;
    } catch (e: any) {
      throw new Error(e)
    }
  }

  public async archiveTask(task: ITask, projectID: number, taskID: number) {
    try {
      const res = await axios.put(`${this.url}/projects/${projectID}/tasks/${taskID}/archive`, task);
      return res.data;
    } catch (e: any) {
      throw new Error(e);
    }
  }



  public async deleteTask(userID: string, projectID: number, taskID: number) {
    try {
      const res = await axios.delete(`${this.url}/${userID}/projects/${projectID}/tasks/${taskID}`)
      return res.data;
    } catch (e: any) {
      throw new Error(e);
    }
  }

  //* COMMENTS *//
  public async addComment(userID: string, projectID: number, taskID: any, comment: any) {
    try {
      const res = await axios.post(`${this.url}/${userID}/projects/${projectID}/tasks/${taskID}/comments`, comment)
      console.log(res.data);
      return res.data;
    } catch (e: any) {
      throw new Error(e);
    }
  }

  public async getComment(userID: string, projectID: number, taskID: number, commentID: number) {
    try {
      const res = await axios.get(`${this.url}/${userID}/projects/${projectID}/tasks/${taskID}/comments/${commentID}`);
      console.log(res.data);
      return res.data;
    } catch (e: any) {
      throw new Error(e);
    }
  }

  public async updateComment(userID: string, projectID: number, taskID: number, commentID: number, comment: IComment) {
    try {
      const res = await axios.put(`${this.url}/${userID}/projects/${projectID}/tasks/${taskID}/comments/${commentID}`, {
        commentText: comment.commentText,
        commentID: comment.commentID,
        taskID: comment.taskID,
        commentCreatedBy: JSON.stringify(comment.commentCreatedBy),
      })
      return res.data;
    } catch (e: any) {
      throw new Error(e);
    }
  }

  public async deleteComment(userID: string, projectID: number, taskID: number, commentID: number) {
    try {
      const res = await axios.delete(`${this.url}/${userID}/projects/${projectID}/tasks/${taskID}/comments/${commentID}`);
      console.log(res.data);
      return res.data;
    } catch (e: any) {
      throw new Error(e);
    }
  }


  //* USERS *//

  public async setUser(user: IUser) {
    try {
      const res = await axios.post(`${this.url}/users`, user)
      console.log(res.data);
      return res.data
    } catch (e: any) {
      throw new Error(e);
    }
  }

  public async updateUser(user: IUser, userID: string) {
    try {
      const res = await axios.put(`${this.url}/users/${userID}`, user);
      console.log(res.data);
      return res.data
    } catch (e: any) {
      throw new Error(e)
    }
  }

  public async subscribeUserToTask(subscribedTasks: ITask[], userID: string) {
    try {
      const res = await axios.put(`${this.url}/users/${userID}/subscribeToTask`, {subscribedTasks: subscribedTasks});
      console.log(subscribedTasks);
      console.log(res.data);
      return res.data;
    } catch(e: any) {
      throw new Error(e);
    }
  }

  public async deleteUser(userID: string) {
    try {
      const res = await axios.delete(`${this.url}/users/${userID}`);
      console.log(res.data);
      return res.data;
    } catch (e: any) {
      throw new Error(e);
    }
  }

  public async setEmployeeAccount(employee: any) {
    try {
      const res = await axios.post(`${this.url}/users/createUser`, employee);
      console.log(res.data);
      return res.data;

    } catch (e: any) {
      throw new Error(e);
    }
  }

  public async finishEmployeeAccount(employee: IUser) {
    try {
      const res = await axios.put(`${this.url}/users/auth/finishCreating`, employee);
      console.log(res.data);
      return res.data;
    } catch (e: any) {
      throw new Error(e);
    }
  }

  public async getUsers() {
    try {
      const res = await axios.get(`${this.url}/users`);
      console.log(res.data);
      return res.data;

    } catch (e: any) {
      throw new Error(e);
    }
  }

  public async getUser(userID: string) {
    try {
      const res = await axios.get(`${this.url}/users/${userID}`);
      console.log(res.data);
      return res.data;

    } catch (e: any) {
      throw new Error(e);
    }
  }

  public async sendInviteEmail(email: {
    email: string
  }) {
    try {
      const res = await axios.post(`${this.url}/users/sendEmail`, email);
      return res.data;
    } catch (e: any) {
      throw new Error(e);
    }
  }


  //* PROJECTS *//

  public async addProject(project: any) {
    try {
      const res = await axios.post(`${this.url}/projects`, project);
      return res.data;
    } catch (e: any) {
      throw new Error(e);
    }
  }

  public async getProjects() {
    try {
      const res = await axios.get(`${this.url}/projects`);
      return res.data;
    } catch (e: any) {
      throw new Error(e);
    }
  }

  public async getProjectByID(projectID: number) {
    try {
      const res = await axios.get(`${this.url}/projects/${projectID}`);
      return res.data;
    } catch (e: any) {
      throw new Error(e);
    }
  }

  public async updateProject(projectID: number, project: any) {
    try {
      const res = await axios.put(`${this.url}/projects/${projectID}`, project);
      return res.data;
    } catch (e: any) {
      throw new Error(e);;
    }
  }

  public async deleteProject(projectID: number) {
    try {
      const res = await axios.delete(`${this.url}/projects/${projectID}`);
      return res.data;
    } catch (e: any) {
      throw new Error(e);
    }
  }

  //* POSITIONS *//

  public async createPosition(position: IPosition) {
    try {
      const res = await axios.post(`${this.url}/positions`, position);
      console.log(position, res.data);
      return res.data;
    } catch (e: any) {
      throw new Error(e);
    }
  }


  public async getPositions() {
    try {
      const res = await axios.get(`${this.url}/positions`);
      console.log(res.data);
      return res.data;
    } catch (e: any) {
      throw new Error(e);
    }
  }


  public async getPositionByID(positionID: number) {
    try {
      const res = await axios.get(`${this.url}/positions/${positionID}`);
      console.log(res.data);
      return res.data;
    } catch (e: any) {
      throw new Error(e)
    }
  }

  
  public async updatePosition(positionID: number, position: IPosition) {
    try {
      const res = await axios.put(`${this.url}/positions/${positionID}`, position);
      return res.data;
    } catch (e: any) {
      throw new Error(e);
    }
  }

  public async deletePosition(positionID: number) {
    try {
      const res = await axios.delete(`${this.url}/positions/${positionID}`);
      return res.data;
    } catch (e: any) {
      throw new Error(e);
    }
  }

  //* DEPARTMENTS *//

  public async createDepartment(department: IDepartment) {
    try {
      const res = await axios.post(`${this.url}/departments`, department)
      console.log(department, res.data);
      return res.data
    } catch (e: any) {
      throw new Error(e);
    }
  }

  public async getDepartments() {
    try {
      const res = await axios.get(`${this.url}/departments`);
      console.log(res.data);
      return res.data;
    } catch (e: any) {
      throw new Error(e)
    }
  }

  public async getDepartmentByID(departmentID: number) {
    try {
      const res = await axios.get(`${this.url}/departments/${departmentID}`);
      console.log(res.data);
      return res.data;
    } catch (e: any) {
      throw new Error(e)
    }
  }

  public async updateDepartment(departmentID: number, department: IDepartment) {
    try {
      const res = await axios.put(`${this.url}/departments/${departmentID}`, department);
      return res.data;
    } catch (e: any) {
      throw new Error(e);
    }
  }

  public async deleteDepartment( departmentID: number) {
    try {
      const res = await axios.delete(`${this.url}/departments/${departmentID}`);
      return res.data;
    } catch (e: any) {
      throw new Error(e);
    }
  }


  //* LABELS *//

  public async addLabel(label: ILabel) {
    try {
      const res = await axios.post(`${this.url}/labels`, label);
      console.log(res.data, label);
      return res.data;
    } catch (e: any) {
      throw new Error(e);
    }
  }

  public async getLabels() {
    try {
      const res = await axios.get(`${this.url}/labels`);
      console.log(res.data);
      return res.data;
    } catch (e: any) {
      throw new Error(e);
    }
  }

  public async getLabelByID(labelID: number) {
    try {
      const res = await axios.get(`${this.url}/labels/${labelID}`);
      console.log(res.data);
      return res.data;
    } catch (e: any) {
      throw new Error(e);;
    }
  }

  //* CALENDAR EVENTS *// 

  public async createCalendarEvent(calendarEvent: ICalendarEvent) {
    try {
      const res = await axios.post(`${this.url}/calendar/events`, calendarEvent);
      console.log(res.data);
      return res.data;
    } catch (e: any) {
      throw new Error(e);
    }
  }

  public async getCalendarEvent(calendarEventID: number) {
    try {
      const res = await axios.get(`${this.url}/calendar/events/${calendarEventID}`);
      console.log(res.data);
      return res.data;
    } catch (e: any) {
      throw new Error(e);
    }
  }

  public async getAllCalendarEvents() {
    try {
      const res = await axios.get(`${this.url}/calendar/events`);
      console.log(res.data);
      return res.data;
    } catch (e: any) {
      throw new Error(e);
    }
  }

  public async updateCalendarEvent(calendarEvent: ICalendarEvent, eventID: number) {
    try {
      const res = await axios.put(`${this.url}/calendar/events/${eventID}`, calendarEvent);
      console.log(res.data);
      return res.data;
    } catch (e: any) {
      throw new Error(e);
    }
  }

  public async deleteCalendarEvent(eventID: number) {
    try {
      const res = await axios.delete(`${this.url}/calendar/events/${eventID}`);
      console.log(res.data);
      return res.data;
    } catch (e: any) {
      throw new Error(e);
    }
  }

  //* CUSTOMERS *//
  public async createCustomer(customer: ICustomer) {
    try {
      const res = await axios.post(`${this.url}/customers`, customer);
      console.log(customer, res.data);
      return res.data;
    } catch (e: any) {
      throw new Error(e);
    }
  }

  public async getCustomers() {
    try {
      const res = await axios.get(`${this.url}/customers`);
      console.log(res.data);
      return res.data;
    } catch (e: any) {
      throw new Error(e);
    }
  }

  public async getCustomerByID(customerID: number) {
    try {
      const res = await axios.get(`${this.url}/customers/${customerID}`);
      console.log(res.data);
      return res.data;
    } catch (e: any) {
      throw new Error(e);
    }
  }

  public async updateCustomer(customerID: number, customer: ICustomer) {
    try {
      const res = await axios.put(`${this.url}/customers/${customerID}`, customer);
      console.log(res.data);
      return res.data;
    } catch (e: any) {
      throw new Error(e);
    }
  }

  public async deleteCustomer(customerID: number) {
    try {
      const res = await axios.delete(`${this.url}/customers/${customerID}`);
      console.log(res.data);
      return res.data;
    } catch (e: any) {
      throw new Error(e);
    }
  }

  // NOTIFICATIONS

  public async createNotification(notification: INotification) {
    try {
      const res = await axios.post(`${this.url}/notifications`, notification);
      console.log(res.data);
      return res.data;

    } catch(e: any) {
      throw new Error(e);
    }
  }

  public async getNotifications() {
    try {
      const res = await axios.get(`${this.url}/notifications`);
      console.log(res.data);
      return res.data;
    } catch(e: any) {
      throw new Error(e);
    }
  }

  public async getNotificationByID(notificationID: number) {
    try {
      const res = await axios.get(`${this.url}/notifications/${notificationID}`);
      console.log(res.data);
      return res.data;
    } catch(e: any) {
      throw new Error(e);
    }
  }
  public async deleteNotification(notificationID: number) {
    try {
      const res = await axios.get(`${this.url}/notifications/${notificationID}`);
      console.log(res.data);
      return res.data;
    } catch(e: any) {
      throw new Error(e);
    }
  }
}
