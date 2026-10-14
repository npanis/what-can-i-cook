-- Phase 1 schema. Recipes are written for 1 person; the app scales amounts.
-- The app reads content anonymously; only the service role writes.

create table ingredients (
  id bigint generated always as identity primary key,
  name text not null unique,
  category text,
  is_staple boolean not null default false
);

create table ingredient_aliases (
  alias text primary key,
  ingredient_id bigint not null references ingredients (id) on delete cascade
);

create table recipes (
  id bigint generated always as identity primary key,
  slug text not null unique,
  title text not null,
  minutes integer not null check (minutes > 0),
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  source text not null default 'curated' check (source in ('curated', 'ai')),
  status text not null default 'published' check (status in ('draft', 'published')),
  created_at timestamptz not null default now()
);

create table recipe_ingredients (
  recipe_id bigint not null references recipes (id) on delete cascade,
  ingredient_id bigint not null references ingredients (id),
  position smallint not null,
  -- Amount for 1 person. Null means "to taste".
  amount numeric check (amount > 0),
  unit text,
  optional boolean not null default false,
  primary key (recipe_id, ingredient_id)
);

create table recipe_steps (
  recipe_id bigint not null references recipes (id) on delete cascade,
  position smallint not null,
  -- Cooking terms marked as [[term-slug|shown text]].
  text text not null,
  primary key (recipe_id, position)
);

create table terms (
  slug text primary key,
  name text not null,
  part_of_speech text not null check (part_of_speech in ('verb', 'noun', 'adjective')),
  short_definition text not null,
  full_definition text not null,
  guide_title text,
  guide jsonb,
  related text[] not null default '{}'
);

create table ai_cache (
  pantry_hash text primary key,
  recipe_ids bigint[] not null,
  created_at timestamptz not null default now()
);

create table search_events (
  id bigint generated always as identity primary key,
  pantry text[] not null,
  result_count smallint not null,
  used_ai boolean not null default false,
  created_at timestamptz not null default now()
);

create index recipe_ingredients_ingredient_idx on recipe_ingredients (ingredient_id);

-- Row level security: content is public to read, nothing is public to write.
alter table ingredients enable row level security;
alter table ingredient_aliases enable row level security;
alter table recipes enable row level security;
alter table recipe_ingredients enable row level security;
alter table recipe_steps enable row level security;
alter table terms enable row level security;
alter table ai_cache enable row level security;
alter table search_events enable row level security;

create policy "read ingredients" on ingredients for select using (true);
create policy "read aliases" on ingredient_aliases for select using (true);
create policy "read published recipes" on recipes for select using (status = 'published');
create policy "read recipe ingredients" on recipe_ingredients for select
  using (exists (select 1 from recipes r where r.id = recipe_id and r.status = 'published'));
create policy "read recipe steps" on recipe_steps for select
  using (exists (select 1 from recipes r where r.id = recipe_id and r.status = 'published'));
create policy "read terms" on terms for select using (true);
-- ai_cache and search_events have no policies: only the recommend function (service role) uses them.
