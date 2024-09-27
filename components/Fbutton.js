import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import React from 'react'

export default function Fbutton() {
  return (
    <button className="bg-black text-white border-2 border-black rounded-lg px-4 py-2">
        <FontAwesomeIcon icon={faEnvelope} style={{ fontSize: '20px', width: '33px' }} className='mr-6' />Contact Me
    </button>
  )
}

