-- Initial content matching the current public website.
-- Safe to re-run: inserts only missing rows and never overwrites later owner edits.

insert into public.album_categories (id, name, slug, sort_order) values
  ('11111111-1111-4111-8111-111111111111', 'Classic', 'classic', 0),
  ('22222222-2222-4222-8222-222222222222', 'Editorial', 'editorial', 1),
  ('33333333-3333-4333-8333-333333333333', 'Signature', 'signature', 2)
on conflict (slug) do nothing;

insert into public.albums (
  id, slug, name, category_id, edition_number, short_text, description, finish,
  price_uzs, price_label, cover_url, published, sort_order
) values
  ('a1111111-1111-4111-8111-111111111111', 'noir', 'Noir', '11111111-1111-4111-8111-111111111111', '01',
   'A little less, remembered more.',
   'A graphic, understated edition with a charcoal cloth cover. A place for every face and every little moment that made the year yours.',
   'Charcoal bookcloth', 950000, '/ student', '/images/album-noir.jpg', true, 0),
  ('a2222222-2222-4222-8222-222222222222', 'ivory', 'Ivory', '11111111-1111-4111-8111-111111111111', '02',
   'A softer way to keep it all.',
   'Warm linen and generous white space give your class story the feeling of a beautifully considered art book.',
   'Ivory woven linen', 950000, '/ student', '/images/album-ivory.jpg', true, 1),
  ('a3333333-3333-4333-8333-333333333333', 'slate', 'Slate', '22222222-2222-4222-8222-222222222222', '03',
   'Quietly modern, unmistakably yours.',
   'A cool-toned cover and clean editorial layouts make room for portraits, places and the details worth remembering.',
   'Slate cloth hardcover', 950000, '/ student', '/images/album-slate.jpg', true, 2),
  ('a4444444-4444-4444-8444-444444444444', 'stone', 'Stone', '22222222-2222-4222-8222-222222222222', '04',
   'The beauty of keeping it simple.',
   'Natural texture and a timeless neutral finish, designed to feel just as relevant years from now as it does today.',
   'Stone linen hardcover', 950000, '/ student', '/images/album-stone.jpg', true, 3),
  ('a5555555-5555-4555-8555-555555555555', 'portrait', 'Portrait', '33333333-3333-4333-8333-333333333333', '05',
   'Everyone belongs in the story.',
   'An image-led edition where individual portraits and the feeling of being together get equal space on the page.',
   'Your choice of cloth cover', 950000, '/ student', '/images/album-open.jpg', true, 4),
  ('a6666666-6666-4666-8666-666666666666', 'archive', 'Archive', '33333333-3333-4333-8333-333333333333', '06',
   'Made to revisit, made to last.',
   'The most tactile expression of your final year, with considered layouts and substantial lay-flat pages.',
   'Premium cloth hardcover', 950000, '/ student', '/images/album-detail.jpg', true, 5)
on conflict (slug) do nothing;

insert into public.album_images (id, album_id, url, alt, sort_order) values
  ('b1111111-0001-4000-8000-000000000001', 'a1111111-1111-4111-8111-111111111111', '/images/album-noir.jpg', 'Charcoal cloth hardcover graduation album', 0),
  ('b1111111-0002-4000-8000-000000000002', 'a1111111-1111-4111-8111-111111111111', '/images/album-open.jpg', 'Open graduation album showing portrait page layouts', 1),
  ('b1111111-0003-4000-8000-000000000003', 'a1111111-1111-4111-8111-111111111111', '/images/album-detail.jpg', 'Close-up of the album''s binding and thick pages', 2),
  ('b1111111-0004-4000-8000-000000000004', 'a1111111-1111-4111-8111-111111111111', '/images/work-campus.jpg', 'Graduates photographed together outside their university', 3),
  ('b2222222-0001-4000-8000-000000000001', 'a2222222-2222-4222-8222-222222222222', '/images/album-ivory.jpg', 'Ivory linen hardcover graduation album', 0),
  ('b2222222-0002-4000-8000-000000000002', 'a2222222-2222-4222-8222-222222222222', '/images/album-detail.jpg', 'Close-up of the album''s binding and thick pages', 1),
  ('b2222222-0003-4000-8000-000000000003', 'a2222222-2222-4222-8222-222222222222', '/images/album-open.jpg', 'Open graduation album showing portrait page layouts', 2),
  ('b2222222-0004-4000-8000-000000000004', 'a2222222-2222-4222-8222-222222222222', '/images/work-studio.jpg', 'Graduates photographed together in the studio', 3),
  ('b3333333-0001-4000-8000-000000000001', 'a3333333-3333-4333-8333-333333333333', '/images/album-slate.jpg', 'Slate cloth hardcover graduation album', 0),
  ('b3333333-0002-4000-8000-000000000002', 'a3333333-3333-4333-8333-333333333333', '/images/album-open.jpg', 'Open graduation album showing portrait page layouts', 1),
  ('b3333333-0003-4000-8000-000000000003', 'a3333333-3333-4333-8333-333333333333', '/images/work-campus.jpg', 'Graduates photographed together outside their university', 2),
  ('b3333333-0004-4000-8000-000000000004', 'a3333333-3333-4333-8333-333333333333', '/images/album-detail.jpg', 'Close-up of the album''s binding and thick pages', 3),
  ('b4444444-0001-4000-8000-000000000001', 'a4444444-4444-4444-8444-444444444444', '/images/album-stone.jpg', 'Stone linen hardcover graduation album', 0),
  ('b4444444-0002-4000-8000-000000000002', 'a4444444-4444-4444-8444-444444444444', '/images/album-open.jpg', 'Open graduation album showing portrait page layouts', 1),
  ('b4444444-0003-4000-8000-000000000003', 'a4444444-4444-4444-8444-444444444444', '/images/album-detail.jpg', 'Close-up of the album''s binding and thick pages', 2),
  ('b4444444-0004-4000-8000-000000000004', 'a4444444-4444-4444-8444-444444444444', '/images/collection-graduates.jpg', 'Graduating friends walking together on campus', 3),
  ('b5555555-0001-4000-8000-000000000001', 'a5555555-5555-4555-8555-555555555555', '/images/album-open.jpg', 'Open graduation album showing portrait page layouts', 0),
  ('b5555555-0002-4000-8000-000000000002', 'a5555555-5555-4555-8555-555555555555', '/images/work-studio.jpg', 'Graduates photographed together in the studio', 1),
  ('b5555555-0003-4000-8000-000000000003', 'a5555555-5555-4555-8555-555555555555', '/images/work-campus.jpg', 'Graduates photographed together outside their university', 2),
  ('b5555555-0004-4000-8000-000000000004', 'a5555555-5555-4555-8555-555555555555', '/images/album-noir.jpg', 'Charcoal cloth hardcover graduation album', 3),
  ('b6666666-0001-4000-8000-000000000001', 'a6666666-6666-4666-8666-666666666666', '/images/album-detail.jpg', 'Close-up of the album''s binding and thick pages', 0),
  ('b6666666-0002-4000-8000-000000000002', 'a6666666-6666-4666-8666-666666666666', '/images/album-open.jpg', 'Open graduation album showing portrait page layouts', 1),
  ('b6666666-0003-4000-8000-000000000003', 'a6666666-6666-4666-8666-666666666666', '/images/album-ivory.jpg', 'Ivory linen hardcover graduation album', 2),
  ('b6666666-0004-4000-8000-000000000004', 'a6666666-6666-4666-8666-666666666666', '/images/collection-graduates.jpg', 'Graduating friends walking together on campus', 3)
on conflict (id) do nothing;

insert into public.work_items (id, title, category, image_url, alt, published, sort_order) values
  ('c1111111-1111-4111-8111-111111111111', 'Outside, together', 'Campus', '/images/work-campus.jpg', 'Graduates together on the steps of a university building', true, 0),
  ('c2222222-2222-4222-8222-222222222222', 'Between the pages', 'The album', '/images/album-open.jpg', 'An open yearbook with designed portrait pages', true, 1),
  ('c3333333-3333-4333-8333-333333333333', 'The last walk', 'Campus', '/images/collection-graduates.jpg', 'Friends in graduation gowns walking on campus', true, 2),
  ('c4444444-4444-4444-8444-444444444444', 'In the studio', 'Studio', '/images/work-studio.jpg', 'Two graduates photographed together in a studio', true, 3),
  ('c5555555-5555-4555-8555-555555555555', 'The details', 'The album', '/images/album-detail.jpg', 'Close-up of the binding and pages of a graduation album', true, 4),
  ('c6666666-6666-4666-8666-666666666666', 'A place for everyone', 'The album', '/images/album-ivory.jpg', 'Ivory cloth graduation album on a studio surface', true, 5)
on conflict (id) do nothing;

insert into public.client_logos (id, name, image_url, fallback_url, published, sort_order) values
  ('d1111111-1111-4111-8111-111111111111', 'Central Asian University', '/images/universities/central-asian-university.png', null, true, 0),
  ('d2222222-2222-4222-8222-222222222222', 'National University of Uzbekistan', '/images/universities/national-university-uzbekistan.png', 'https://commons.wikimedia.org/wiki/Special:FilePath/National%20University%20of%20Uzbekistan%20Logo.png?width=400', true, 1),
  ('d3333333-3333-4333-8333-333333333333', 'Pusan National University', '/images/universities/pusan-national-university.png', 'https://upload.wikimedia.org/wikipedia/en/thumb/5/50/Pusan_National_University_logo.svg/330px-Pusan_National_University_logo.svg.png', true, 2),
  ('d4444444-4444-4444-8444-444444444444', 'Harvard University', '/images/universities/harvard-university.png', 'https://commons.wikimedia.org/wiki/Special:FilePath/Harvard%20University%20logo.svg?width=600', true, 3),
  ('d5555555-5555-4555-8555-555555555555', 'Stanford University', '/images/universities/stanford-university.png', 'https://commons.wikimedia.org/wiki/Special:FilePath/Stanford%20wordmark%20%282012%29.svg?width=600', true, 4)
on conflict (id) do nothing;

insert into public.locations (id, city, representative_name, phone, instagram, telegram, marker_left, marker_top, label_side, published, sort_order) values
  ('e1111111-1111-4111-8111-111111111111', 'Tashkent', 'First Name Last Name', '+998 XX XXX XX XX', '@username', '@username', '75%', '51.9%', 'right', true, 0),
  ('e2222222-2222-4222-8222-222222222222', 'Samarkand', 'First Name Last Name', '+998 XX XXX XX XX', '@username', '@username', '62.7%', '69.9%', 'left', true, 1),
  ('e3333333-3333-4333-8333-333333333333', 'Navoi', 'First Name Last Name', '+998 XX XXX XX XX', '@username', '@username', '54.3%', '64.8%', 'left', true, 2),
  ('e4444444-4444-4444-8444-444444444444', 'Nukus', 'First Name Last Name', '+998 XX XXX XX XX', '@username', '@username', '23.8%', '39.9%', 'right', true, 3),
  ('e5555555-5555-4555-8555-555555555555', 'Jizzakh', 'First Name Last Name', '+998 XX XXX XX XX', '@username', '@username', '67.4%', '64.5%', 'right', true, 4),
  ('e6666666-6666-4666-8666-666666666666', 'Andijan', 'First Name Last Name', '+998 XX XXX XX XX', '@username', '@username', '91.2%', '56.5%', 'left', true, 5)
on conflict (city) do nothing;

insert into public.site_settings (
  id, brand_name, brand_descriptor, footer_text, footer_tagline, contact_email, telegram_url,
  meta_title_home, meta_description_home, meta_title_catalog, meta_description_catalog,
  meta_title_work, meta_description_work, meta_title_contact, meta_description_contact,
  hero_image_url, hero_title, hero_subtitle, hero_button_text, hero_button_link,
  albums_heading, albums_button_text, clients_heading, work_kicker, work_heading, work_button_text,
  location_kicker, location_heading, location_description, contact_kicker, contact_heading, contact_intro
) values (
  'main', 'FOLIO', 'YEARBOOK STUDIO', 'For the years that made you.', 'MADE TO BE KEPT.',
  'hello@folioyearbooks.com', 'https://t.me/YOUR_USERNAME',
  'FOLIO | Graduation albums made to be kept',
  'FOLIO creates considered graduation albums and yearbooks for the years that made you.',
  'The collection | FOLIO', 'Explore FOLIO graduation album editions.',
  'Our work | FOLIO', 'Photography from FOLIO yearbook sessions.',
  'Start an order | FOLIO', 'Get in touch with FOLIO Yearbook Studio.',
  '/images/hero-album.jpg', 'FOLIO.', E'Yearbooks for the years\nthat made you.',
  'Explore the albums', '/catalog',
  'Albums', 'View full album', 'Our Clients', '02 / THE WORK', 'Our Work', 'Explore our work',
  '03 / WHERE WE ARE', 'Here for your class.', 'Select your city on the map to see who to contact.',
  'START YOUR STORY / CONTACT', E'Let''s make\nit yours.',
  'Tell us a little about your class. We will help you find the right edition and plan the photography around you.'
)
on conflict (id) do nothing;
