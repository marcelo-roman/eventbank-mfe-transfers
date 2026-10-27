import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Route, Routes } from 'react-router';
import { PixPage } from './pix/PixPage';
import { configureApi } from './shared/api';
import { detectLocale } from './shared/i18n/locale';
import { LocaleContext } from './shared/i18n/LocaleContext';
import { type RemoteProps, UserContext } from './shared/auth';
import styles from './styles.css?inline';

export default function App({ auth, locale }: RemoteProps) {
  const [queryClient] = useState(() => {
    configureApi(auth.getAccessToken);
    return new QueryClient({ defaultOptions: { queries: { retry: 1 } } });
  });

  return (
    <LocaleContext value={locale ?? detectLocale()}>
      <UserContext value={auth.user}>
        <QueryClientProvider client={queryClient}>
          <style>{styles}</style>
          <Routes>
            <Route index element={<PixPage />} />
          </Routes>
        </QueryClientProvider>
      </UserContext>
    </LocaleContext>
  );
}
