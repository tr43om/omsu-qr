import QueryProvider from "./components/QueryProvider";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ru"
      className="container max-w-4xl mx-auto px-4"
      data-theme="light"
    >
      <body className={`${inter.className} min-h-screen items-center grid`}>
        {children}
      </body>
    </html>
  );
}
