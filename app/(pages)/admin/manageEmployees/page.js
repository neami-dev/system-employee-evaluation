import { getEmployees } from '@/firebase/firebase-admin/getEmployees'
import React from 'react'

export default function manageEmployees() {
    getEmployees()

  return (

    <div>manageEmployees</div>
  )
}
