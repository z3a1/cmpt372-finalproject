import { Inter } from "next/font/google";
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { MantineProvider } from '@mantine/core';
import "./globals.css";
import Header from "./Components/header";
import NavBar from "./Components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Socializer",
  description: "An intuitive hangout planner for you and your friends!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MantineProvider>
          <Header/>
          <NavBar/>
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
