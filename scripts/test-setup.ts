import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { afterEach } from 'bun:test';
GlobalRegistrator.register();

await import('@testing-library/jest-dom');
const { cleanup } = await import('@testing-library/react');

afterEach(cleanup);
