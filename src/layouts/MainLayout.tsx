import { type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { BreadcrumbComponent } from './Breadcrumb';
import { TagsView } from './TagsView';
import { useConfigStore } from '@/store/config';
import { Watermark } from '@/components/Watermark';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { theme, watermarkEnabled, watermarkText } = useConfigStore();

  return (
    <div className={`app-container ${theme}`}>
      {watermarkEnabled && <Watermark text={watermarkText} />}
      <Sidebar />
      <div style={{ marginLeft: 220 }}>
        <Header />
        <main style={{ padding: '88px 24px 24px', minHeight: 'calc(100vh - 64px)' }}>
          <BreadcrumbComponent />
          <TagsView />
          <div style={{ marginTop: 16 }}>{children}</div>
        </main>
      </div>
    </div>
  );
};
