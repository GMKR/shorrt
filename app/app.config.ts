export default defineAppConfig({
  ui: {
    colors: {
      primary: "black",
    },
    form: {
      base: "space-y-3",
    },
    button: {
      defaultVariants: {
        size: "lg",
      },
    },
    input: {
      defaultVariants: {
        size: "lg",
      },
      slots: {
        root: "w-full",
      },
    },
  },
})
