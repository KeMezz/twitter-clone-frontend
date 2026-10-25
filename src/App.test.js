import http from 'http';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { RecoilRoot } from 'recoil';

// The API is a real HTTP server started by this test, and requests travel through
// the real axios (browser/XHR build, as webpack bundles it) over jsdom's XMLHttpRequest,
// so header handling, JSON bodies, DELETE bodies, AbortSignal cancellation and 401
// handling of axios 1.x are exercised. Only the server behaviour is simulated.
const TWEETS = [
  { id: 1, text: 'hello from alice', createdAt: '2024-01-01T00:00:00Z', url: 'https://example.test/a.png', username: 'alice' },
  { id: 2, text: 'hello from bob', createdAt: '2024-01-02T00:00:00Z', url: 'https://example.test/b.png', username: 'bob' },
];

let server;
let seen;
let mode;
let App;
let callAPI;

const handler = (req, res) => {
  const chunks = [];
  req.on('data', (c) => chunks.push(c));
  req.on('end', () => {
    const body = Buffer.concat(chunks).toString();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'authorization, content-type');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    if (req.method === 'OPTIONS') return res.writeHead(204).end();
    seen.push({ method: req.method, url: req.url, authorization: req.headers.authorization, contentType: req.headers['content-type'], body });
    if (req.url === '/auth/login') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ token: 't0k', username: 'alice', url: 'https://example.test/a.png' }));
    }
    if (req.url === '/tweet' && req.method === 'GET') {
      if (mode === 'unauthorized') return res.writeHead(401, { 'Content-Type': 'application/json' }).end(JSON.stringify({ message: 'no auth' }));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(TWEETS));
    }
    if (req.url === '/tweet' && req.method === 'DELETE') return res.writeHead(204).end();
    return res.writeHead(404).end();
  });
};

beforeAll(async () => {
  server = http.createServer(handler);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  process.env.REACT_APP_API_SERVER = `http://127.0.0.1:${server.address().port}`;
  // utils/axios reads the env var and localStorage when first evaluated, so import after setting both
  localStorage.setItem('token', 'Bearer seeded');
  localStorage.setItem('username', 'alice');
  ({ callAPI } = await import('./utils/axios'));
  ({ default: App } = await import('./App'));
});
afterAll(() => new Promise((resolve) => server.close(resolve)));
beforeEach(() => {
  seen = [];
  mode = 'ok';
  localStorage.setItem('username', 'alice');
  jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  jest.spyOn(console, 'error').mockImplementation(() => undefined);
});

const renderApp = (path) => {
  window.history.pushState({}, '', path);
  return render(
    <RecoilRoot>
      <App />
    </RecoilRoot>
  );
};

test('callAPI uses the configured baseURL, the stored Authorization header and the 30s timeout', async () => {
  const { data } = await callAPI.get('/tweet');
  expect(data).toEqual(TWEETS);
  expect(seen).toEqual([expect.objectContaining({ method: 'GET', url: '/tweet', authorization: 'Bearer seeded' })]);
  expect(callAPI.defaults.timeout).toBe(30000);
  expect(callAPI.defaults.timeoutErrorMessage).toBe('서버와 통신할 수 없습니다.');
});

test('home loads tweets from the API and the owner can delete one (DELETE with a JSON body)', async () => {
  renderApp('/');
  expect(await screen.findByText(/hello from alice/)).toBeInTheDocument();
  expect(screen.getByText(/hello from bob/)).toBeInTheDocument();
  expect(screen.getAllByText('삭제')).toHaveLength(1); // only alice's tweet is owned by the stored username
  userEvent.click(screen.getByText('삭제'));
  await waitFor(() => expect(seen.filter((r) => r.method === 'GET')).toHaveLength(2)); // refetch after 204
  const del = seen.find((r) => r.method === 'DELETE');
  expect(del).toEqual(expect.objectContaining({ url: '/tweet', authorization: 'Bearer seeded' }));
  expect(JSON.parse(del.body)).toEqual({ id: 1 });
  expect(del.contentType).toMatch(/application\/json/);
});

test('a 401 from the API redirects the home page to the login page', async () => {
  mode = 'unauthorized';
  renderApp('/');
  expect(await screen.findByText('서비스를 이용하려면 로그인이 필요해요.')).toBeInTheDocument();
  expect(window.location.pathname).toBe('/login');
});

test('logging in posts JSON credentials, stores the token and later requests carry the new Authorization header', async () => {
  renderApp('/login');
  userEvent.type(screen.getByPlaceholderText('유저명...'), 'alice');
  userEvent.type(screen.getByPlaceholderText('비밀번호...'), 'secret');
  userEvent.click(screen.getByRole('button', { name: '로그인' }));
  expect(await screen.findByText(/hello from alice/)).toBeInTheDocument();
  const login = seen.find((r) => r.url === '/auth/login');
  expect(JSON.parse(login.body)).toEqual({ username: 'alice', password: 'secret' });
  expect(login.contentType).toMatch(/application\/json/);
  expect(localStorage.getItem('token')).toBe('Bearer t0k');
  expect(seen.filter((r) => r.url === '/tweet' && r.method === 'GET').pop().authorization).toBe('Bearer t0k');
  expect(window.location.pathname).toBe('/');
});
