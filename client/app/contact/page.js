import PageHeader from '@/components/PageHeader'
import ContactForm from '@/components/ContactForm'
import { createPageMetadata } from '@/lib/metadata'

// SSG: the page shell is static, only the form is interactive
export const dynamic = 'force-static'

export const metadata = createPageMetadata({
  title: 'Contact',
  description: 'Send a message to the OpenFinder team.',
  path: '/contact',
})

export default function Page() {
  return (
    <>
      <PageHeader title="Contact" description="Send us a message." />
      <ContactForm />
    </>
  )
}
