import { NewTaskFormProps } from "@/app/types/task.type";
import { useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

import './tasks.css'

export default function NewTaskForm({onNewTaskSubmit}: NewTaskFormProps) {

    const [taskFormDeployed, setTaskFormDeployed] = useState(false);

    const DeployFormButton = () => (
        <span onClick={() => setTaskFormDeployed(!taskFormDeployed)} className="actions-wrapper tasks-form-deploy-actions">{
            taskFormDeployed 
            ? <CloseIcon/>
            : <AddIcon/>
        }</span>
    )

    return <>
        <DeployFormButton></DeployFormButton>
        {taskFormDeployed && <form className="new-task-form" onSubmit={onNewTaskSubmit}>
            <span>
                <input type="text" placeholder="New task"></input>
                <input type="date" ></input>
            </span>
            <button type="submit">Save</button>
        </form>}
    </>
}