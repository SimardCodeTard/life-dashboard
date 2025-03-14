'use client'
import { Task, TaskDto } from "@/app/types/task.type";
import TaskItem from "./task-item.component";
import { FormEvent, useEffect, useState } from "react";
import { clientTaskDataService } from "@/app/services/client/tasks-data-client.service";
import Loader from "../../shared/loader/loader.component";
import { Logger } from "@/app/services/logger.service";
import TaskForm from "./task-form.component";
import { DateTime } from "luxon";
import EventEmitter from "@/app/lib/event-emitter";
import { EventKeysEnum, LoadEventsEnum } from "@/app/enums/events.enum";

export default function Tasks() {

    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditingTask, setIsEditingTask] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<Task | undefined>();
    const [completedTasksCount, setCompletedTasksCount] = useState(0);
    const [taskItemEditEventEmitter] = useState(new EventEmitter()); // Must be a state, don't ask me why

    const countCompletedTasks = (tasks: Task[] | TaskDto[]): number => tasks.reduce((acc: number, task: Task | TaskDto) => task.completed ? acc + 1 : acc, 0);

    const updateTaskList = async () => {
        const tasks = await clientTaskDataService.fetchAllTasks();
        const completedTasksCount = countCompletedTasks(tasks);
        Logger.debug(`Fetched ${tasks.length} tasks with ${completedTasksCount} completed`);
        setCompletedTasksCount(completedTasksCount);
        setTasks(clientTaskDataService.mapTaskDtoToTaskList(tasks));
        return tasks;
    }

    const onTaskFormSubmit = (event: FormEvent) => {
        event.preventDefault();


        const title = (event.target as any)[0].value;
        let deadline: DateTime | undefined = DateTime.fromJSDate(new Date((event.target as any)[1].value));

        if(deadline && !deadline.isValid) deadline = undefined;

        const completed = false;
        const newTask: Task = {title, deadline, completed};

        if(isEditingTask && taskToEdit) {
            // Ideally, when a task is updated, the loader should only cover said task
            // Since the edit action is performed in the task form component and that the actual call to the server is done here
            // We use an event emitter to send the information to the task item component

            // Emit the event to start the loader
            taskItemEditEventEmitter.emit(EventKeysEnum.TASK_ITEM_EDIT, LoadEventsEnum.TASK_ITEM_EDIT_START, taskToEdit._id); 

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
                .finally(() => taskItemEditEventEmitter.emit(EventKeysEnum.TASK_ITEM_EDIT, LoadEventsEnum.TASK_ITEM_EDIT_END, taskToEdit._id));
        } else {
            setIsLoading(true);
            saveTask(newTask)
            .finally(() => setIsLoading(false));
        }
       
        (event.target as any)[0].value = "";
        (event.target as any)[1].value = "";
    }

    const saveTask = async (task: Task) => {
        // Save a new task
        
        // POST to the big guy
        return clientTaskDataService.saveTask(clientTaskDataService.mapTaskToTaskDto(task))
            // Fetch all the tasks TODO. Optimize to only fetch the updated task by returning the id from the server
            .then((res) => res.data.success ? updateTaskList() : undefined)
            // Map and update the tasks state
            .then((tasks) => tasks && setTasks(clientTaskDataService.mapTaskDtoToTaskList(tasks)))
            // Catch errors like a boss
            .catch(Logger.error)
    }

    const updateTask = async (task: Task, completed?: boolean) => {
        // Update a task by Id

        // Build the post payload
        task = {...task, _id: task._id, completed: completed !== undefined ? completed : task.completed};
        // Map the payload to a DTO
        const taskDto = clientTaskDataService.mapTaskToTaskDto(task);
        // PUT to the big guy
        return clientTaskDataService.updateTask(taskDto)
            // Fetch all the tasks TODO. Optimize to only fetch the updated task, we already have the full updated item
            .then(res => res.data.success ? updateTaskList() : undefined)
            // Map and update the tasks state
            .then((tasks) => tasks && setTasks(clientTaskDataService.mapTaskDtoToTaskList(tasks)))
            // Catch errors like a boss
            .catch(Logger.error);
    }

    const deleteTask = async (task: Task) => {
        // Delete a task by id

        // Check if the task to delete is being edited
        if(isEditingTask && taskToEdit?._id === task._id) {
            // If so, exit edit mode
            setIsEditingTask(false);
            setTaskToEdit(undefined);
        }

        // Validate the ID and DELETE to the big guy
        return task._id && clientTaskDataService.deleteTaskById(task._id)
            // Fetch all the tasks TODO: Do not refetch, just remove the deleted task from the list (if the opration succeded duh)
            .then((res) =>{ return res.data.success ? updateTaskList() : undefined})
            // Map and update the tasks state
            .then((tasks) => tasks && setTasks(clientTaskDataService.mapTaskDtoToTaskList(tasks)))
            // Catch errors like a boss
            .catch(Logger.error);
    }

    const onTaskEditIconClicked = (task: Task) => {
        // When the user clicks on the edit icon of a task, the creation form becomes an edit form
        // We use the state isEditingTask to know in witch mode we are and the taskToEdit state to have the previous values
        if(isEditingTask && task._id === taskToEdit?._id) {
            // The user was in edit mode and canceled the edit, we switch to new mode and reset the taskToEdit state to undefined
            setIsEditingTask(false);
            setTaskToEdit(undefined);
        } else if (isEditingTask && task._id !== taskToEdit?._id) {
            // The user was in edit mode and clicked on another task, send a message to the previous item that he must update his icon 
            // and set the taskToEdit state to the clicked task
            taskItemEditEventEmitter.emit(EventKeysEnum.TASK_ITEM_EDIT, LoadEventsEnum.TASK_ITEM_EDIT_TASK_REPLACED, taskToEdit?._id);
            setTaskToEdit(task);
        } else {
            // THe user was in new mode, we switch to edit mode and set the taskToEdit state to the clicked task
            setIsEditingTask(true);
            setTaskToEdit(task);
        }
    }

    useEffect(() => {
        setIsLoading(true);
        updateTaskList().then(() => setIsLoading(false)).catch(console.error);
    }, [])

    return (
        <div className="task-list">
            <h2>Tasks</h2>
            <TaskForm onSubmit={onTaskFormSubmit} mode={isEditingTask ? 'edit' : 'new'} taskToEdit={taskToEdit}></TaskForm>
            {isLoading && <Loader></Loader>}
            <div className="task-items-wrapper">
                {tasks.map((task: Task, key: number) => {
                    return <TaskItem taskItemEditEventEmitter={taskItemEditEventEmitter} deleteTask={deleteTask} updateTask={updateTask} task={task} key={key} onTaskEditIconClicked={onTaskEditIconClicked}></TaskItem>
                })}
            </div>
            {
                tasks.length > 0 
                ?<p className="completed-tasks-count subtitle">{`${completedTasksCount} of ${tasks.length} tasks complete ${tasks.length === completedTasksCount ? ', good job !' : ''}`}</p>
                : <b>You have no tasks to do for now, add one to get started !</b>
            }
        </div>
    );
}