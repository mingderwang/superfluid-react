import * as React from 'react'
import { useState, useEffect } from 'react'
import styles from './styles.module.css'
import { Sdk, Env, EnvNames, MetaMaskWalletProvider } from 'etherspot'
import {
  abi,
  ethers,
  SuperXEROX_Contract_Address_Ropsten,
  Web3Provider,
  Contract,
  BigNumber
} from 'superxerox-sdk'

const provider: Web3Provider = new ethers.providers.Web3Provider(
  window.ethereum
)
const superXeroXContract_ro = new Contract(
  SuperXEROX_Contract_Address_Ropsten,
  abi,
  provider
)

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
  const [, setVal] = useState(0)
  const [netflow, setNetflow] = useState('')
  let total: BigNumber = BigNumber.from("0")

  useEffect(() => {
    const timer = window.setInterval(() => {
      setVal((v: number) => v + 1)
      try {
        superXeroXContract_ro.getNetFlow().then((x: BigNumber) => {
          total = total.add(x)
          setNetflow(ethers.utils.formatEther(total))
        })
      } catch (error) {
        console.log('error', error)
      }
    }, 100)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className={styles.test}>
      👑 {text} {address} 🚀 {network}
      {'🐝'} netflow = {netflow}
    </div>
  )
}
