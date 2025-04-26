'use client';;
import { TaskType, TaskTypeDto } from "@/app/types/task.type";
import TaskItem from "./task-item.component";
import { FormEvent, useEffect, useState } from "react";
import { clientTaskDataService } from "@/app/services/client/tasks-data-client.service";
import { Logger } from "@/app/services/logger.service";
import TaskForm from "./task-form.component";
import { DateTime } from "luxon";
import EventEmitter from "@/app/lib/event-emitter";
import { EventKeysEnum, TaskEditEventsEnum } from "@/app/enums/events.enum";
import { TaskAlt } from "@mui/icons-material";
import { UserTypeClient } from "@/app/types/user.type";
import { ObjectId } from "mongodb";
import { getActiveSession } from "@/app/utils/indexed-db.utils";
import { userEventEmitter } from "@/app/utils/localstorage.utils";

export default function Tasks({setIsLoading}: Readonly<{setIsLoading?: (isLoading: boolean) => void}>) {

    const [tasks, setTasks] = useState<TaskType[]>([]);
    const [isEditingTask, setIsEditingTask] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<TaskType | undefined>();
    const [completedTasksCount, setCompletedTasksCount] = useState(0);
    const [taskItemEditEventEmitter] = useState(new EventEmitter());
    
    const [user, setUser] = useState<UserTypeClient>();


    useEffect(() => {
        getActiveSession().then(activeSession => {
            setUser(activeSession);
        });

        const onUserUpdate = (user: UserTypeClient) => {
            if(user) {
                setUser(user);
            }
        }

        userEventEmitter.on(EventKeysEnum.USER_UPDATE, onUserUpdate);

        return () => {
            userEventEmitter.off(EventKeysEnum.USER_UPDATE, onUserUpdate);
        }
    }, []);

    useEffect(() => {
        if(user) {
            setIsLoading && setIsLoading(true);
            user && updateTaskList()
            .finally(() => setIsLoading && setIsLoading(false))
            .catch(Logger.error);
        }
    }, [user]);

    const countCompletedTasks = (tasks: TaskType[] | TaskTypeDto[]): number => tasks.reduce((acc: number, task: TaskType | TaskTypeDto) => task.completed ? acc + 1 : acc, 0);

    const updateTaskList = async () => {
        const tasks = await clientTaskDataService.fetchAllTasks(user?._id as ObjectId);
        const completedTasksCount = countCompletedTasks(tasks);
        Logger.debug(`Fetched ${tasks.length} tasks with ${completedTasksCount} completed`);
        setCompletedTasksCount(completedTasksCount);
        setTasks(tasks);
        return tasks;
    }

    const onTaskFormSubmit = (event: FormEvent) => {
        event.preventDefault();


        const title = (event.target as any)[0].value;
        let deadline: DateTime | undefined = DateTime.fromJSDate(new Date((event.target as any)[1].value));

        if(deadline && !deadline.isValid) deadline = undefined;

        const completed = false;
        const newTask: TaskType = {title, deadline, completed, userId: user?._id as ObjectId};

        if(isEditingTask && taskToEdit) {
            // Ideally, when a task is updated, the loader should only cover said task
            // Since the edit action is performed in the task form component and that the actual call to the server is done here
            // We use an event emitter to send the information to the task item component

            // Emit the event to start the loader
            taskItemEditEventEmitter.emit(EventKeysEnum.TASK_ITEM_EDIT, TaskEditEventsEnum.TASK_ITEM_EDIT_START, taskToEdit._id); 

            // Update the task with the new values
            newTask._id = taskToEdit?._id;
            newTask.completed = taskToEdit.completed;
            Logger.debug(`TaskList: event.task.deadline.isValid ${deadline?.isValid} & value ${deadline}`);
            Logger.debug(`TaskList: Updating task ${taskToEdit.title} with new values ${newTask.title} and ${newTask.deadline}`);

            // Exit edit mode
            setTaskToEdit(undefined);
            setIsEditingTask(false);
            // PUT to the big guy
            updateTask(newTask)
                .finally(() => taskItemEditEventEmitter.emit(EventKeysEnum.TASK_ITEM_EDIT, TaskEditEventsEnum.TASK_ITEM_EDIT_END, taskToEdit._id));
        } else {
            setIsLoading && setIsLoading(true);
            saveTask(newTask)
            .finally(() => setIsLoading &&  setIsLoading(false));
        }
       
        (event.target as any)[0].value = "";
        (event.target as any)[1].value = "";
    }

    const saveTask = async (task: TaskType) => {
        // Save a new task

        // POST to the big guy
        const res = await clientTaskDataService.saveTask({...task, userId: user?._id as ObjectId});
        // Update the tasks state
        if (res.acknowledged && res.insertedId) {
            // Fetch the new task
            const newTask = await clientTaskDataService.fetchTaskById(res.insertedId);
            // Clone the tasks array
            const newTaskList = [...tasks];
            // Push the new task
            newTaskList.push(newTask);
            // Sort the new tasks and update the state
            setTasks(clientTaskDataService.sortTaskByMostUrgent(newTaskList));
        }
    }

    const updateTask = async (task: TaskType, completed?: boolean) => {
        // Update a task by Id

        // Build the post payload
        task = {...task, _id: task._id, completed: completed ?? task.completed, userId: user?._id as ObjectId};
        // Map the payload to a DTO
        const taskDto = task;
        // PUT to the big guy
        const res = await clientTaskDataService.updateTask(taskDto);
        // Update the tasks state
        if (res?.acknowledged && task._id) {
            // Find and update the updated task
            const newTaskList = tasks.map(oldTask => oldTask._id === task._id ? task : oldTask);
            setTasks(clientTaskDataService.sortTaskByMostUrgent(newTaskList));
        }
    }

    const deleteTask = async (task: TaskType) => {
        // Delete a task by id

        // Check if the task to delete is being edited
        if(isEditingTask && taskToEdit?._id === task._id) {
            // If so, exit edit mode
            setIsEditingTask(false);
            setTaskToEdit(undefined);
        }

        // DELETE to the big guy
        const res = await clientTaskDataService.deleteTaskById(task._id as ObjectId)
        // Update the task state
        if(res.acknowledged) {
            // Clone the tasks array and remove the deleted task
            const newTaskList = [...tasks.filter(oldTask => oldTask._id !== task._id)];
            // Update the tasks state
            setTasks(newTaskList);
        }
    }

    const onTaskEditIconClicked = (task: TaskType) => {
        // When the user clicks on the edit icon of a task, the creation form becomes an edit form
        // We use the state isEditingTask to know in witch mode we are and the taskToEdit state to have the previous values
        if(isEditingTask && task._id === taskToEdit?._id) {
            // The user was in edit mode and canceled the edit, we switch to new mode and reset the taskToEdit state to undefined
            setIsEditingTask(false);
            setTaskToEdit(undefined);
        } else if (isEditingTask && task._id !== taskToEdit?._id) {
            // The user was in edit mode and clicked on another task, send a message to the previous item that he must update his icon 
            // and set the taskToEdit state to the clicked task
            taskItemEditEventEmitter.emit(EventKeysEnum.TASK_ITEM_EDIT, TaskEditEventsEnum.TASK_ITEM_EDIT_TASK_REPLACED, taskToEdit?._id);
            setTaskToEdit(task);
        } else {
            // THe user was in new mode, we switch to edit mode and set the taskToEdit state to the clicked task
            setIsEditingTask(true);
            setTaskToEdit(task);
        }
    }

    return (
        <div className="card-content">
            <div className="card-main-panel task-list">
                <div className="card-header">
                    <h2>Tasks</h2>
                    <TaskAlt/>
                </div>
                <TaskForm userId={user?._id as ObjectId} onSubmit={onTaskFormSubmit} mode={isEditingTask ? 'edit' : 'new'} taskToEdit={taskToEdit}></TaskForm>
                <div className="task-items-wrapper">
                    {tasks.map((task: TaskType, _: number) => {
                        return <TaskItem taskItemEditEventEmitter={taskItemEditEventEmitter} deleteTask={deleteTask} updateTask={updateTask} task={task} key={`task-item-${task._id?.toString()}`} onTaskEditIconClicked={onTaskEditIconClicked}></TaskItem>
                    })}
                </div>
                {
                    tasks.length > 0 
                    ? <p className="completed-tasks-count subtitle">{`${completedTasksCount} of ${tasks.length} tasks complete ${tasks.length === completedTasksCount ? ', good job !' : ''}`}</p>
                    : <b>You&apos;re all clear for now !</b>
                }
            </div>
        </div>
    );
}