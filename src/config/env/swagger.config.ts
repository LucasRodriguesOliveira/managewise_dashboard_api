export interface ISwaggerConfig {
  apiName: string;
  description: string;
  version: string;
}

export const swaggerConfig = (): { swagger: ISwaggerConfig } => {
  const {
    API_NAME: name,
    API_VERSION: version,
    API_DESCRIPTION: description,
  } = process.env;

  return {
    swagger: {
      apiName: name,
      version,
      description,
    },
  };
};
