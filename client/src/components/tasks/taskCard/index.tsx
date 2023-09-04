import React from 'react'
import { AppContext, ITimer } from '../../../context/generalContext';

import { useAppDispatch } from '../../../redux/hooks';
import { moveTask } from '../../../redux/tasks/slice';
import { ITask } from '../../../redux/tasks/types'

import './taskCard.scss'


export const TaskCard: React.FC<ITask> = ({openCard, taskID, taskLabels, taskTitle, status, assignedUsers, deadline}) => {

    const dispatch = useAppDispatch();
    const taskRef = React.useRef<HTMLDivElement>(null);
    const {timer, setTimer } = React.useContext(AppContext)
    const [intervalID, setIntervalID] = React.useState<number | null>(null);

    const dragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData('text/plain', taskID!.toString());
        e.dataTransfer.effectAllowed = 'move';
      }
  
    const dragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
      }
  
    const dragDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const taskId = parseInt(e.dataTransfer.getData('text/plain'), 10);
        const targetId = taskID;
        dispatch(moveTask({ taskId: taskId, targetId: targetId! }));
  
      }

    const mapLabels = () => {
      return taskLabels.map((label) => {
        return (
            <span>{label.labelName}</span>
        )
      })
        
    }

    const startTimer = () => {
      const timePassed = timer.passedTime || 0; 

      setTimer((prev: ITimer) => ({
        ...prev,
        running: true,
        timerTaskID: taskID,
        startTime: Date.now() - timePassed,
      }));
    };
  
    const stopTimer = () => {
      if (intervalID) {
        clearInterval(intervalID);
        setIntervalID(null);
      }
      setTimer((prev: ITimer) => ({
        ...prev,
        running: false,
      }));
    };
  
    React.useEffect(() => {
      if (timer.running && !intervalID) {
        const id = window.setInterval(() => {
          setTimer((prev: ITimer) => ({
            ...prev,
            passedTime: Date.now() - prev.startTime!,
          }));
        }, 1000);
        setIntervalID(id);
      } else if (!timer.running && intervalID) {
        clearInterval(intervalID);
        setIntervalID(null);
      }
    }, [timer.running, intervalID]);

    return (
        <>
        <div 
        className='task-item'
        draggable
        ref={taskRef}
        onDragStart={dragStart}
        onDragOver={dragOver}
        onDrop={dragDrop}>
          <div className="task-item__main-info">
            <span>{taskTitle}</span>
            <span>{status}</span>
            <span>Deadline: {new Date(deadline!).toLocaleString()}</span>
          </div>
        
        <div className="task-item__users-n-labels">
          <span>{taskLabels.length > 0 ? mapLabels() : "No labels found"}</span>
          <span className="assigned-user">{assignedUsers!?.length > 0 ? assignedUsers![0].userName : "No assigned users"}</span>
        </div>
    
          <button className='button open-task-btn'  onClick={() => openCard!(taskID!)}>Open task details</button>
          {timer.running ? <button className='button' onClick={() => stopTimer()}>Stop timer</button> : <button className='button' onClick={() => startTimer()}>Start timer</button>}
        </div>
        </>
    )
}