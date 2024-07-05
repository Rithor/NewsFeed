import React, { useState } from 'react';
import './Page.css';
import { EmailModal } from '../EmailModal/EmailModal';
import { Header } from '@components/Header/Header';
import { OfflineNotificationWatcher } from '@features/networkStatus/OfflineNotificationWatcher/OfflineNotificationWatcher';
import { Footer } from '@components/Footer/Footer';

const LS_EMAIL_SHOWN_KEY = 'newsfeed:email_modal_shown';

type AppProps = {
  children: React.ReactNode;
};

export const Page: React.FC<AppProps> = ({ children }: AppProps) => {
  const [isEmailModalShow, setIsEmailModalShow] = useState(
    !localStorage.getItem(LS_EMAIL_SHOWN_KEY)
  );
  return (
    <div className="wrapper">
      <EmailModal
        shown={isEmailModalShow}
        onClose={() => {
          localStorage.setItem(LS_EMAIL_SHOWN_KEY, 'true');
          setIsEmailModalShow(false);
        }}
      />

      <Header />

      <main className="main">{children}</main>

      <Footer />
      <OfflineNotificationWatcher />
    </div>
  );
};
