# Firebase Custom Auth idToken Retriever

Read https://firebase.google.com/docs/auth/web/custom-auth for context.

This is a plugin for the [Insomnia REST client](https://insomnia.rest/) to retrieve 
[idToken](https://firebase.google.com/docs/auth/users#auth_tokens) from Firebase. Firebase
requires first acquiring 
[custom token](https://firebase.google.com/docs/auth/admin/create-custom-tokens) and uses it 
to generate `idToken`.

## Usage

Create a login request to your custom authentication service. Set header 
`X-Insomnia-Firebase-Custom-Token-Path` to [dot-notation](https://lodash.com/docs/4.17.15#get) 
path to the __Firebase Custom Token__. The plugin automatically stores it and uses it to
retrieve `idToken`.

![loginAndGetCustomToken.png](https://raw.githubusercontent.com/Zhomart/insomnia-plugin-firebase-custom-auth/master/screenshots/loginAndGetCustomToken.png)

In environment settings (CTRL+e/CMD+e), create an environment variable and set the value
to the `Firebase idToken` tag (CTRL+SPACE to find the tag).

![createIdTokenTag.png.png](https://raw.githubusercontent.com/Zhomart/insomnia-plugin-firebase-custom-auth/master/screenshots/createIdTokenTag.png.png)

Configure the `Firebase idToken` tag. Set `customTokenOrEmptyToUseStored` only if you
want to override the stored custom token. It automatically gets `idToken` from Firebase and caches it.

![configuringIdTokenTag.png](https://raw.githubusercontent.com/Zhomart/insomnia-plugin-firebase-custom-auth/master/screenshots/configuringIdTokenTag.png)

Use the `idToken` in your requests.

![useIdToken.png](https://raw.githubusercontent.com/Zhomart/insomnia-plugin-firebase-custom-auth/master/screenshots/useIdToken.png)

Click on `Reset Firebase Custom Token` to remove stored __custom token__ and __idToken__.

![resetTokens.png](https://raw.githubusercontent.com/Zhomart/insomnia-plugin-firebase-custom-auth/master/screenshots/resetTokens.png)


# License

    MIT License

    Copyright (c) 2020 Zhomart Mukhamejanov

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
