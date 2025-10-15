import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const backendBaseUrl =
    import.meta.env.VITE_BACKEND_BASE_URL ||
    import.meta.env.VITE_BASE_URL ||
    'https://www.osusideas.online';

  const loginBaseUrl =
    import.meta.env.VITE_LOGIN_BASE_URL ||
    (import.meta.env.DEV ? backendBaseUrl : '/api');

  const loginProxyPath =
    import.meta.env.VITE_LOGIN_PROXY_PATH || '/login';

  const loginDirectPath =
    import.meta.env.VITE_LOGIN_DIRECT_PATH || '/ar/auth/api/sessions/login/';

  const isRelativeUrl = (value) => !/^https?:\/\//i.test(value);

  const buildEndpoint = (base, path) => {
    const normalizedBase = base.replace(/\/$/, '');
    return `${normalizedBase}${path}`;
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!username || !password) {
      alert('يرجى إدخال اسم المستخدم وكلمة المرور.');
      return;
    }
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const useProxy = isRelativeUrl(loginBaseUrl);
      const loginPath = useProxy ? loginProxyPath : loginDirectPath;
      const loginUrl = buildEndpoint(loginBaseUrl, loginPath);

      let requestBody;
      const requestConfig = {};

      if (useProxy) {
        requestBody = {
          role: 'hotel',
          username,
          password,
        };
      } else {
        const formData = new FormData();
        formData.append('role', 'hotel');
        formData.append('username', username);
        formData.append('password', password);
        requestBody = formData;
        requestConfig.headers = { 'Content-Type': 'multipart/form-data' };
      }

      const response = await axios.post(loginUrl, requestBody, requestConfig);

      const {
        access_token: accessToken,
        refresh: refreshToken,
        ...profile
      } = response.data ?? {};

      if (!accessToken) {
        throw new Error('لم يتم استلام رمز الدخول من واجهة البرمجة.');
      }

      localStorage.setItem('authToken', accessToken);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userProfile', JSON.stringify(profile));
      localStorage.setItem('apiBaseUrl', backendBaseUrl);
      localStorage.setItem('apiLoginBaseUrl', loginBaseUrl);

      axios.defaults.baseURL = loginBaseUrl;
      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

      navigate('/dashboard');
    } catch (error) {
      console.error('فشل تسجيل الدخول:', error);
      const message =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        'حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.';
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-fluid">
      <div className="auth-fluid-form-box">
        <div className="align-items-center d-flex h-100">
          <div className="card-body">
            <div className="auth-brand text-center text-lg-left">
              <div className="auth-logo">
                <a href="#" className="logo logo-dark text-center" onClick={(e) => e.preventDefault()}>
                  <span className="logo-lg">
                    <img src="/assets/images/logo-dark.png" alt="Nozul" height="120" />
                  </span>
                </a>
              </div>
            </div>

            <h4 className="mt-0">تسجيل الدخول</h4>
            <p className="text-muted mb-4">أدخل بياناتك للوصول إلى لوحة التحكم.</p>

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="username">اسم المستخدم</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="form-control"
                  placeholder="أدخل اسم المستخدم"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  autoComplete="username"
                />
              </div>

              <div className="form-group">
                <a href="#" className="text-muted float-right" onClick={(event) => event.preventDefault()}>
                  <small>نسيت كلمة المرور؟</small>
                </a>
                <label htmlFor="password">كلمة المرور</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                  placeholder="أدخل كلمة المرور"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                />
              </div>

              <div className="form-group mb-3">
                <div className="custom-control custom-checkbox">
                  <input type="checkbox" className="custom-control-input" id="checkbox-signin" />
                  <label className="custom-control-label" htmlFor="checkbox-signin">تذكرني</label>
                </div>
              </div>

              <div className="form-group mb-0 text-center">
                <button className="btn btn-blue btn-block" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                </button>
              </div>
            </form>

            <footer className="footer footer-alt">
              جميع الحقوق محفوظة&nbsp;
              <a href="#" onClick={(event) => event.preventDefault()}>نزلكم</a>
            </footer>
          </div>
        </div>
      </div>

      <div className="auth-fluid-right text-center">
        <div className="auth-user-testimonial" />
      </div>
    </div>
  );
}

export default LoginPage;
