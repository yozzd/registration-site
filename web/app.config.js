export default defineAppConfig({
  ui: {
    primary: 'slate',
    input: {
      color: {
        white: {
          outline: 'shadow-none bg-white text-primary-950 ring-1 ring-inset ring-primary-200 focus:ring-2 focus:ring-primary-950',
        },
      },
      size: { xl: 'text-sm' },
      default: {
        size: 'xl',
      },
    },
    button: {
      color: {
        black: {
          solid: 'shadow-none text-white bg-primary-950 hover:bg-primary-950 disabled:bg-primary-950 focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500',
        },
      },
      size: { xl: 'text-sm' },
      default: {
        color: 'black',
        size: 'xl',
      },
    },
    tooltip: {
      background: 'bg-primary-950',
      color: 'text-white',
    },
  },
});
