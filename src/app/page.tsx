import PublicLayout from './(public)/layout'
import HomePage from './(public)/page'

export default async function Page() {
  return (
    <PublicLayout>
      <HomePage />
    </PublicLayout>
  )
}
