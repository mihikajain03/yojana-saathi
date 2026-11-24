import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Home } from '@/views/Home';
import { FindSchemes } from '@/views/FindSchemes';
import { BrowseSchemes } from '@/views/BrowseSchemes';
import { SchemeDetail } from '@/views/SchemeDetail';
import { About } from '@/views/About';
import { ChatbotWidget } from '@/components/ChatbotWidget';
import type { ViewName } from '@/types';

export default function App() {
  const [view, setView] = useState<ViewName>('home');
  const [selectedSchemeId, setSelectedSchemeId] = useState<string | null>(null);

  const navigate = (next: ViewName) => {
    setView(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openScheme = (id: string) => {
    setSelectedSchemeId(id);
    navigate('scheme');
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="brand-bar h-1.5 w-full" />
      <Navbar current={view} onNavigate={navigate} />
      <main className="flex-1">
        {view === 'home' && <Home onNavigate={navigate} onOpenScheme={openScheme} />}
        {view === 'find' && <FindSchemes onOpenScheme={openScheme} onNavigate={navigate} />}
        {view === 'browse' && <BrowseSchemes onOpenScheme={openScheme} />}
        {view === 'scheme' && (
          <SchemeDetail schemeId={selectedSchemeId} onNavigate={navigate} onOpenScheme={openScheme} />
        )}
        {view === 'about' && <About onNavigate={navigate} />}
      </main>
      <Footer onNavigate={navigate} />
      <ChatbotWidget />
    </div>
  );
}
