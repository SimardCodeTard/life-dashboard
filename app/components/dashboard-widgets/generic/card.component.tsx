import { ReactNode } from "react";

export default function Card({children}: {children: ReactNode}){
    return(
        <div className="card shadow-lg">
            <div className="card-content rounded shadow-inner m-1">
                {children}
            </div>
        </div>
    )
}