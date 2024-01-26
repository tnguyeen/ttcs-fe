"use client"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/Header/Header"
import Footer from "@/components/Footer/Footer"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"

import { store, persistor } from "../state/store"
import Head from "next/head"

const inter = Inter({ subsets: ["latin"] })

const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <head>
        <title>Aquarius</title>
        <script
          defer
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GG_API_KEY}&libraries=places&callback=YOUR_CALLBACK_NAME`}
        ></script>
      </head>
      <html lang="en">
        <body
          className={inter.className}
          style={{ backgroundColor: "rgb(242, 242, 242)" }}
        >
          <Provider store={store}>
            <PersistGate persistor={persistor} loading={null}>
              <div
                style={{
                  marginTop: 100,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: "100%",
                    maxWidth: "1440px",
                    marginTop: "50px",
                  }}
                >
                  <Header />
                  {children}
                  <Footer />
                </div>
              </div>
            </PersistGate>
          </Provider>
        </body>
      </html></>
  )
}
