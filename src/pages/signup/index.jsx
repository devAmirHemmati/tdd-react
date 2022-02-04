import { useState } from 'react';
import Input from './../../components/input';
import { useTranslation } from 'react-i18next';
import { apiPostUserRegister } from '../../api/user';

const SignUpPage = () => {
  const [fields, setFields] = useState({
    username: '',
    email: '',
    password: '',
    passwordRepeat: '',
    errors: {},
  });
  const [isDisabledButton, setIsDisabledButton] = useState(true);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isSignUpSuccess, setIsSignUpSuccess] = useState(false);
  const { t } = useTranslation();

  const handleSetUsernameValue = (value) => {
    setFields((prevState) => {
      const errors = { ...prevState.errors };
      delete errors.username;

      return {
        ...prevState,
        username: value,
        errors,
      };
    });
  };

  const handleSetEmailValue = (value) => {
    setFields((prevState) => ({
      ...prevState,
      email: value,
    }));
  };

  const handleSetPasswordValue = (value) => {
    setFields((prevState) => ({
      ...prevState,
      password: value,
    }));

    setIsDisabledButton(value !== fields.passwordRepeat);
  };

  const handleSetPasswordRepeatValue = (value) => {
    setFields((prevState) => ({
      ...prevState,
      passwordRepeat: value,
    }));

    setIsDisabledButton(value !== fields.password);
  };

  const handleSubmitForm = async (event) => {
    event.preventDefault();

    const body = {
      username: fields.username.trim(),
      email: fields.email.trim(),
      password: fields.password.trim(),
    };

    setIsButtonLoading(true);

    try {
      await apiPostUserRegister(body);

      setIsSignUpSuccess(true);
    } catch (error) {
      if (error.response.status === 400) {
        setFields((prevState) => ({
          ...prevState,
          errors: error.response.data.validationErrors,
        }));
      }
    } finally {
      setIsButtonLoading(false);
    }
  };

  return (
    <div
      className="col-lg-6 offset-lg-3 col-md-8 offset-md-2"
      data-testid="signup-page"
    >
      {!isSignUpSuccess && (
        <form
          onSubmit={handleSubmitForm}
          className="card mt-5"
          data-testid="form-sign-up"
        >
          <div className="card-header">
            <h1 className="text-center h1">{t('signUp')}</h1>
          </div>

          <div className="card-body">
            <Input
              id="username"
              label={t('username')}
              placeholder="username"
              value={fields.username}
              onChange={(event) => {
                handleSetUsernameValue(event.target.value);
              }}
              help={fields.errors.username}
            />

            <Input
              type="email"
              id="email"
              label={t('email')}
              placeholder="Email"
              value={fields.email}
              onChange={(event) => {
                handleSetEmailValue(event.target.value);
              }}
              help={fields.errors.email}
            />

            <Input
              type="password"
              id="password"
              label={t('password')}
              placeholder="Password"
              value={fields.password}
              onChange={(event) => {
                handleSetPasswordValue(event.target.value);
              }}
              help={fields.errors.password}
            />

            <Input
              type="password"
              id="password-repeat"
              label={t('passwordRepeat')}
              placeholder="Password repeat"
              value={fields.passwordRepeat}
              onChange={(event) => {
                handleSetPasswordRepeatValue(event.target.value);
              }}
              help={
                fields.password !== fields.passwordRepeat &&
                t('passwordMismatchValidation')
              }
            />

            <div className="text-center">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isDisabledButton || isButtonLoading}
              >
                {isButtonLoading ? (
                  <span
                    role="status"
                    className="spinner-border spinner-border-sm"
                    aria-hidden="true"
                  />
                ) : (
                  t('submitButton')
                )}
              </button>
            </div>
          </div>
        </form>
      )}

      {isSignUpSuccess && (
        <p className="alert alert-success text-center mt-4">
          Please check your e-mail to activate your account
        </p>
      )}
    </div>
  );
};

export default SignUpPage;
