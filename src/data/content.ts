export const images = {
  hero: "/images/hero-album.jpg",
  collection: "/images/collection-graduates.jpg",
  noir: "/images/album-noir.jpg",
  ivory: "/images/album-ivory.jpg",
  slate: "/images/album-slate.jpg",
  stone: "/images/album-stone.jpg",
  open: "/images/album-open.jpg",
  detail: "/images/album-detail.jpg",
  campus: "/images/work-campus.jpg",
  studio: "/images/work-studio.jpg",
} as const;

export const imageDescriptions: Record<string, string> = {
  [images.noir]: "Charcoal cloth hardcover graduation album",
  [images.ivory]: "Ivory linen hardcover graduation album",
  [images.slate]: "Slate cloth hardcover graduation album",
  [images.stone]: "Stone linen hardcover graduation album",
  [images.open]: "Open graduation album showing portrait page layouts",
  [images.detail]: "Close-up of the album's binding and thick pages",
  [images.campus]: "Graduates photographed together outside their university",
  [images.studio]: "Graduates photographed together in the studio",
  [images.collection]: "Graduating friends walking together on campus",
};

// All "order" CTAs across the site open Telegram — replace with the real Telegram URL.
export const ORDER_TELEGRAM_URL = "https://t.me/YOUR_USERNAME";

// University logo carousel. Drop the uploaded PNG files into public/images/universities/
// using these exact `file` names and they will be used automatically; until a local file
// exists, the official `fallback` artwork is shown (tiles with no available image are hidden).
export type UniversityLogo = { name: string; file: string; fallback?: string };

export const universityLogos: UniversityLogo[] = [
  {
    name: "Central Asian University",
    file: "/images/universities/central-asian-university.png",
  },
  {
    name: "National University of Uzbekistan",
    file: "/images/universities/national-university-uzbekistan.png",
    fallback: "https://commons.wikimedia.org/wiki/Special:FilePath/National%20University%20of%20Uzbekistan%20Logo.png?width=400",
  },
  {
    name: "Pusan National University",
    file: "/images/universities/pusan-national-university.png",
    fallback: "https://upload.wikimedia.org/wikipedia/en/thumb/5/50/Pusan_National_University_logo.svg/330px-Pusan_National_University_logo.svg.png",
  },
  {
    name: "Harvard University",
    file: "/images/universities/harvard-university.png",
    fallback: "https://commons.wikimedia.org/wiki/Special:FilePath/Harvard%20University%20logo.svg?width=600",
  },
  {
    name: "Stanford University",
    file: "/images/universities/stanford-university.png",
    fallback: "https://commons.wikimedia.org/wiki/Special:FilePath/Stanford%20wordmark%20%282012%29.svg?width=600",
  },
];

export type AlbumSeries = "Classic" | "Editorial" | "Signature";

export type Album = {
  slug: string;
  number: string;
  name: string;
  series: AlbumSeries;
  image: string;
  gallery: string[];
  short: string;
  description: string;
  finish: string;
};

export const albums: Album[] = [
  {
    slug: "noir",
    number: "01",
    name: "Noir",
    series: "Classic",
    image: images.noir,
    gallery: [images.noir, images.open, images.detail, images.campus],
    short: "A little less, remembered more.",
    description:
      "A graphic, understated edition with a charcoal cloth cover. A place for every face and every little moment that made the year yours.",
    finish: "Charcoal bookcloth",
  },
  {
    slug: "ivory",
    number: "02",
    name: "Ivory",
    series: "Classic",
    image: images.ivory,
    gallery: [images.ivory, images.detail, images.open, images.studio],
    short: "A softer way to keep it all.",
    description:
      "Warm linen and generous white space give your class story the feeling of a beautifully considered art book.",
    finish: "Ivory woven linen",
  },
  {
    slug: "slate",
    number: "03",
    name: "Slate",
    series: "Editorial",
    image: images.slate,
    gallery: [images.slate, images.open, images.campus, images.detail],
    short: "Quietly modern, unmistakably yours.",
    description:
      "A cool-toned cover and clean editorial layouts make room for portraits, places and the details worth remembering.",
    finish: "Slate cloth hardcover",
  },
  {
    slug: "stone",
    number: "04",
    name: "Stone",
    series: "Editorial",
    image: images.stone,
    gallery: [images.stone, images.open, images.detail, images.collection],
    short: "The beauty of keeping it simple.",
    description:
      "Natural texture and a timeless neutral finish, designed to feel just as relevant years from now as it does today.",
    finish: "Stone linen hardcover",
  },
  {
    slug: "portrait",
    number: "05",
    name: "Portrait",
    series: "Signature",
    image: images.open,
    gallery: [images.open, images.studio, images.campus, images.noir],
    short: "Everyone belongs in the story.",
    description:
      "An image-led edition where individual portraits and the feeling of being together get equal space on the page.",
    finish: "Your choice of cloth cover",
  },
  {
    slug: "archive",
    number: "06",
    name: "Archive",
    series: "Signature",
    image: images.detail,
    gallery: [images.detail, images.open, images.ivory, images.collection],
    short: "Made to revisit, made to last.",
    description:
      "The most tactile expression of your final year, with considered layouts and substantial lay-flat pages.",
    finish: "Premium cloth hardcover",
  },
];

export type WorkCategory = "Campus" | "Studio" | "The album";

export type WorkItem = {
  id: string;
  title: string;
  category: WorkCategory;
  image: string;
  alt: string;
};

export const work: WorkItem[] = [
  {
    id: "together",
    title: "Outside, together",
    category: "Campus",
    image: images.campus,
    alt: "Graduates together on the steps of a university building",
  },
  {
    id: "between-pages",
    title: "Between the pages",
    category: "The album",
    image: images.open,
    alt: "An open yearbook with designed portrait pages",
  },
  {
    id: "last-walk",
    title: "The last walk",
    category: "Campus",
    image: images.collection,
    alt: "Friends in graduation gowns walking on campus",
  },
  {
    id: "in-the-studio",
    title: "In the studio",
    category: "Studio",
    image: images.studio,
    alt: "Two graduates photographed together in a studio",
  },
  {
    id: "the-details",
    title: "The details",
    category: "The album",
    image: images.detail,
    alt: "Close-up of the binding and pages of a graduation album",
  },
  {
    id: "a-place-for-everyone",
    title: "A place for everyone",
    category: "The album",
    image: images.ivory,
    alt: "Ivory cloth graduation album on a studio surface",
  },
];

// Regional contacts shown on the "Where we are" map. Marker positions are
// percentages over the Uzbekistan SVG viewBox and are geographically accurate.
// Replace the placeholder representative/phone/social values with real data;
// add or remove cities here and the map + panel update automatically.
export type Location = {
  city: string;
  markerPosition: { left: string; top: string };
  labelSide?: "left" | "right";
  representativeName: string;
  phone: string;
  instagram: string;
  telegram: string;
};

export const locations: Location[] = [
  {
    city: "Tashkent",
    markerPosition: { left: "75%", top: "51.9%" },
    representativeName: "First Name Last Name",
    phone: "+998 XX XXX XX XX",
    instagram: "@username",
    telegram: "@username",
  },
  {
    city: "Samarkand",
    markerPosition: { left: "62.7%", top: "69.9%" },
    labelSide: "left",
    representativeName: "First Name Last Name",
    phone: "+998 XX XXX XX XX",
    instagram: "@username",
    telegram: "@username",
  },
  {
    city: "Navoi",
    markerPosition: { left: "54.3%", top: "64.8%" },
    labelSide: "left",
    representativeName: "First Name Last Name",
    phone: "+998 XX XXX XX XX",
    instagram: "@username",
    telegram: "@username",
  },
  {
    city: "Nukus",
    markerPosition: { left: "23.8%", top: "39.9%" },
    representativeName: "First Name Last Name",
    phone: "+998 XX XXX XX XX",
    instagram: "@username",
    telegram: "@username",
  },
  {
    city: "Jizzakh",
    markerPosition: { left: "67.4%", top: "64.5%" },
    representativeName: "First Name Last Name",
    phone: "+998 XX XXX XX XX",
    instagram: "@username",
    telegram: "@username",
  },
  {
    city: "Andijan",
    markerPosition: { left: "91.2%", top: "56.5%" },
    labelSide: "left",
    representativeName: "First Name Last Name",
    phone: "+998 XX XXX XX XX",
    instagram: "@username",
    telegram: "@username",
  },
];