import './globals.css'

export const metadata = {
  title: 'Auraxhero X',
  description: 'Machine-age capability, agent, discovery, economic, and network ecosystem.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>
}
