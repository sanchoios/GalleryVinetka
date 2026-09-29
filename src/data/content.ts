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
  [images.noir]: "To‘q kulrang matoli qattiq muqovali bitiruv albomi",
  [images.ivory]: "Fil suyagi rangidagi zig‘ir matoli qattiq muqovali bitiruv albomi",
  [images.slate]: "Kulrang matoli qattiq muqovali bitiruv albomi",
  [images.stone]: "Tosh rangidagi zig‘ir matoli qattiq muqovali bitiruv albomi",
  [images.open]: "Portret sahifalari ko‘rinib turgan ochiq bitiruv albomi",
  [images.detail]: "Albom muqovasi va qalin sahifalarining yaqindan ko‘rinishi",
  [images.campus]: "Universitet oldida birga tushgan bitiruvchilar",
  [images.studio]: "Studiyada birga tushgan bitiruvchilar",
  [images.collection]: "Kampusda birga ketayotgan bitiruvchi do‘stlar",
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
    short: "Kamroq — lekin ko‘proq esda qolarli.",
    description:
      "To‘q kulrang matoli muqovali, vazmin va uslubli nashr. Har bir yuz va yilni sizniki qilgan har bir kichik lahza uchun joy bor.",
    finish: "To‘q kulrang matoli muqova",
  },
  {
    slug: "ivory",
    number: "02",
    name: "Ivory",
    series: "Classic",
    image: images.ivory,
    gallery: [images.ivory, images.detail, images.open, images.studio],
    short: "Hamma xotirani yumshoqroq saqlash usuli.",
    description:
      "Issiq zig‘ir matosi va keng oq joylar sinfingiz tarixiga chiroyli o‘ylangan san’at kitobi tusini beradi.",
    finish: "Fil suyagi rangidagi to‘qima zig‘ir mato",
  },
  {
    slug: "slate",
    number: "03",
    name: "Slate",
    series: "Editorial",
    image: images.slate,
    gallery: [images.slate, images.open, images.campus, images.detail],
    short: "Vazmin zamonaviylik — aynan sizniki.",
    description:
      "Sovuq ohangdagi muqova va silliq jurnal uslubidagi sahifalar portretlar, joylar va esda qolarli detallar uchun joy yaratadi.",
    finish: "Kulrang matoli qattiq muqova",
  },
  {
    slug: "stone",
    number: "04",
    name: "Stone",
    series: "Editorial",
    image: images.stone,
    gallery: [images.stone, images.open, images.detail, images.collection],
    short: "Oddiylikning o‘ziga xos go‘zalligi.",
    description:
      "Tabiiy mato va hech qachon eskirmaydigan neytral rang — yillar o‘tib ham bugungidek dolzarb ko‘rinadi.",
    finish: "Tosh rangidagi zig‘ir matoli qattiq muqova",
  },
  {
    slug: "portrait",
    number: "05",
    name: "Portrait",
    series: "Signature",
    image: images.open,
    gallery: [images.open, images.studio, images.campus, images.noir],
    short: "Bu hikoyada hamma bor.",
    description:
      "Suratlarga urg‘u berilgan nashr — yakka portretlar va birga bo‘lish hissiga sahifada teng joy ajratilgan.",
    finish: "Matoli muqovani o‘zingiz tanlaysiz",
  },
  {
    slug: "archive",
    number: "06",
    name: "Archive",
    series: "Signature",
    image: images.detail,
    gallery: [images.detail, images.open, images.ivory, images.collection],
    short: "Qayta varaqlash uchun, uzoq yashash uchun.",
    description:
      "So‘nggi yilingizning eng boy ifodasi — puxta o‘ylangan sahifalar va qalin, tekis ochiladigan qog‘oz bilan.",
    finish: "Premium matoli qattiq muqova",
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
    title: "Tashqarida, birga",
    category: "Campus",
    image: images.campus,
    alt: "Universitet binosi zinapoyasida birga turgan bitiruvchilar",
  },
  {
    id: "between-pages",
    title: "Sahifalar orasida",
    category: "The album",
    image: images.open,
    alt: "Dizayn qilingan portret sahifali ochiq bitiruv albomi",
  },
  {
    id: "last-walk",
    title: "So‘nggi sayr",
    category: "Campus",
    image: images.collection,
    alt: "Kampusda mantiyada ketayotgan do‘stlar",
  },
  {
    id: "in-the-studio",
    title: "Studiyada",
    category: "Studio",
    image: images.studio,
    alt: "Studiyada birga suratga tushgan ikki bitiruvchi",
  },
  {
    id: "the-details",
    title: "Mayda detallar",
    category: "The album",
    image: images.detail,
    alt: "Bitiruv albomi muqovasi va sahifalarining yaqindan ko‘rinishi",
  },
  {
    id: "a-place-for-everyone",
    title: "Hamma uchun joy bor",
    category: "The album",
    image: images.ivory,
    alt: "Studiyada turgan fil suyagi rangidagi matoli bitiruv albomi",
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
    city: "Toshkent",
    markerPosition: { left: "75%", top: "51.9%" },
    representativeName: "Ism Familiya",
    phone: "+998 XX XXX XX XX",
    instagram: "@username",
    telegram: "@username",
  },
  {
    city: "Samarqand",
    markerPosition: { left: "62.7%", top: "69.9%" },
    labelSide: "left",
    representativeName: "Ism Familiya",
    phone: "+998 XX XXX XX XX",
    instagram: "@username",
    telegram: "@username",
  },
  {
    city: "Navoiy",
    markerPosition: { left: "54.3%", top: "64.8%" },
    labelSide: "left",
    representativeName: "Ism Familiya",
    phone: "+998 XX XXX XX XX",
    instagram: "@username",
    telegram: "@username",
  },
  {
    city: "Nukus",
    markerPosition: { left: "23.8%", top: "39.9%" },
    representativeName: "Ism Familiya",
    phone: "+998 XX XXX XX XX",
    instagram: "@username",
    telegram: "@username",
  },
  {
    city: "Jizzax",
    markerPosition: { left: "67.4%", top: "64.5%" },
    representativeName: "Ism Familiya",
    phone: "+998 XX XXX XX XX",
    instagram: "@username",
    telegram: "@username",
  },
  {
    city: "Andijon",
    markerPosition: { left: "91.2%", top: "56.5%" },
    labelSide: "left",
    representativeName: "Ism Familiya",
    phone: "+998 XX XXX XX XX",
    instagram: "@username",
    telegram: "@username",
  },
];