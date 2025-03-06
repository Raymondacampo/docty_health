'use client';
import PageLayout from "@/components/PageLayout";
import "@/styles/globals.css";
import { AuthProvider } from "@/context/auth";

export default function App({ Component, pageProps }) {
  return(
    <AuthProvider>
      <PageLayout>
        <Component {...pageProps} />
      </PageLayout>       
    </AuthProvider>

  );
}
