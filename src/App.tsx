import { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthGuard } from '@/router/guard';
import { MainLayout } from '@/layouts/MainLayout';
import { routes } from '@/router/routes';

const App = () => {
  return (
    <BrowserRouter>
      <AuthGuard>
        <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>加载中...</div>}>
          <Routes>
            {routes.map((route) => {
              const Element = route.element;
              if (route.path === '/login') {
                return <Route key={route.path} path={route.path} element={<Element />} />;
              }
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <MainLayout>
                      <Element />
                    </MainLayout>
                  }
                />
              );
            })}
          </Routes>
        </Suspense>
      </AuthGuard>
    </BrowserRouter>
  );
};

export default App;