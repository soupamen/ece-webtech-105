import PageHeader from '@/components/PageHeader'
import ContactForm from '@/components/ContactForm'

// SSG: the page shell is static, only the form is interactive
export const dynamic = 'force-static'

export default function Page() {
  return (
    <>
      <PageHeader title="Contact" description="Suggest a tool or send us a message." />
      <ContactForm />
    </>
  )
}
