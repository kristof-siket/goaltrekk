#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/1623a4773eb85501a436cd7e209c31a52036c5a4c03492b9b65c6c731962b5ab/contract';
import endContract from '../../snapshots/1623a4773eb85501a436cd7e209c31a52036c5a4c03492b9b65c6c731962b5ab/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  lit,
  primaryKey,
  sql,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'Goal',
        columns: [
          col('actionItems', 'jsonb', { notNull: true, codecRef: { codecId: 'pg/jsonb@1' } }),
          col('category', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('closed', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('conclusion', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('date', 'timestamptz(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
          col('deadline', 'timestamptz(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
          col('description', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'Goal_actionItems_shape_8733a427',
            sql`jsonb_path_match("actionItems", 'strict $.type() == "array" && !exists($[*] ? (!((@.type() == "object" && exists(@.keyvalue() ? (@.key == "actionDate" && (@.value.type() == "string"))) && exists(@.keyvalue() ? (@.key == "actionSummary" && (@.value.type() == "string"))) && !exists(@.keyvalue() ? (@.key != "actionDate" && @.key != "actionSummary"))))))') IS TRUE`,
          ),
        ],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
