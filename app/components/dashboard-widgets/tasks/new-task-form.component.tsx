import { NewTaskFormProps } from "@/app/types/task.type";
import { useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

export default function NewTaskForm({onNewTaskSubmit}: NewTaskFormProps) {

    const [taskFormDeployed, setTaskFormDeployed] = useState(false);

    const DeployFormButton = () => (
        <span className="rounded w-full flex items-center justify-center bg-[rgba(255,255,255,0.2)] cursor-pointer">{
            taskFormDeployed 
            ? <CloseIcon onClick={() => setTaskFormDeployed(false)} />
            : <AddIcon onClick={() => setTaskFormDeployed(true)} />
        }</span>
    )

    const Form = () => (
        <>
            <DeployFormButton></DeployFormButton>
            <form className="mt-2 flex flex-col shadow-xl" onSubmit={onNewTaskSubmit}>
                <span className="space-y-1">
                    <input type="text" className="p-1 rounded bg-[rgba(255,255,255,0.2)]" placeholder="New task"></input>
                    <input type="date" className="p-1 rounded bg-[rgba(255,255,255,0.2)]"></input>
                </span>
                <button type="submit" className="mt-2 p-1 rounded-sm bg-[rgba(0,0,0,0.2)] hover:bg-[rgba(255,255,255,0.2)]">Save</button>
            </form>
        </>
    )

    return taskFormDeployed ? <Form></Form>: <DeployFormButton></DeployFormButton>;
}