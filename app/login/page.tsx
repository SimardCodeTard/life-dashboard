'use client'

import PWDForm from "../components/pwd-form/pwd-form.component";
import Card from "../components/shared/card.component";

export default function LoginPage() {
    return <div className="flex flex-col pt-24 items-center h-screen">
        <Card>
            <div className="p-4 space-y-4 flex flex-col w-full items-center">
                <h1>Welcome to Life Dashboard</h1>
                <p>Please enter your password to continue</p>
                <PWDForm/>    
            </div>
        </Card>
    </div>
}