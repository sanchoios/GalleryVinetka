export type AlbumCategory = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
};

export type AlbumImage = {
  id: string;
  album_id: string;
  url: string;
  storage_path: string | null;
  alt: string;
  sort_order: number;
};

export type Album = {
  id: string;
  slug: string;
  name: string;
  category_id: string | null;
  series: string;
  number: string;
  short: string;
  description: string;
  finish: string;
  price_uzs: number;
  price_label: string;
  cover_url: string;
  telegram_url: string | null;
  published: boolean;
  sort_order: number;
  gallery: AlbumImage[];
};

export type WorkItem = {
  id: string;
  title: string;
  category: string;
  image_url: string;
  storage_path: string | null;
  alt: string;
  published: boolean;
  sort_order: number;
};

export type ClientLogo = {
  id: string;
  name: string;
  image_url: string;
  fallback_url: string | null;
  storage_path: string | null;
  published: boolean;
  sort_order: number;
};

export type Location = {
  id: string;
  city: string;
  representative_name: string;
  phone: string;
  instagram: string;
  telegram: string;
  marker_left: string;
  marker_top: string;
  label_side: "left" | "right";
  published: boolean;
  sort_order: number;
};

export type SiteSettings = {
  id: string;
  brand_name: string;
  brand_descriptor: string;
  footer_text: string;
  footer_tagline: string;
  contact_email: string;
  telegram_url: string;
  instagram_url: string;
  logo_url: string;
  meta_title_home: string;
  meta_description_home: string;
  meta_title_catalog: string;
  meta_description_catalog: string;
  meta_title_work: string;
  meta_description_work: string;
  meta_title_contact: string;
  meta_description_contact: string;
  hero_image_url: string;
  hero_title: string;
  hero_subtitle: string;
  hero_button_text: string;
  hero_button_link: string;
  albums_heading: string;
  albums_button_text: string;
  clients_heading: string;
  work_kicker: string;
  work_heading: string;
  work_button_text: string;
  location_kicker: string;
  location_heading: string;
  location_description: string;
  contact_kicker: string;
  contact_heading: string;
  contact_intro: string;
};

export type PublicContent = {
  albums: Album[];
  categories: AlbumCategory[];
  work: WorkItem[];
  logos: ClientLogo[];
  locations: Location[];
  settings: SiteSettings;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  id: "main",
  brand_name: "FOLIO",
  brand_descriptor: "YEARBOOK STUDIO",
  footer_text: "For the years that made you.",
  footer_tagline: "MADE TO BE KEPT.",
  contact_email: "hello@folioyearbooks.com",
  telegram_url: "https://t.me/YOUR_USERNAME",
  instagram_url: "",
  logo_url: "",
  meta_title_home: "FOLIO | Graduation albums made to be kept",
  meta_description_home: "FOLIO creates considered graduation albums and yearbooks for the years that made you.",
  meta_title_catalog: "The collection | FOLIO",
  meta_description_catalog: "Explore FOLIO graduation album editions.",
  meta_title_work: "Our work | FOLIO",
  meta_description_work: "Photography from FOLIO yearbook sessions.",
  meta_title_contact: "Start an order | FOLIO",
  meta_description_contact: "Get in touch with FOLIO Yearbook Studio.",
  hero_image_url: "/images/hero-album.jpg",
  hero_title: "FOLIO.",
  hero_subtitle: "Yearbooks for the years\nthat made you.",
  hero_button_text: "Explore the albums",
  hero_button_link: "/catalog",
  albums_heading: "Albums",
  albums_button_text: "View full album",
  clients_heading: "Our Clients",
  work_kicker: "02 / THE WORK",
  work_heading: "Our Work",
  work_button_text: "Explore our work",
  location_kicker: "03 / WHERE WE ARE",
  location_heading: "Here for your class.",
  location_description: "Select your city on the map to see who to contact.",
  contact_kicker: "START YOUR STORY / CONTACT",
  contact_heading: "Let's make\nit yours.",
  contact_intro: "Tell us a little about your class. We will help you find the right edition and plan the photography around you.",
};
