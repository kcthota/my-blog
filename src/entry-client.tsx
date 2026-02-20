import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import * as ReactHelmetAsync from 'react-helmet-async'
import App from './App'

const helmetAsync = ReactHelmetAsync as any;
const { HelmetProvider } = helmetAsync.default || helmetAsync;

const container = document.getElementById('root')!

if (container.children.length > 0) {
    hydrateRoot(
        container,
        <StrictMode>
            <HelmetProvider>
                <BrowserRouter basename={import.meta.env.VITE_BASE_PATH || '/'}>
                    <App />
                </BrowserRouter>
            </HelmetProvider>
        </StrictMode>,
    )
} else {
    createRoot(container).render(
        <StrictMode>
            <HelmetProvider>
                <BrowserRouter basename={import.meta.env.VITE_BASE_PATH || '/'}>
                    <App />
                </BrowserRouter>
            </HelmetProvider>
        </StrictMode>,
    )
}
