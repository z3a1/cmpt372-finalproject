import { Inter } from "next/font/google";
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { MantineProvider } from '@mantine/core';
import "./globals.css";
import Header from "./Components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MantineProvider>
          <Header/>
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
