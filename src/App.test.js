import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RecoilRoot } from 'recoil';
import App from './App';

test('renders twitter-clone-frontend without crashing', () => {
  render(
    <RecoilRoot>
      <App />
    </RecoilRoot>
  );
  expect(document.body).toBeInTheDocument();
});
