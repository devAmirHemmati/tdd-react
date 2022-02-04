import { Routes, Route, BrowserRouter, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './locale/LanguageSelector';
import HomePage from './pages/home';
import SignUpPage from './pages/signup';
import LoginPage from './pages/login';
import UserList from './pages/user';
import AccountActivationPage from './pages/account-activation';

const App = () => {
  const [t] = useTranslation();

  return (
    <BrowserRouter>
      <div className="container">
        <div className="navbar navbar-expand navbar-light bg-light small-shadow">
          <div className="container">
            <a href="/" className="navbar-brand">
              Hoaxify
            </a>

            <div className="navbar-nav">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'text-dark' : ''}`
                }
              >
                {t('home')}
              </NavLink>

              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'text-dark' : ''}`
                }
              >
                {t('signUp')}
              </NavLink>
            </div>
          </div>
        </div>

        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/signup" element={<SignUpPage />} />

          <Route path="/login" element={<LoginPage />} />

          <Route path="/user/:id" element={<UserList />} />

          <Route path="/activate/:token" element={<AccountActivationPage />} />
        </Routes>

        <LanguageSelector />
      </div>
    </BrowserRouter>
  );
};

export default App;
