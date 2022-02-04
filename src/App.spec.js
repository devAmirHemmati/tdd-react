import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('Routing', () => {
  const setup = (path) => {
    window.history.pushState({}, '', path);

    render(<App />);
  };

  it.each`
    path               | pageTestId
    ${'/'}             | ${'home-page'}
    ${'/signup'}       | ${'signup-page'}
    ${'/login'}        | ${'login-page'}
    ${'/user/1'}       | ${'user-page'}
    ${'/user/2'}       | ${'user-page'}
    ${'/activate/123'} | ${'activation-page'}
    ${'/activate/351'} | ${'activation-page'}
  `('displays $pageTestId when path is $path', ({ path, pageTestId }) => {
    setup(path);

    const page = screen.getByTestId(pageTestId);

    expect(page).toBeInTheDocument();
  });

  it.each`
    path             | pageTestId
    ${'/'}           | ${'signup-page'}
    ${'/'}           | ${'login-page'}
    ${'/'}           | ${'user-page'}
    ${'/'}           | ${'activation-page'}
    ${'/signup'}     | ${'home-page'}
    ${'/signup'}     | ${'login-page'}
    ${'/signup'}     | ${'user-page'}
    ${'/signup'}     | ${'activation-page'}
    ${'/login'}      | ${'home-page'}
    ${'/login'}      | ${'signup-page'}
    ${'/login'}      | ${'user-page'}
    ${'/login'}      | ${'activation-page'}
    ${'/user/1'}     | ${'signup-page'}
    ${'/user/2'}     | ${'login-page'}
    ${'/user/3'}     | ${'home-page'}
    ${'/user/4'}     | ${'activation-page'}
    ${'/user'}       | ${'user-page'}
    ${'/activate/1'} | ${'signup-page'}
    ${'/activate/2'} | ${'login-page'}
    ${'/activate/3'} | ${'home-page'}
    ${'/activate/4'} | ${'user-page'}
    ${'/activate'}   | ${'activation-page'}
  `(
    'does not displays $pageTestId when path is $path',
    ({ path, pageTestId }) => {
      setup(path);

      const page = screen.queryByTestId(pageTestId);

      expect(page).not.toBeInTheDocument();
    }
  );

  it.each`
    targetPage
    ${'Home'}
    ${'Sign Up'}
  `('has link to homepage on Navbar', ({ targetPage }) => {
    setup('/');

    const link = screen.getByRole('link', { name: targetPage });

    expect(link).toBeInTheDocument();
  });

  it('displays sign up page after clicking sign up link', () => {
    setup('/');

    const link = screen.getByRole('link', { name: 'Sign Up' });

    userEvent.click(link);

    const signUpPage = screen.getByTestId('signup-page');

    expect(signUpPage).toBeInTheDocument();
  });
});
