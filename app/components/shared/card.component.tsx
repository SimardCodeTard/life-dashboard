'use client'

import React from "react";
import { cloneElement, ReactNode } from "react";
import Loader from "./loader/loader.component";

export default function Card({children, className}: {children: ReactNode, className?: string}){

    const [isLoading, setIsLoading] = React.useState(true);

    const childProps = {
        setIsLoading
    }

    return(
        <div className={["card", className].join(' ')}>
            {isLoading ? <Loader></Loader> : ''}
            <div className={`card-content rounded ${isLoading ? 'hidden' : ''}`}>{React.Children.map(children, child => 
                    React.isValidElement(child) ? cloneElement(child, { ...childProps }) : child
            )}
            {/* {children} */}
            </div>
        </div>
    )
}