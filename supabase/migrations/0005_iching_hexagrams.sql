-- 0005_iching_hexagrams.sql
-- Tabela pessoal de interpretações do I Ching (Agente de I Ching).
-- Camada autoral do Micael — separada do texto de Legge (que vive como
-- dado estático em iching_legge_oracular_text.json, consumido direto
-- pelo assets/iching-engine.js). Pensada desde já para abrigar as
-- pranchas ilustradas (plate_image_url).
--
-- Rodar no SQL Editor do Supabase (sem terminal), depois de 0004.

create table if not exists public.iching_hexagrams (
  number int primary key check (number between 1 and 64),
  legge_name text,                    -- referência: nome romanizado do Legge (ex: "Khien")
  your_judgment text,                 -- sua interpretação do julgamento (Thwan)
  your_lines jsonb default '[]'::jsonb, -- suas 6 (ou 7, hex. 1 e 2) interpretações de linha
  your_symbolism text,                -- sua leitura da imagem/símbolo
  plate_image_url text,               -- link da prancha ilustrada, quando pronta
  plate_status text not null default 'rascunho'
    check (plate_status in ('rascunho', 'revisao', 'publicado')),
  notes text,                         -- notas privadas de trabalho, não exibidas no site
  updated_at timestamptz not null default now()
);

comment on table public.iching_hexagrams is
  'Camada autoral do Micael sobre os 64 hexagramas — separada da tradução de Legge. RLS: leitura pública, escrita só pelo dono (email fixo).';

-- trigger: atualiza updated_at automaticamente a cada edição
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_iching_hexagrams_updated_at on public.iching_hexagrams;
create trigger trg_iching_hexagrams_updated_at
  before update on public.iching_hexagrams
  for each row execute function public.set_updated_at();

-- RLS
alter table public.iching_hexagrams enable row level security;

drop policy if exists "iching_hexagrams_select_public" on public.iching_hexagrams;
create policy "iching_hexagrams_select_public"
  on public.iching_hexagrams for select
  using (true);

drop policy if exists "iching_hexagrams_write_owner" on public.iching_hexagrams;
create policy "iching_hexagrams_write_owner"
  on public.iching_hexagrams for all
  using ((auth.jwt() ->> 'email') = 'micaelfacciodev@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'micaelfacciodev@gmail.com');

-- seed inicial: 64 linhas vazias (number + legge_name), prontas para edição no admin hub.
-- legge_name preenchido a partir de iching_legge_oracular_text.json.
insert into public.iching_hexagrams (number, legge_name) values
  (1,'Khien'),(2,'Khwăn'),(3,'Kun'),(4,'Măng'),(5,'Hsü'),(6,'Sung'),(7,'Sze'),(8,'Pî'),
  (9,'Hsiâo Khû'),(10,'Lî'),(11,'Thâi'),(12,'Phî'),(13,'Thung Zăn'),(14,'Tâ Yû'),(15,'Khien'),
  (16,'Yü'),(17,'Sui'),(18,'Kû'),(19,'Lin'),(20,'Kwân'),(21,'Shih Ho'),(22,'Pî'),(23,'Po'),
  (24,'Fû'),(25,'Wû Wang'),(26,'Tâ Khû'),(27,'Î'),(28,'Tâ Kwo'),(29,'Khan'),(30,'Lî'),
  (31,'Hsien'),(32,'Hăng'),(33,'Thun'),(34,'Tâ Kwang'),(35,'Ȝin'),(36,'Ming Î'),(37,'Kiâ Zăn'),
  (38,'Khwei'),(39,'Kien'),(40,'Kieh'),(41,'Sun'),(42,'Yî'),(43,'Kwâi'),(44,'Kâu'),(45,'Ȝhui'),
  (46,'Shăng'),(47,'Khwăn'),(48,'Ȝing'),(49,'Ko'),(50,'Ting'),(51,'Kăn'),(52,'Kăn'),(53,'Kien'),
  (54,'Kwei Mei'),(55,'Făng'),(56,'Lü'),(57,'Sun'),(58,'Tui'),(59,'Hwân'),(60,'Kieh'),
  (61,'Kung Fû'),(62,'Hsiâo Kwo'),(63,'Kî Ȝî'),(64,'Wei Ȝî')
on conflict (number) do nothing;
