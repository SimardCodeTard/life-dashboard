'use client';
import { redirect } from "next/navigation"
import { useEffect } from "react"
import { getActiveSession } from "./utils/indexed-db.utils";

export default function Home() {

  useEffect(() => {
    (async ()=> {
      if(await getActiveSession()) {
        redirect('/dashboard');
      } else {
        redirect('/login');
      }
    })(); 
  }, [])
}
