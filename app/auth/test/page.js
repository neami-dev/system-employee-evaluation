"use client"
import { db } from '@/app/firebase-config';
import { getFirestore, collection, doc, setDoc } from "@firebase/firestore";
import React from 'react'

export default async function test() {
    
    const cityRef = doc(db, 'cities', 'LA');
    const data = {
      name: 'Los Angeles',
      state: 'CA',
      country: 'USA',
    };
    
    try {
      await setDoc(cityRef, data);
      console.log('Document added successfully!');
    } catch (error) {
      console.error('Error adding document:', error);
    }
    
  return (
   <>
   </>
  )
}
 
