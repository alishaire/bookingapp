import '@/styles/globals.css'
import Context from '@/Context'
import Layout from '@/components/Layout'

export default function App({ Component, pageProps }) {
  return (
<Context>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Context>

  
  
  
  
  )
}
