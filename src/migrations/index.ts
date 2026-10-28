import * as migration_20261028_115013_initial_schema from './20261028_115013_initial_schema';

export const migrations = [
  {
    up: migration_20261028_115013_initial_schema.up,
    down: migration_20261028_115013_initial_schema.down,
    name: '20261028_115013_initial_schema'
  },
];
