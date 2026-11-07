// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', 'nuxt-auth-utils'],
  devtools: { enabled: true },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: { lang: 'ru' },
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    databaseUrl: 'file:local.db',
    uploadsDir: './data/uploads',
    session: {
      password: '',
      maxAge: 60 * 60 * 24 * 7,
    },
    public: {
      siteUrl: 'http://localhost:3000',
    },
  },
  routeRules: {
    '/**': {
      headers: {
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
    },
  },
  compatibilityDate: '2025-07-15',
  eslint: {
    config: { stylistic: true },
  },
})
