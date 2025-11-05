import type { ReactNode } from 'react'
import { Providers } from '../../providers'
import '../../../../styles.css'

export default function RootLayout({ children }: { children: ReactNode }) {
  return <Providers>{children}</Providers>
}
