import "./globals.css";
import MainNav from "@/Components/Header/MainNav";
import Footer from "@/Components/Footer/Footer";
import PageTransition from "@/Components/layout/PageTransition";
import PromoBanner from "@/Components/Header/PromoBanner";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import ToastProvider from "@/Components/providers/ToastProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
       <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head>
      <body className={`antialiased`}>
        <CartProvider>
          <AuthProvider>
            {/* Promotional Banner - At the very top */}
            <PromoBanner />

            <div className="flex flex-col min-h-screen pt-10 sm:pt-12">
              <MainNav />

              <PageTransition>
                <main className="pt-15 ">{children}</main>
              </PageTransition>

              <Footer />
            </div>
            <ToastProvider />
          </AuthProvider>
        </CartProvider>
      </body>
    </html>
  );
}
