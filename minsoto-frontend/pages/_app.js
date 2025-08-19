// pages/_app.js
import { AuthProvider } from '../context/AuthContext';
import { AppProvider } from '../context/AppContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <AppProvider>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </AppProvider>
  );
}

export default MyApp;
