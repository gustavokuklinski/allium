import '../styles/globals.css'
//import 'tailwindcss/tailwind.css'

import Layout from '../components/Layout'

function BinkAtelier({ Component, pageProps }) {
  
  return (
    <Layout>
    <div>
      
      <Component {...pageProps} />
    </div>
    </Layout>
  )
}

export default BinkAtelier
