import { DataSource } from 'typeorm';
import { config } from 'dotenv';

import { APP_DATA_SOURCE_OPTIONS } from './src/app.module';

config();
export default new DataSource(APP_DATA_SOURCE_OPTIONS);
