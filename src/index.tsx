import * as React from 'react'
import { useState, useEffect } from 'react'
import styles from './styles.module.css'
import { Sdk, Env, EnvNames, MetaMaskWalletProvider } from 'etherspot'

const message1 = '👻 Metamask is not detected'
const message2 = '📡 Fail on create Etherspot Sdk Account'
const message3 =
  '✂️ User cancel the connection with the Metamask or Not in Testnets'

interface Props {
  text: string
}

Env.defaultName = 'testnets' as EnvNames

declare let window: any
export const ExampleComponent = ({ text }: Props) => {
  const [, setVal] = useState(0)

  useEffect(() => {
    handleConnetion()
  })

  const handleConnetion = async () => {
    if (!MetaMaskWalletProvider.detect()) {
      setAddress(message1)
      return
    }
    await connectionToMetamask()
  }
  const connectionToMetamask = async () => {
    try {
      const walletProvider = await MetaMaskWalletProvider.connect()
      console.log(walletProvider)
      createSdk(walletProvider)
    } catch (e) {
      setAddress(message3)
    }
  }

  const createSdk = (walletProvider: any) => {
    try {
      const sdk = new Sdk(walletProvider)
      const { state } = sdk
      console.info('SDK created', state)
      console.log('Smart wallet', state.account.address)
      setAddress(state.account.address)
      setNetwork(state.network.name)
      setConnected(true)
    } catch (e) {
      setAddress(message2)
    }
  }

  const [address, setAddress] = useState('')
  const [network, setNetwork] = useState('')
  const [, setConnected] = useState(false)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setVal((v: number) => v + 1)
    }, 1000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className={styles.test}>
      👑 {text} {' '} {address} 🚀 {network}
    </div>
  )
}
