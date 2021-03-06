declare module "*.svg" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any;
  export default content;
}

declare module "*.png" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any;
  export default content;
}

declare const process: {
  env: Record<string, string>
}

declare module "@material-ui/core/styles/withStyles" {
  interface BaseCSSProperties {
    flip?: boolean;
  }
}
