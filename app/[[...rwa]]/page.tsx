import { notFound } from 'next/navigation'
import RwaH5 from '@/components/rwa-h5'
import { screenForSegments } from '@/lib/rwa-routes'

type RoutePageProps = {
  params: Promise<{ rwa?: string[] }>
}

export default async function RoutePage({ params }: RoutePageProps) {
  const { rwa } = await params
  const screen = screenForSegments(rwa)

  if (!screen) notFound()

  return <RwaH5 initialScreen={screen} />
}
