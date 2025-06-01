import * as dotenv from 'dotenv';

dotenv.config();

interface ConfigProps {
  port: number;
}

export const config: ConfigProps = {
  port: Number(process.env.PORT) || 3333,
};
