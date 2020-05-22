export {
  ensureDirSync,
  existsSync,
  readJsonSync,
  readFileStrSync,
  writeFileStrSync
} from 'https://deno.land/std@v0.42.0/fs/mod.ts'

export {
  dirname
} from 'https://deno.land/std@v0.42.0/path/mod.ts'

export {
  parse as parseArgs
} from 'https://deno.land/std@v0.42.0/flags/mod.ts'

export {
  parse as parseYaml
} from 'https://deno.land/std@v0.42.0/encoding/yaml.ts'

export {
  green,
  red
} from 'https://deno.land/std@v0.42.0/fmt/colors.ts'

import markit from 'https://raw.githubusercontent.com/englishphilosophy/markit/v0.1.0/mod.ts'
export { markit }
