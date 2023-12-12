export interface IAppConfig {
  port: number;
}

export const appConfig = (): { app: IAppConfig } => ({
  app: {
    port: parseInt(process.env.API_PORT ?? '3000', 10),
  },
});
