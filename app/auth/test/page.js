"use client"
import { db } from '@/app/firebase-config';
import { getFirestore, collection, doc, setDoc } from "@firebase/firestore";
import { useRouter } from 'next/navigation'

import React from 'react'

export default async function test() {
    'use client'
 
     
     
      const router = useRouter()
     
      return (
        <button type="button" onClick={() => router.push('/dashboard')}>
          Dashboard
        </button>
      )
    }
  

 
