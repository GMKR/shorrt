export default defineNuxtConfig({
  modules: ["@nuxthub/core", "@nuxt/eslint", "@nuxt/ui", "nuxt-auth-utils", "@vueuse/nuxt"],
  $development: {
    runtimeConfig: {
      public: {
        product: {
          url: "http://localhost:3000",
        },
      },
      db: {
        logger: true,
      },
    },
  },
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    public: {
      product: {
        name: "Shorrt",
        description: "Shorrt is a URL shortening service that allows you to shorten long URLs into short, easy-to-remember links.",
        url: "",
      },
    },
    auth: {
      signupEnabled: false,
    },
    visitors: {
      recordIpAddress: true,
    },
    db: {
      logger: false,
    },
  },
  future: { compatibilityVersion: 4 },
  experimental: {
    typedPages: true,
    viewTransition: true,
  },
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
