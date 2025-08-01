import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import HeaderLayout from "@/components/ui/HeaderLayout"
import ChannelIO from "@/components/ui/ChannelIO"
import FloatingApplyButton from "@/components/ui/FloatingApplyButton"

export const metadata: Metadata = {
  title: "제4회 GS그룹 해커톤 - Play with GenAI",
  description: "모두의 PLAI, PLAI Everywhere! 바이브 코딩으로 쉽게 어디서나 PLAY!",
  keywords: ["GS그룹", "해커톤", "GenAI", "PLAI", "바이브코딩", "MISO"],
  icons: {
    icon: "/assets/GSLogo.png",
    apple: "/assets/GSLogo.png",
  },
  openGraph: {
    title: "제4회 GS그룹 해커톤 - Play with GenAI",
    description: "모두의 PLAI, PLAI Everywhere! 바이브 코딩으로 쉽게 어디서나 PLAY!",
    type: "website",
  },
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="antialiased">
        <HeaderLayout />
        {children}
        <ChannelIO />
        <FloatingApplyButton />
      </body>
    </html>
  )
}
