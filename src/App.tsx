import { useState } from 'react';
import './App.css';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { ThemeProvider } from '@/components/ThemeProvider';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="family-hub-theme">
      <div className="flex min-h-screen bg-background text-foreground">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onToggle={toggleSidebar} 
        />
        
        {/* Main content area */}
        <div className="flex flex-col flex-1 w-full">
          <Header 
            userName="Jane Smith"
            userAvatar="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
            onMenuToggle={toggleSidebar}
            showSearch={true}
          />
          
          <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">
            <div className="grid gap-6">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Welcome to Family Hub</h2>
                <p className="text-muted-foreground">
                  This is a demo of the Family Hub dashboard with a responsive sidebar and header.
                </p>
              </div>
              
              {/* Additional content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                  <h3 className="font-medium mb-2">Family Calendar</h3>
                  <p className="text-sm text-muted-foreground">
                    Upcoming events and scheduled activities
                  </p>
                </div>
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                  <h3 className="font-medium mb-2">Shopping List</h3>
                  <p className="text-sm text-muted-foreground">
                    Items needed for the week
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;