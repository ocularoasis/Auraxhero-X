import './globals.css'

export const metadata = {
  title: 'DeleteMeFast | Cybersecurity help when something goes wrong online',
  description: 'DeleteMeFast helps people identify online harm, organize evidence, pursue legitimate reporting and removal paths, and stay protected.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>
}
