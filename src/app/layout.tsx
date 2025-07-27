import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <title>Starfield Outpost Planner</title>
      </head>
      <body>
        <SpeedInsights />
        <Analytics />
        {children}
      </body>
    </html>
  )
}
