import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import * as ReactHelmetAsync from 'react-helmet-async'
import App from './App'
import { siteConfig } from './site.config'
export { siteConfig }

const helmetAsync = ReactHelmetAsync as any;
const { HelmetProvider } = helmetAsync.default || helmetAsync;

import { getBasePath } from './utils/basePath';

export function render(url: string) {
    const helmetContext: any = {};
    const html = renderToString(
        <StrictMode>
            <HelmetProvider context={helmetContext}>
                <StaticRouter location={url} basename={getBasePath()}>
                    <App />
                </StaticRouter>
            </HelmetProvider>
        </StrictMode>
    );

    return { html, helmet: helmetContext.helmet };
}
