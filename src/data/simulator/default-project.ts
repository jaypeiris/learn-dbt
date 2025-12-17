export const defaultProject: Record<string, string> = {
  'dbt_project.yml': `
name: my_dbt_project
version: 1.0.0
profile: default

models:
  my_dbt_project:
    staging:
      materialized: view
    marts:
      materialized: table
`,
  'packages.yml': `
packages:
  - package: dbt-labs/dbt_utils
    version: 1.1.1
`,
  'README.md': `
# Sample dbt project (simulator)

This is a tiny, warehouse-free dbt-style project used by the simulator UI.

Try:
- \`dbt ls\`
- \`dbt compile\`
- \`dbt run\`
- \`dbt test\`
- \`dbt docs generate\`
`,
  'models/staging/stg_orders.sql': `
select
  order_id,
  customer_id,
  order_date,
  status,
  order_total_cents
from {{ source('raw', 'orders') }}
`,
  'models/staging/stg_customers.sql': `
select
  customer_id,
  customer_name
from {{ source('raw', 'customers') }}
`,
  'models/staging/stg_payments.sql': `
select
  payment_id,
  order_id,
  payment_method,
  amount_cents
from {{ source('raw', 'payments') }}
`,
  'models/marts/fct_orders.sql': `
{{ config(materialized='table') }}

select
  {{ dbt_utils.surrogate_key(['o.order_id']) }} as order_sk,
  o.order_id,
  o.customer_id,
  o.order_date,
  {{ cents_to_dollars('o.order_total_cents') }} as order_total_dollars,
  c.customer_name
from {{ ref('stg_orders') }} as o
left join {{ ref('stg_customers') }} as c
  on o.customer_id = c.customer_id
`,
  'models/marts/fct_payments.sql': `
{{ config(materialized='table') }}

select
  p.payment_id,
  p.order_id,
  p.payment_method,
  {{ cents_to_dollars('p.amount_cents') }} as amount_dollars
from {{ ref('stg_payments') }} as p
`,
  'models/marts/dim_customers.sql': `
{{ config(materialized='table') }}

select
  c.customer_id,
  c.customer_name
from {{ ref('stg_customers') }} as c
`,
  'macros/cents_to_dollars.sql': `
{% macro cents_to_dollars(column_name) -%}
  ({{ column_name }} / 100.0)
{%- endmacro %}
`,
  'models/staging/schema.yml': `
version: 2

models:
  - name: stg_orders
    description: "Cleaned orders from the raw source."
    columns:
      - name: order_id
        tests:
          - unique
          - not_null
      - name: customer_id
        tests:
          - not_null
  - name: stg_customers
    description: "Cleaned customers from the raw source."
    columns:
      - name: customer_id
        tests:
          - unique
          - not_null
  - name: stg_payments
    description: "Payments from the raw source."
    columns:
      - name: payment_id
        tests:
          - unique
          - not_null
      - name: order_id
        tests:
          - not_null
`,
  'models/marts/schema.yml': `
version: 2

models:
  - name: fct_orders
    description: "Order fact table with customer context."
    columns:
      - name: order_id
        tests:
          - unique
          - not_null
  - name: fct_payments
    description: "Payment fact table."
    columns:
      - name: payment_id
        tests:
          - unique
          - not_null
  - name: dim_customers
    description: "Customer dimension table."
    columns:
      - name: customer_id
        tests:
          - unique
          - not_null
`,
}
