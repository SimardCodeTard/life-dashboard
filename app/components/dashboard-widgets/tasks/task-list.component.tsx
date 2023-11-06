import { Task } from "@/app/types/task.type";
import TaskItem from "./task.component";

export default function Tasks() {

    const mockTasks: Task[] = [
        {id: 0, title: 'Ne pas avoir les cramptés', completed: true, deadline: new Date('10/21/2023')},
        {id: 1, title: 'Penser à acheter du lait', completed: false},
        {id: 2, title: 'Manger les riches', completed: false},
        {id: 3, title: 'Finir le dashboard', completed: false}
    ]

    return (
        <div className="p-2 task-list">
            <h2>Tasks</h2>
            {mockTasks.map((task: Task, key: number) => {
                return <TaskItem task={task} key={key}></TaskItem>
            })}
        </div>
    );
}