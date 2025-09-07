import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { AppLayout } from './components/layout/AppLayout';
import { CVBuilderContainer } from './components/containers/CVBuilderContainer';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

function App() {
  return (
    <MantineProvider>
      <ModalsProvider>
        <Notifications />
        <AppLayout>
          <CVBuilderContainer />
        </AppLayout>
        <CookieConsentBanner />
      </ModalsProvider>
    </MantineProvider>
  );
}

export default App;