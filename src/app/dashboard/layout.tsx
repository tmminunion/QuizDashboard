import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 relative z-0 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[-1]">
         <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] bg-sky-400/20 rounded-full blur-[120px]"></div>
         <div className="fixed bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-cyan-300/20 rounded-full blur-[100px]"></div>
      </div>

      {/* Sidebar - Terpisah & Modular */}
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header - Terpisah & Modular */}
        <Header />

        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>

        {/* Footer - Terpisah & Modular */}
        <Footer />
      </div>
    </div>
  );
}
