"use client"
import { Blocks, MessageSquareText, UserPlus, Users } from 'lucide-react'


export default function Menu() {

  return (
    <>
    <div>
        <ul>
            <li><Blocks /></li>
            <li><MessageSquareText /></li>
            <li><History /></li>
            <li><Users /></li>
            <li><UserPlus /> </li>
        </ul>
    </div>
    </>
  )
}
