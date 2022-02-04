import SignUpPage from '.';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// import axios from 'axios';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { act } from 'react-dom/test-utils';
import en from './../../locale/lang/en.json';
import fa from './../../locale/lang/fa.json';
import LanguageSelector from '../../locale/LanguageSelector';
import i18n, { langsKey } from '../../locale/i18n';

describe('Sign Up Page', () => {
  let reqBody, counter, acceptLanguageHeader;

  const server = setupServer(
    rest.post(`/api/1.0/users`, (req, res, ctx) => {
      reqBody = req.body;
      counter += 1;

      acceptLanguageHeader = req.headers.get('Accept-Language');

      return res(ctx.status(200));
    })
  );

  describe('Layout', () => {
    it('has header', () => {
      render(<SignUpPage />);

      const header = screen.queryByRole('heading', { name: 'Sign Up' });

      expect(header).toBeInTheDocument();
    });

    it('has username input', () => {
      render(<SignUpPage />);

      const input = screen.queryByLabelText('username:');

      expect(input).toBeInTheDocument();
    });

    it('has email input', () => {
      render(<SignUpPage />);

      const input = screen.queryByLabelText('email:');

      expect(input).toBeInTheDocument();
    });

    it('has password input', () => {
      render(<SignUpPage />);

      const input = screen.queryByLabelText('password:');

      expect(input).toBeInTheDocument();
    });

    it('has password type for password input', () => {
      render(<SignUpPage />);

      const input = screen.queryByLabelText('password:');

      expect(input.type).toBe('password');
    });

    it('has password repeat input', () => {
      render(<SignUpPage />);

      const input = screen.queryByLabelText('password repeat:');

      expect(input).toBeInTheDocument();
    });

    it('has password type for password repeat input', () => {
      render(<SignUpPage />);

      const input = screen.queryByLabelText('password repeat:');

      expect(input.type).toBe('password');
    });

    it('has sign up button', () => {
      render(<SignUpPage />);

      const button = screen.queryByRole('button', { name: 'Sign Up' });

      expect(button).toBeInTheDocument();
    });

    it('disables the button initially', () => {
      render(<SignUpPage />);

      const button = screen.queryByRole('button', { name: 'Sign Up' });

      expect(button).toBeDisabled();
    });
  });

  describe('Interactions', () => {
    let button, usernameInput, emailInput, passwordInput, passwordRepeatInput;

    const setup = () => {
      render(<SignUpPage />);

      usernameInput = screen.getByLabelText('username:');
      emailInput = screen.getByLabelText('email:');
      passwordInput = screen.getByLabelText('password:');
      passwordRepeatInput = screen.getByLabelText('password repeat:');

      userEvent.type(usernameInput, 'devAmirHemmati');
      userEvent.type(emailInput, 'dev.amirhemmati1382@gmail.com');
      userEvent.type(passwordInput, 'myPass');
      userEvent.type(passwordRepeatInput, 'myPass');

      button = screen.queryAllByRole('button', { name: 'Sign Up' })[0];
    };

    beforeAll(() => server.listen());

    beforeEach(() => {
      counter = 0;
      reqBody = undefined;

      server.resetHandlers();

      setup();
    });

    afterAll(() => {
      server.close();
    });

    it('enables the button when password and password repeat fields have same value', () => {
      expect(button).toBeEnabled();
    });

    it('send username, email and password to backend after clicking the button', async () => {
      await act(async () => {
        await userEvent.click(button);
      });

      await waitFor(async () => {
        await expect(reqBody).toEqual({
          username: 'devAmirHemmati',
          email: 'dev.amirhemmati1382@gmail.com',
          password: 'myPass',
        });
      });
    });

    it('disables button when there is an going api call', async () => {
      await act(async () => {
        await userEvent.click(button);
      });

      await waitFor(async () => {
        await expect(counter).toBe(1);
      });
    });

    // it('disables spinner while the api request in progress', async () => {
    //   const spinner = () => screen.queryByRole('status', { hidden: true });

    //   expect(spinner()).not.toBeInTheDocument();

    //   await act(async () => {
    //     await userEvent.click(button);
    //   });

    //   await waitFor(async () => {
    //     await expect(spinner()).toBeInTheDocument();
    //   });
    // });

    it('does not display spinner when finish api request', async () => {
      await act(async () => {
        await userEvent.click(button);
      });

      let spinner;
      await waitFor(async () => {
        spinner = await screen.findByRole('status', { hidden: true });
      });

      expect(spinner).not.toBeInTheDocument();
    });

    it('displays account activation notification after successful sign up request', async () => {
      const message = 'Please check your e-mail to activate your account';

      expect(screen.queryByText(message)).not.toBeInTheDocument();

      await act(async () => {
        await userEvent.click(button);
      });

      let text;

      await waitFor(async () => {
        text = await screen.findByText(message);
      });

      expect(text).toBeInTheDocument();
    });

    it('hides sign up form after successful sign up request', async () => {
      const form = screen.getByTestId('form-sign-up');

      await act(async () => {
        await userEvent.click(button);
      });

      await waitFor(async () => {
        await expect(form).not.toBeInTheDocument();
      });
    });

    const generateValidationMessage = (field, message) => {
      return rest.post('/api/1.0/users', (req, res, ctx) => {
        return res.once(
          ctx.status(400),
          ctx.json({
            validationErrors: {
              [field]: message,
            },
          })
        );
      });
    };

    it('displays mismatch message for password repeat input', () => {
      setup();

      userEvent.type(passwordInput, 'devAmirHemmati');
      userEvent.type(passwordRepeatInput, '12345678');

      // const validationError = screen.queryByText('Password mismatch');

      // expect(validationError).toBeInTheDocument();
    });

    it.each`
      field         | message
      ${'username'} | ${'Username cannot be null'}
      ${'email'}    | ${'Email cannot be null'}
      ${'password'} | ${'Password cannot be null'}
    `('displays $message error for $field', async ({ field, message }) => {
      server.use(generateValidationMessage(field, message));

      await act(async () => {
        await userEvent.click(button);
      });

      await waitFor(async () => {
        const validationError = await screen.findByText(message);

        expect(validationError).toBeInTheDocument();
      });
    });
  });

  describe('Internationalization', () => {
    let farsiToggle, englishToggle, passwordInput, passwordRepeatInput;

    const setup = () => {
      render(
        <>
          <SignUpPage />

          <LanguageSelector />
        </>
      );

      farsiToggle = screen.getByAltText('fa-lang-icon');
      englishToggle = screen.getByAltText('en-lang-icon');
      passwordInput = screen.queryByText(en.password);
      passwordRepeatInput = screen.queryByText(en.passwordRepeat);
    };

    beforeAll(() => server.listen());

    afterEach(() => {
      server.resetHandlers();

      act(() => {
        i18n.changeLanguage(langsKey.en);
      });
    });

    afterAll(() => server.close());

    it('initially displays all text in English', () => {
      setup();

      expect(
        screen.getByRole('heading', { name: en.signUp })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: en.submitButton })
      ).toBeInTheDocument();
      expect(screen.getByLabelText(en.username)).toBeInTheDocument();
      expect(screen.getByLabelText(en.email)).toBeInTheDocument();
      expect(screen.getByLabelText(en.password)).toBeInTheDocument();
      expect(screen.getByLabelText(en.passwordRepeat)).toBeInTheDocument();
    });

    it('displays all text in farsi after changing the language', () => {
      setup();

      userEvent.click(farsiToggle);

      expect(
        screen.getByRole('heading', { name: fa.signUp })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: fa.submitButton })
      ).toBeInTheDocument();
      expect(screen.getByLabelText(fa.username)).toBeInTheDocument();
      expect(screen.getByLabelText(fa.email)).toBeInTheDocument();
      expect(screen.getByLabelText(fa.password)).toBeInTheDocument();
      expect(screen.getByLabelText(fa.passwordRepeat)).toBeInTheDocument();
    });

    it('displays all text in English after changing back from farsi', () => {
      setup();

      screen.getByAltText('fa-lang-icon');
      userEvent.click(farsiToggle);

      userEvent.click(englishToggle);

      expect(
        screen.getByRole('heading', { name: en.signUp })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: en.submitButton })
      ).toBeInTheDocument();
      expect(screen.getByLabelText(en.username)).toBeInTheDocument();
      expect(screen.getByLabelText(en.email)).toBeInTheDocument();
      expect(screen.getByLabelText(en.password)).toBeInTheDocument();
      expect(screen.getByLabelText(en.passwordRepeat)).toBeInTheDocument();
    });

    it('displays password mismatch validation in farsi', () => {
      setup();

      screen.getByAltText('fa-lang-icon');

      userEvent.click(farsiToggle);

      const passwordInput = screen.getByLabelText(fa.password);

      userEvent.type(passwordInput, 'P4ss');

      const validationMessageInFarsi = screen.queryByText(
        fa.passwordMismatchValidation
      );

      expect(validationMessageInFarsi).toBeInTheDocument();
    });

    it('sends accept language header as en for outgoing request', async () => {
      setup();

      userEvent.type(passwordInput, 'DevAmirHemmati1382');
      userEvent.type(passwordRepeatInput, 'DevAmirHemmati1382');

      const button = screen.getByRole('button', { name: en.signUp });

      const form = screen.getByTestId('form-sign-up');

      userEvent.click(button);

      await waitForElementToBeRemoved(form);

      expect(acceptLanguageHeader).toBe(langsKey.en);
    });

    it('sends accept language header as en for outgoing request after selecting that language', async () => {
      setup();

      userEvent.type(passwordInput, 'DevAmirHemmati1382');
      userEvent.type(passwordRepeatInput, 'DevAmirHemmati1382');

      const button = screen.getByRole('button', { name: en.signUp });

      userEvent.click(farsiToggle);

      const form = screen.getByTestId('form-sign-up');

      userEvent.click(button);

      await waitForElementToBeRemoved(form);

      expect(acceptLanguageHeader).toBe(langsKey.fa);
    });
  });
});
