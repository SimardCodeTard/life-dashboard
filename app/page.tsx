'use client';
import { redirect } from "next/navigation"
import { getUserFromLocalStorage } from "./utils/localstorage.utils"
import { useEffect } from "react"

export default function Home() {

  useEffect(() => {
    if(getUserFromLocalStorage()) {
      redirect('/dashboard');
    } else {
      redirect('/login');
    }
  }, [])
}
