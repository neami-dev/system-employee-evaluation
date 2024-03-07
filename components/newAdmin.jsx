"use client"
import React, { useState } from 'react'

export default function newAdmin() {
    const emailRef = useRef();

  return (

    <>
    <div>newAdmin</div>
    <input type='text' ref={emailRef}/>
    </>
  )
}
