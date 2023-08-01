import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import { register } from '../apiServices';
import Home from '@/pages/index';


describe('Home', () => {

  beforeEach(() => {
    jest.mock('axios');
    render(<Home />);
  })

  afterEach(() => {
    jest.clearAllMocks();
  })

  it('renders a header: BROCCOLI & CO.', () => {
    const header = screen.queryByLabelText('header')
    let heading = header?.textContent;

    expect(heading).toBe('BROCCOLI & CO.');
  })

  it('renders an invite button', () => {
    const button = screen.queryByLabelText('invite button');
    let name = button?.textContent;

    expect(name).toBe('Request an invite');
  })

  it('render the invite modal when clicking invite button', async () => {
    expect(screen.queryByLabelText('invite-modal-title')).toBeNull();

    const button = screen.queryByLabelText('invite button');
    if (button) {
      await act(async () => fireEvent.click(button));
      expect(screen.queryByLabelText('invite-modal-title')).toBeInTheDocument()
    }
  })

  describe('Modal', () => {
    it('render 3 input fields and 1 send button: full name, email, confirm email in the invite modal', async () => {
      expect(screen.queryByLabelText('full-name-input')).toBeNull();
      expect(screen.queryByLabelText('email-input')).toBeNull();
      expect(screen.queryByLabelText('confirm-email-input')).toBeNull();
      expect(screen.queryByLabelText('send-button')).toBeNull();

      const button = screen.queryByLabelText('invite button');
      if (button) {
        await act(async () => fireEvent.click(button));
        expect(screen.queryByLabelText('full-name-input')).toBeInTheDocument();
        expect(screen.queryByLabelText('email-input')).toBeInTheDocument();
        expect(screen.queryByLabelText('confirm-email-input')).toBeInTheDocument();
        expect(screen.queryByLabelText('send-button')).toBeInTheDocument();
      }
    })

    it('show validation message when full name is less than 3 characters and hide it otherwise', async () => {
      const button = screen.queryByLabelText('invite button');

      if (button) {
        await act(async () => fireEvent.click(button));
        // Hint:: you have to find the exact input element
        //        instead of the material UI Input element
        const fullNameInput = screen.queryByLabelText('full-name-input')?.querySelector('input');

        if (fullNameInput) {
          await fireEvent.change(fullNameInput, {
            target: { value: 'os' },
          });
          expect(screen.queryByLabelText('full-name-error-text')).toBeInTheDocument();
          await fireEvent.change(fullNameInput, {
            target: { value: 'oscar' },
          });
          expect(screen.queryByLabelText('full-name-error-text')).toBeNull();
        }
      }
    })

    it('show validation message when email is invalid and hide it otherwise', async () => {
      const button = screen.queryByLabelText('invite button');

      if (button) {
        await act(async () => fireEvent.click(button));
        const emailInput = screen.queryByLabelText('email-input')?.querySelector('input');

        if (emailInput) {
          await fireEvent.change(emailInput, {
            target: { value: 'os' },
          });
          expect(screen.queryByLabelText('email-error-text')).toBeInTheDocument();
          await fireEvent.change(emailInput, {
            target: { value: 'oscar@test.com' },
          });
          expect(screen.queryByLabelText('email-error-text')).toBeNull();
        }
      }
    })

    it("show validation message when confirm email doesn't match and hide it otherwise", async () => {
      const button = screen.queryByLabelText('invite button');

      if (button) {
        await act(async () => fireEvent.click(button));
        const emailInput = screen.queryByLabelText('email-input')?.querySelector('input');
        const confirmEmailInput = screen.queryByLabelText('confirm-email-input')?.querySelector('input');

        if (confirmEmailInput && emailInput) {
          await fireEvent.change(emailInput, {
            target: { value: 'oscar@test.com' },
          });
          await fireEvent.change(confirmEmailInput, {
            target: { value: 'oscar@test.cn' },
          });
          expect(screen.queryByLabelText('confirm-email-error-text')).toBeInTheDocument();
          await fireEvent.change(confirmEmailInput, {
            target: { value: 'oscar@test.com' },
          });
          expect(screen.queryByLabelText('confirm-email-error-text')).toBeNull();
        }
      }
    })

    it("if the inputs are valid, it will send a request when clicking button 'Send'", async () => {
      const postSpy = jest.spyOn(axios, 'post');

      const button = screen.queryByLabelText('invite button');

      if (button) {
        await act(async () => fireEvent.click(button));

        const fullNameInput = screen.queryByLabelText('full-name-input')?.querySelector('input');
        const emailInput = screen.queryByLabelText('email-input')?.querySelector('input');
        const confirmEmailInput = screen.queryByLabelText('confirm-email-input')?.querySelector('input');
        const sendButton = screen.queryByLabelText('send-button')

        if (confirmEmailInput && emailInput && fullNameInput && sendButton) {
          await fireEvent.change(fullNameInput, {
            target: { value: 'test' },
          });

          await fireEvent.change(emailInput, {
            target: { value: 'test@test.com' },
          });

          await fireEvent.change(confirmEmailInput, {
            target: { value: 'test@test.com' },
          });

          await act(async () => fireEvent.click(sendButton));

          expect(postSpy).toBeCalledTimes(1);
        }
      }
    })

    it("when sending a request, 'Send' button is disabled and renamed to 'Sending, please wait..'", async () => {
      const button = screen.queryByLabelText('invite button');

      if (button) {
        await act(async () => fireEvent.click(button));

        const fullNameInput = screen.queryByLabelText('full-name-input')?.querySelector('input');
        const emailInput = screen.queryByLabelText('email-input')?.querySelector('input');
        const confirmEmailInput = screen.queryByLabelText('confirm-email-input')?.querySelector('input');
        const sendButton = screen.queryByLabelText('send-button')

        if (confirmEmailInput && emailInput && fullNameInput && sendButton) {
          await fireEvent.change(fullNameInput, {
            target: { value: 'oscar' },
          });

          await fireEvent.change(emailInput, {
            target: { value: 'oscar@test.com' },
          });

          await fireEvent.change(confirmEmailInput, {
            target: { value: 'oscar@test.com' },
          });

          await act(async () => fireEvent.click(sendButton));
          expect(screen.queryByLabelText('send-button')?.textContent).toBe('Sending, please wait..');
          expect(screen.queryByLabelText('send-button')).toHaveAttribute('disabled')
        }
      }
    })

    it("if either of the inputs is not valid, it won't send a request when clicking button 'Send'", async () => {
      const postSpy = jest.spyOn(axios, 'post');

      const button = screen.queryByLabelText('invite button');

      if (button) {
        await act(async () => fireEvent.click(button));

        const fullNameInput = screen.queryByLabelText('full-name-input')?.querySelector('input');
        const emailInput = screen.queryByLabelText('email-input')?.querySelector('input');
        const confirmEmailInput = screen.queryByLabelText('confirm-email-input')?.querySelector('input');
        const sendButton = screen.queryByLabelText('send-button')

        if (confirmEmailInput && emailInput && fullNameInput && sendButton) {
          // Invalid: full name is less than 3 characters
          //          invalid email format
          //          confirm email doesn't match
          await fireEvent.change(fullNameInput, {
            target: { value: 'os' },
          });
          await fireEvent.change(emailInput, {
            target: { value: 'oscar' },
          });
          await fireEvent.change(confirmEmailInput, {
            target: { value: 'oscar@test.cn' },
          });

          await act(async () => fireEvent.click(sendButton));
          expect(postSpy).toBeCalledTimes(0);

          // now: invalid email format
          //      confirm email doesn't match
          await fireEvent.change(fullNameInput, {
            target: { value: 'oscar' },
          });
          await act(async () => fireEvent.click(sendButton));
          expect(postSpy).toBeCalledTimes(0);

          // now: confirm email doesn't match
          await fireEvent.change(emailInput, {
            target: { value: 'oscar@test.com' },
          });
          await act(async () => fireEvent.click(sendButton));
          expect(postSpy).toBeCalledTimes(0);
        }
      }
    })

    it("mock api 'register' response 200", async () => {
      const mockResponse = {
        status: 200
      };
      axios.post = jest.fn().mockResolvedValueOnce(mockResponse);
      const response = await register("", "");
      expect(mockResponse).toEqual(response);
    })

    it("if successfully sent (status 200), then button 'OK' shows", async () => {
      const mockResponse = {
        status: 200
      };
      axios.post = jest.fn().mockResolvedValueOnce(mockResponse);
      
      const button = screen.queryByLabelText('invite button');

      if (button) {
        await act(async () => fireEvent.click(button));

        const fullNameInput = screen.queryByLabelText('full-name-input')?.querySelector('input');
        const emailInput = screen.queryByLabelText('email-input')?.querySelector('input');
        const confirmEmailInput = screen.queryByLabelText('confirm-email-input')?.querySelector('input');
        const sendButton = screen.queryByLabelText('send-button')

        if (confirmEmailInput && emailInput && fullNameInput && sendButton) {
          await fireEvent.change(fullNameInput, {
            target: { value: 'oscar' },
          });

          await fireEvent.change(emailInput, {
            target: { value: 'oscar@test.com' },
          });

          await fireEvent.change(confirmEmailInput, {
            target: { value: 'oscar@test.com' },
          });
          
          await act(async () => fireEvent.click(sendButton));
          expect(screen.queryByLabelText('ok-button')?.textContent).toBe('OK');
        }
      }
    })

    it("when button 'OK' is clicked, hide the modal and display the home page", async () => {
      const mockResponse = {
        status: 200
      };
      axios.post = jest.fn().mockResolvedValueOnce(mockResponse);
      
      const button = screen.queryByLabelText('invite button');

      if (button) {
        await act(async () => fireEvent.click(button));

        const fullNameInput = screen.queryByLabelText('full-name-input')?.querySelector('input');
        const emailInput = screen.queryByLabelText('email-input')?.querySelector('input');
        const confirmEmailInput = screen.queryByLabelText('confirm-email-input')?.querySelector('input');
        const sendButton = screen.queryByLabelText('send-button')

        if (confirmEmailInput && emailInput && fullNameInput && sendButton) {
          await fireEvent.change(fullNameInput, {
            target: { value: 'oscar' },
          });

          await fireEvent.change(emailInput, {
            target: { value: 'oscar@test.com' },
          });

          await fireEvent.change(confirmEmailInput, {
            target: { value: 'oscar@test.com' },
          });

          await act(async () => fireEvent.click(sendButton));
          const okButton = screen.queryByLabelText('ok-button');

          if(okButton){
            await act(async () => fireEvent.click(okButton));
            expect(screen.queryByLabelText('invite-modal-title')).toBeNull();
          }
        }
      }
    })

    it("when sending a registered email (bad request status 400), error message shows below button 'Send' ", async () => {
      // mock bad request 400
      const mockRejectedResponse = {
        response: {
          status: 400,
          data: {
            errorMessage: 'already registered'
          }
        },
      };
      axios.post = jest.fn().mockRejectedValueOnce(mockRejectedResponse);

      const button = screen.queryByLabelText('invite button');

      if (button) {
        await act(async () => fireEvent.click(button));

        const fullNameInput = screen.queryByLabelText('full-name-input')?.querySelector('input');
        const emailInput = screen.queryByLabelText('email-input')?.querySelector('input');
        const confirmEmailInput = screen.queryByLabelText('confirm-email-input')?.querySelector('input');
        const sendButton = screen.queryByLabelText('send-button')

        if (confirmEmailInput && emailInput && fullNameInput && sendButton) {
          await fireEvent.change(fullNameInput, {
            target: { value: 'oscar' },
          });

          await fireEvent.change(emailInput, {
            target: { value: 'usedemail@airwallex.com' },
          });

          await fireEvent.change(confirmEmailInput, {
            target: { value: 'usedemail@airwallex.com' },
          });

          expect(screen.queryByLabelText('error-status-text')).toBeNull();
          await act(async () => fireEvent.click(sendButton));
          expect(screen.queryByLabelText('error-status-text')?.textContent).toBe('already registered');
        }
      }
    })
  })
})