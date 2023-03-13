import Navbar  from '../components/Navbar'
import Footer  from '../components/Footer'
import Head from 'next/head'

export default function Layout({children}) {
  return (
    <>
        <Head>
        <title>Allium NFT - Grupo Binaria</title>
      </Head>
        <Navbar />
          <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {children}
          </div>
          </main>
        <Footer />
    </>
  )
}