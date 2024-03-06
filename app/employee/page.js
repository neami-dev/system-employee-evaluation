"use client"
import { signOut } from 'firebase/auth';
import React, { use, useState } from 'react'
import { auth } from '../firebase-config';
import Link from 'next/link';

export default function page() {
    const [data,setData] = useState({})

    const logout = async () => {
        await signOut(auth);
    };

    auth.onAuthStateChanged((res)=>{
        setData(res)
    })

  return (<>
  
  <div>page</div> 
  <Link className=' bg-lime-700'  href="auth/loginPage">login</Link>
  <button className=' bg-red-700' onClick={logout}>logout</button>
  <h4>{data?.email}</h4>
  </>
  )
}
