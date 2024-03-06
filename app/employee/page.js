"use client"
import { signOut } from 'firebase/auth';
import React from 'react'
import { auth } from '../firebase-config';

export default function page() {

    const logout = async () => {
        await signOut(auth);
    };
    
    auth.onAuthStateChanged((res)=>{
        console.log(res);
    })

  return (<>
  
  <div>page</div> 
  <button className=' bg-red-700' onClick={logout}>logout</button>
  </>
  )
}
