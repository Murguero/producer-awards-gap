import app from './app';

import { config } from './config';

app.listen(config.port, () => {
  console.log('Server started on port 3333!');
});
