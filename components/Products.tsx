import { useRef, useEffect, useState } from 'react'
import { products } from '../lib/products'
import NumberInput from './NumberInput'
import { getRealms } from '@solana/spl-governance'
import { Connection, PublicKey } from '@solana/web3.js'
import { CSVLink } from 'react-csv'

interface Props {
  submitTarget: string
  enabled: boolean
}

export default function Products({ submitTarget, enabled }: Props) {
  const formRef = useRef<HTMLFormElement>(null)

  const connection = new Connection(
    'https://damp-bold-leaf.solana-mainnet.discover.quiknode.pro/2bb8c06fd47579f3fc085cbd5f1e9381c5060de5/'
  )
  const programId = new PublicKey(
    'jdaoDN37BrVRvxuXSeyR7xE5Z9CAoQApexGrQJbnj6V'
  )

  const [csvJawn, setCsvJawn] = useState([{}])

  useEffect(() => {
    console.log('fetching realms...')
    const realms = getRealms(connection, programId)
    realms.then((result) => {
      console.log(result)
      let newList = result.map((item) => {
        return {
          owner: item.owner.toBase58(),
          id: item.pubkey.toBase58(),
          label: item.account.name,
        }
      })
      console.log(newList)
      setCsvJawn(newList)
    })
  }, [])

  return (
    <form method="get" action={submitTarget} ref={formRef}>
      <div className="flex flex-col gap-16">
        <div className="grid grid-cols-2 gap-8">
          {products.map((product) => {
            return (
              <div
                className="rounded-md bg-white p-8 text-left"
                key={product.id}
              >
                <h3 className="text-2xl font-bold">{product.name}</h3>
                <p className="text-sm text-gray-800">{product.description}</p>
                <p className="my-4">
                  <span className="mt-4 text-xl font-bold">
                    {product.priceUsd} USDC
                  </span>
                  {product.unitName && (
                    <span className="text-sm text-gray-800">
                      {' '}
                      /{product.unitName}
                    </span>
                  )}
                </p>
                <div className="mt-1">
                  <NumberInput name={product.id} formRef={formRef} />
                </div>
              </div>
            )
          })}
        </div>

        <button
          className="max-w-fit items-center self-center rounded-md bg-gray-900 px-20 py-2 text-white hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!enabled}
        >
          Checkout
        </button>
        <CSVLink data={csvJawn}>Download me</CSVLink>
      </div>
    </form>
  )
}
