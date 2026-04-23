import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
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
