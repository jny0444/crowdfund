'use client'

import { useWallet } from '@/hooks/useWallet'
import React from 'react'

const page = () => {
  const { address, connectWallet, disconnect, isConnected } = useWallet();

  return (
    <>
      <div>
        {
          isConnected ?
          <div>
            <p>Connected with {address}</p>
            <button onClick={() => disconnect()}>Disconnect</button>
          </div>
          :
          <div>
            <p>Not connected</p>
          </div>
        }
        <button onClick={() => connectWallet()}>connect wallet</button>
      </div>

    </>
  )
}

export default page