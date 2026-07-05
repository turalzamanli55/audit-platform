-- FEATURE-REVIEW-002: Production completion — item priority/due_date, comment threading, resolved state

ALTER TABLE public.review_items
  ADD COLUMN IF NOT EXISTS priority text,
  ADD COLUMN IF NOT EXISTS due_date timestamptz;

ALTER TABLE public.review_comments
  ADD COLUMN IF NOT EXISTS parent_comment_id uuid REFERENCES public.review_comments (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS review_item_id uuid REFERENCES public.review_items (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS mentions jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS attachment_metadata jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS resolved_at timestamptz,
  ADD COLUMN IF NOT EXISTS resolved_by uuid REFERENCES auth.users (id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS review_items_priority_idx ON public.review_items (priority);
CREATE INDEX IF NOT EXISTS review_items_due_date_idx ON public.review_items (due_date);
CREATE INDEX IF NOT EXISTS review_comments_parent_id_idx ON public.review_comments (parent_comment_id);
CREATE INDEX IF NOT EXISTS review_comments_item_id_idx ON public.review_comments (review_item_id);
