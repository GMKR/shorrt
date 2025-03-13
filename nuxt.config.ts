export default defineNuxtConfig({
  modules: [
    "@nuxthub/core",
    "@nuxt/eslint",
    "@nuxt/ui",
    "nuxt-auth-utils",
  ],
  $development: {
    runtimeConfig: {
      db: {
        logger: true,
      },
    },
  },
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    public: {
      url: "http://localhost:3000",
    },
    visitors: {
      redactIpAddress: true,
    },
    db: {
      logger: false,
    },
  },
  future: { compatibilityVersion: 4 },
  compatibilityDate: "2025-03-12",
  hub: {
    database: true,
    kv: true,
  },
  eslint: {
    config: {
      nuxt: {
        sortConfigKeys: true,
      },
      stylistic: {
        quotes: "double",
      },
    },
  },
})
