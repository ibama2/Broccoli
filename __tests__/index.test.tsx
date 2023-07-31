import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '@/pages/index';

describe('Home', () => {

  it('renders a header: Broccoli & Co.', () => {
    render(<Home />)
    const header = screen.queryByLabelText('header')
    let heading = header?.textContent;

    expect(heading).toBe('Broccoli & Co.');
  })

  it('renders an invite button', () => {
    render(<Home />)
    const button = screen.queryByLabelText('invite button');
    let name = button?.textContent;

    expect(name).toBe('Request an invite');
  })

  it('render the invite modal when clicking invite button', () => {
    render(<Home />)
    expect(screen.queryByLabelText('invite-modal-title')).toBeNull();

    const button = screen.queryByLabelText('invite button');
    if (button) {
      fireEvent.click(button)
      expect(screen.queryByLabelText('invite-modal-title')).toBeInTheDocument()
    }
  })


  it('render 3 input fields and 1 send button: full name, email, confirm email in the invite modal', () => {
    render(<Home />)
    expect(screen.queryByLabelText('full-name-input')).toBeNull();
    expect(screen.queryByLabelText('email-input')).toBeNull();
    expect(screen.queryByLabelText('confirm-email-input')).toBeNull();
    expect(screen.queryByLabelText('send-button')).toBeNull();

    const button = screen.queryByLabelText('invite button');
    if (button) {
      fireEvent.click(button);
      expect(screen.queryByLabelText('full-name-input')).toBeInTheDocument();
      expect(screen.queryByLabelText('email-input')).toBeInTheDocument();
      expect(screen.queryByLabelText('confirm-email-input')).toBeInTheDocument();
      expect(screen.queryByLabelText('send-button')).toBeInTheDocument();
    }
  })

  it('show validation message when full name is less than 3 characters and hide it otherwise', async () => {
    render(<Home />)
    const button = screen.queryByLabelText('invite button');

    if (button) {
      fireEvent.click(button);
      // Hint:: you have to find the exact input element
      //        instead of the material UI Input element
      const fullNameInput = screen.queryByLabelText('full-name-input')?.querySelector('input');

      if (fullNameInput) {
        await fireEvent.change(fullNameInput, {
          target: {value: 'os'},
        });
        expect(screen.queryByLabelText('full-name-error-text')).toBeInTheDocument();
        await fireEvent.change(fullNameInput, {
          target: {value: 'oscar'},
        });
        expect(screen.queryByLabelText('full-name-error-text')).toBeNull();
      }
    }
  })

  it('show validation message when email is invalid and hide it otherwise', async () => {
    render(<Home />)
    const button = screen.queryByLabelText('invite button');

    if (button) {
      fireEvent.click(button);
      const emailInput = screen.queryByLabelText('email-input')?.querySelector('input');

      if (emailInput) {
        await fireEvent.change(emailInput, {
          target: {value: 'os'},
        });
        expect(screen.queryByLabelText('email-error-text')).toBeInTheDocument();
        await fireEvent.change(emailInput, {
          target: {value: 'oscar@test.com'},
        });
        expect(screen.queryByLabelText('email-error-text')).toBeNull();
      }
    }
  })

  it("show validation message when confirm email doesn't match and hide it otherwise", async () => {
    render(<Home />)
    const button = screen.queryByLabelText('invite button');

    if (button) {
      fireEvent.click(button);
      const emailInput = screen.queryByLabelText('email-input')?.querySelector('input');
      const confirmEmailInput = screen.queryByLabelText('confirm-email-input')?.querySelector('input');

      if (confirmEmailInput && emailInput) {
        await fireEvent.change(emailInput, {
          target: {value: 'oscar@test.com'},
        });

        await fireEvent.change(confirmEmailInput, {
          target: {value: 'oscar@test.cn'},
        });
        expect(screen.queryByLabelText('confirm-email-error-text')).toBeInTheDocument();
        await fireEvent.change(confirmEmailInput, {
          target: {value: 'oscar@test.com'},
        });
        expect(screen.queryByLabelText('confirm-email-error-text')).toBeNull();
      }
    }
  })


  it("check validation when clicking sending, and if successfully sent, then button 'Sending, please wait..' disappears ", async () => {
    render(<Home />)
    const button = screen.queryByLabelText('invite button');

    if (button) {
      fireEvent.click(button);

      const fullNameInput = screen.queryByLabelText('full-name-input')?.querySelector('input');
      const emailInput = screen.queryByLabelText('email-input')?.querySelector('input');
      const confirmEmailInput = screen.queryByLabelText('confirm-email-input')?.querySelector('input');
      const sendButton = screen.queryByLabelText('send-button')

      if (confirmEmailInput && emailInput && fullNameInput && sendButton) {
        await fireEvent.change(fullNameInput, {
          target: {value: 'oscar'},
        });

        await fireEvent.change(emailInput, {
          target: {value: 'oscar@test.com'},
        });

        await fireEvent.change(confirmEmailInput, {
          target: {value: 'oscar@test.cn'},
        });


        await fireEvent.click(sendButton);
        expect(screen.queryByLabelText('send-button')?.textContent).toBe('Send');
        
        await fireEvent.change(confirmEmailInput, {
          target: {value: 'oscar@test.com'},
        });
        await fireEvent.click(sendButton);
        expect(screen.queryByLabelText('send-button')?.textContent).toBe('Sending, please wait..');

        waitFor(() => {
          expect(screen.queryByLabelText('send-button')).toBeNull();
        })
      }
    }
  })

  
  it("when sending a registered email, error message shows below button 'Send'", async () => {
    render(<Home />)
    const button = screen.queryByLabelText('invite button');

    if (button) {
      fireEvent.click(button);

      const fullNameInput = screen.queryByLabelText('full-name-input')?.querySelector('input');
      const emailInput = screen.queryByLabelText('email-input')?.querySelector('input');
      const confirmEmailInput = screen.queryByLabelText('confirm-email-input')?.querySelector('input');
      const sendButton = screen.queryByLabelText('send-button')

      if (confirmEmailInput && emailInput && fullNameInput && sendButton) {
        await fireEvent.change(fullNameInput, {
          target: {value: 'oscar'},
        });

        await fireEvent.change(emailInput, {
          target: {value: 'usedemail@airwallex.com'},
        });

        await fireEvent.change(confirmEmailInput, {
          target: {value: 'usedemail@airwallex.com'},
        });

        await fireEvent.click(sendButton);
        expect(screen.queryByLabelText('send-button')?.textContent).toBe('Sending, please wait..');
        expect(screen.queryByLabelText('error-status-text')).toBeNull();

        waitFor(() => {
          expect(screen.queryByLabelText('error-status-text')).toBeInTheDocument();
        })
      }
    }
  })

})
