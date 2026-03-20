import { build } from 'vite';
import fs from 'fs';

build().catch(err => {
  const errorDump = {
    message: err.message,
    stack: err.stack,
    errors: err.errors ? err.errors : [],
    loc: err.loc,
    frame: err.frame
  };
  fs.writeFileSync('error_dump.json', JSON.stringify(errorDump, null, 2));
});
