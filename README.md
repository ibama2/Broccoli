# Project Functionality
This project Broccoli creates a simple yet clean homepage that allow users to enter their [name] and [email] to receive email invitations.

# To run this project
```bash
npm install
npm run dev
```

# To build this project
```bash
npm run build
```

# Run Jest Tests
```bash
npm run test
```
## 测试内容包括：
1.主页内容；
2.‘邀请’按钮功能；
3.邀请弹窗页面内容
4.邀请弹窗页面数据域校验
5.邀请弹窗页面发送按钮交互逻辑
5.发送成功弹窗内容
6.发送失败弹窗内容

# Environment
node: v16.14.0
npm: 8.3.1
Nextjs: 13.4.12 (requires Node.js 16.8 or later.)

# Framework: Next.js + Jest
```bash
npx create-next-app --example with-jest with-jest-app
```

This includes Next.js' built-in support for Global CSS, CSS Modules and TypeScript.

The Next.js Compiler, written in Rust using SWC, allows Next.js to transform and minify your JavaScript code for production.

Compilation using the Next.js Compiler is 17x faster than Babel and enabled by default since Next.js version 12.

## JEST notes
0. 测试前&测试后
    ```
    beforeEach(() => {
        jest.mock('axios');
        render(<Home />);
    })

    afterEach(() => {
        jest.clearAllMocks();
    })
    ```

1. act:
    The act function is a utility provided by the React Testing Library that wraps around your code, ensuring that all updates related to state changes, effects, and other asynchronous actions are flushed before proceeding. This is crucial when testing components with asynchronous behavior, as it helps maintain a consistent and predictable test environment.

    ```
    await act(async () => fireEvent.click(button));
    ```

2.数据返回成功，更新state，触发页面重渲染的测试方法
    ```
    const mockResponse = {
        status: 200
      };
      axios.post = jest.fn().mockResolvedValueOnce(mockResponse);
    ```

3.数据返回失败，更新state，触发页面重渲染的测试方法
    ```
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
    ```