// minsoto-frontend/components/GoogleLoginButton.js
const GoogleLoginButton = ({ text }) => {
  const handleGoogleLogin = () => {
    const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    
    // Make sure this matches your Django callback_url exactly
    const redirectUri = 'http://localhost:3000/auth/google/callback';
    
    const scope = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ].join(' ');

    const params = {
      response_type: 'code',
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      redirect_uri: redirectUri,  // Use the full URL
      prompt: 'select_account',
      access_type: 'offline',
      scope,
    };

    const urlParams = new URLSearchParams(params).toString();
    window.location = `${googleAuthUrl}?${urlParams}`;
  };

  return (
    <button onClick={handleGoogleLogin} className="google-login-btn">
      {/* SVG path for Google icon */}
      {text}
    </button>
  );
};

export default GoogleLoginButton;
