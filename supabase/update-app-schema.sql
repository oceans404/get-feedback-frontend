-- Alter the app_ids table to add new fields
ALTER TABLE public.app_ids 
ADD COLUMN IF NOT EXISTS domain TEXT,
ADD COLUMN IF NOT EXISTS schema_id UUID,
ADD COLUMN IF NOT EXISTS config JSONB DEFAULT '{
  "title": "Blind Feedback",
  "successMessage": "Thanks for providing feedback to improve our product!",
  "buttonText": "Send Feedback",
  "buttonStyle": "dark",
  "showRating": true,
  "ratingQuestion": "Do you like this product?",
  "requireEmail": false,
  "emailPlaceholder": "your@email.com",
  "messagePlaceholder": "Tell us how we can improve",
  "highlightColor": "black"
}'::jsonb;

-- Update existing records to have default values
UPDATE public.app_ids
SET 
  domain = COALESCE(domain, CONCAT(app_id, '.example.com')),
  schema_id = COALESCE(schema_id, 'ddfb143f-d234-4787-9684-a7f1f660ebf8'::uuid),
  config = COALESCE(config, '{
    "title": "Blind Feedback",
    "successMessage": "Thanks for providing feedback to improve our product!",
    "buttonText": "Send Feedback",
    "buttonStyle": "dark",
    "showRating": true,
    "ratingQuestion": "Do you like this product?",
    "requireEmail": false,
    "emailPlaceholder": "your@email.com",
    "messagePlaceholder": "Tell us how we can improve",
    "highlightColor": "black"
  }'::jsonb);
