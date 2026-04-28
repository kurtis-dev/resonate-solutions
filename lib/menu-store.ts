import { getSql } from "@/lib/db";

type Row = Record<string, unknown>;

export type MenuItem = {
  id: string;
  sectionId?: string | null;
  name: string;
  description?: string | null;
  price?: string | null;
  imageUrl?: string | null;
  badge?: string | null;
  isSoldOut: boolean;
  sortOrder: number;
};

export type MenuSection = {
  id: string;
  name: string;
  sortOrder: number;
};

export type MenuBusiness = {
  id: string;
  slug: string;
  businessName: string;
  businessType: string;
  description?: string | null;
  city?: string | null;
  statusNote?: string | null;
  hoursSummary?: string | null;
  locationSummary?: string | null;
  address?: string | null;
  orderingUrl?: string | null;
  reviewUrl?: string | null;
  instagramUrl?: string | null;
  phone?: string | null;
  heroImageUrl?: string | null;
  isPublished: boolean;
  sections: MenuSection[];
  items: MenuItem[];
};

export type MenuBusinessSummary = Pick<MenuBusiness, "slug" | "businessName" | "businessType" | "city" | "isPublished"> & {
  itemCount: number;
};

export type MenuItemQuestion = {
  businessSlug: string;
  businessName: string;
  itemId?: string;
  itemName: string;
  customerName?: string;
  customerEmail?: string;
  comment: string;
};

const demoBusiness: MenuBusiness = {
  id: "demo-food-truck",
  slug: "demo-food-truck",
  businessName: "Ozark Street Kitchen",
  businessType: "Food truck",
  description: "A sample customer menu page showing how food, hours, location, links, and updates come together from one QR code.",
  city: "Bentonville, AR",
  statusNote: "Hot honey biscuits are limited today.",
  hoursSummary: "Open today, 11 AM to 2 PM",
  locationSummary: "Bentonville Square, near the south entrance",
  address: "Bentonville Square, Bentonville, AR",
  orderingUrl: "https://example.com/order",
  reviewUrl: "https://example.com/review",
  instagramUrl: "https://example.com/instagram",
  phone: "(479) 555-0142",
  heroImageUrl: "/assets/menu-photo-bowl.svg",
  isPublished: true,
  sections: [
    { id: "demo-specials", name: "Today specials", sortOrder: 0 },
    { id: "demo-bowls", name: "Bowls", sortOrder: 1 },
    { id: "demo-drinks", name: "Drinks", sortOrder: 2 }
  ],
  items: [
    {
      id: "demo-1",
      sectionId: "demo-specials",
      name: "Hot Honey Biscuit",
      description: "Crispy chicken, local honey, pepper butter, and a soft buttermilk biscuit.",
      price: "$7",
      imageUrl: "/assets/menu-photo-biscuit.svg",
      badge: "2 left",
      isSoldOut: false,
      sortOrder: 0
    },
    {
      id: "demo-2",
      sectionId: "demo-specials",
      name: "Smoked Chicken Bowl",
      description: "Rice, greens, corn salsa, pickled onion, smoked chicken, and house sauce.",
      price: "$12",
      imageUrl: "/assets/menu-photo-bowl.svg",
      badge: "Popular",
      isSoldOut: false,
      sortOrder: 1
    },
    {
      id: "demo-3",
      sectionId: "demo-bowls",
      name: "Veggie Market Bowl",
      description: "Roasted seasonal vegetables, rice, greens, toasted seeds, and herb dressing.",
      price: "$10",
      imageUrl: "/assets/menu-photo-bowl.svg",
      badge: "Vegetarian",
      isSoldOut: false,
      sortOrder: 2
    },
    {
      id: "demo-4",
      sectionId: "demo-bowls",
      name: "Smoked Chicken Bowl",
      description: "A larger bowl with extra smoked chicken, corn salsa, pickled onion, and sauce.",
      price: "$12",
      imageUrl: "/assets/menu-photo-bowl.svg",
      badge: null,
      isSoldOut: true,
      sortOrder: 3
    },
    {
      id: "demo-5",
      sectionId: "demo-drinks",
      name: "Seasonal Lemonade",
      description: "Blackberry, basil, and fresh lemon over ice.",
      price: "$4",
      imageUrl: "/assets/menu-photo-lemonade.svg",
      badge: "New",
      isSoldOut: false,
      sortOrder: 4
    },
    {
      id: "demo-6",
      sectionId: "demo-drinks",
      name: "Sweet Tea",
      description: "House brewed black tea, lightly sweetened, served cold.",
      price: "$3",
      imageUrl: "/assets/menu-photo-lemonade.svg",
      badge: null,
      isSoldOut: false,
      sortOrder: 5
    }
  ]
};

const burgerTruckPreview: MenuBusiness = {
  id: "burger-truck-preview",
  slug: "burger-truck-preview",
  businessName: "Siloam Burger Truck Preview",
  businessType: "Food truck preview",
  description: "A permission-safe preview built for a real burger truck workflow: current menu, item photos, hours, location, QR sharing, and easy customer questions.",
  city: "Siloam Springs, AR",
  statusNote: "Preview mode: ready to swap in the approved business name, photos, links, and exact menu.",
  hoursSummary: "Sample hours: lunch and dinner service",
  locationSummary: "Sample location: Siloam Springs service area",
  address: "Siloam Springs, AR",
  orderingUrl: "https://example.com/order",
  reviewUrl: "https://example.com/review",
  instagramUrl: "https://example.com/instagram",
  phone: "(479) 555-0199",
  heroImageUrl: "/assets/menu-photo-burger.svg",
  isPublished: true,
  sections: [
    { id: "burger-signature", name: "Signature burgers", sortOrder: 0 },
    { id: "burger-sides", name: "Sides", sortOrder: 1 },
    { id: "burger-drinks", name: "Drinks", sortOrder: 2 }
  ],
  items: [
    {
      id: "burger-1",
      sectionId: "burger-signature",
      name: "Classic Smash Burger",
      description: "Crispy-edge beef patty, cheese, pickles, onions, and house sauce on a toasted bun.",
      price: "$9",
      imageUrl: "/assets/menu-photo-burger.svg",
      badge: "Best seller",
      isSoldOut: false,
      sortOrder: 0
    },
    {
      id: "burger-2",
      sectionId: "burger-signature",
      name: "Double Stack",
      description: "Two smashed patties, double cheese, pickles, grilled onions, and house sauce.",
      price: "$12",
      imageUrl: "/assets/menu-photo-burger.svg",
      badge: "Hungry pick",
      isSoldOut: false,
      sortOrder: 1
    },
    {
      id: "burger-3",
      sectionId: "burger-signature",
      name: "Spicy Jam Burger",
      description: "Smash patty, pepper cheese, jalapeno jam, crisp onion, and creamy sauce.",
      price: "$11",
      imageUrl: "/assets/menu-photo-burger.svg",
      badge: "Limited",
      isSoldOut: false,
      sortOrder: 2
    },
    {
      id: "burger-4",
      sectionId: "burger-sides",
      name: "Loaded Truck Fries",
      description: "Crispy fries with cheese, sauce, onions, and a little heat.",
      price: "$7",
      imageUrl: "/assets/menu-photo-fries.svg",
      badge: "Shareable",
      isSoldOut: false,
      sortOrder: 3
    },
    {
      id: "burger-5",
      sectionId: "burger-sides",
      name: "Seasoned Fries",
      description: "Golden fries tossed with house seasoning.",
      price: "$4",
      imageUrl: "/assets/menu-photo-fries.svg",
      badge: null,
      isSoldOut: false,
      sortOrder: 4
    },
    {
      id: "burger-6",
      sectionId: "burger-drinks",
      name: "Craft Lemonade",
      description: "Fresh lemon over ice with a rotating fruit flavor.",
      price: "$4",
      imageUrl: "/assets/menu-photo-lemonade.svg",
      badge: "Rotates",
      isSoldOut: false,
      sortOrder: 5
    }
  ]
};

const demoBusinesses = [demoBusiness, burgerTruckPreview];

function text(row: Row, key: string) {
  const value = row[key];
  return value === null || value === undefined ? null : String(value);
}

function booleanValue(row: Row, key: string) {
  return row[key] === true;
}

function numberValue(row: Row, key: string) {
  const raw = row[key];
  return typeof raw === "number" ? raw : Number(raw || 0);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
}

export function publicMenuUrl(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://resonate.solutions";
  return `${baseUrl.replace(/\/$/, "")}/m/${slug}`;
}

export async function getMenuBusiness(slug: string) {
  const localDemo = demoBusinesses.find((business) => business.slug === slug);

  if (localDemo) {
    return localDemo;
  }

  const sql = await getSql();

  if (!sql) {
    return null;
  }

  const businesses = (await sql`
    select *
    from businesses
    where slug = ${slug}
    limit 1
  `) as Row[];

  if (!businesses[0] || !booleanValue(businesses[0], "is_published")) {
    return null;
  }

  return hydrateBusiness(businesses[0]);
}

export async function listMenuBusinesses() {
  const sql = await getSql();

  if (!sql) {
    return null;
  }

  const rows = (await sql`
    select
      b.slug,
      b.business_name,
      b.business_type,
      b.city,
      b.is_published,
      count(mi.id)::int as item_count
    from businesses b
    left join menu_items mi on mi.business_id = b.id
    group by b.id
    order by b.updated_at desc
    limit 50
  `) as Row[];

  return rows.map((row) => ({
    slug: text(row, "slug") || "",
    businessName: text(row, "business_name") || "",
    businessType: text(row, "business_type") || "",
    city: text(row, "city"),
    isPublished: booleanValue(row, "is_published"),
    itemCount: numberValue(row, "item_count")
  }));
}

async function hydrateBusiness(row: Row): Promise<MenuBusiness> {
  const sql = await getSql();
  const businessId = text(row, "id") || "";

  if (!sql) {
    throw new Error("Database is not connected.");
  }

  const [sections, items] = await Promise.all([
    sql`
      select *
      from menu_sections
      where business_id = ${businessId}
      order by sort_order asc, name asc
    ` as Promise<Row[]>,
    sql`
      select *
      from menu_items
      where business_id = ${businessId}
      order by sort_order asc, name asc
    ` as Promise<Row[]>
  ]);

  return {
    id: businessId,
    slug: text(row, "slug") || "",
    businessName: text(row, "business_name") || "",
    businessType: text(row, "business_type") || "",
    description: text(row, "description"),
    city: text(row, "city"),
    statusNote: text(row, "status_note"),
    hoursSummary: text(row, "hours_summary"),
    locationSummary: text(row, "location_summary"),
    address: text(row, "address"),
    orderingUrl: text(row, "ordering_url"),
    reviewUrl: text(row, "review_url"),
    instagramUrl: text(row, "instagram_url"),
    phone: text(row, "phone"),
    heroImageUrl: text(row, "hero_image_url"),
    isPublished: booleanValue(row, "is_published"),
    sections: sections.map((section) => ({
      id: text(section, "id") || "",
      name: text(section, "name") || "",
      sortOrder: numberValue(section, "sort_order")
    })),
    items: items.map((item) => ({
      id: text(item, "id") || "",
      sectionId: text(item, "section_id"),
      name: text(item, "name") || "",
      description: text(item, "description"),
      price: text(item, "price"),
      imageUrl: text(item, "image_url"),
      badge: text(item, "badge"),
      isSoldOut: booleanValue(item, "is_sold_out"),
      sortOrder: numberValue(item, "sort_order")
    }))
  };
}

function parseMenuItems(raw: string) {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [name, price, description, badge] = line.split("|").map((part) => part.trim());

      return {
        id: crypto.randomUUID(),
        name: name || `Menu item ${index + 1}`,
        price: price || null,
        description: description || null,
        badge: badge || null,
        sortOrder: index
      };
    });
}

export async function createMenuBusiness(formData: FormData) {
  const sql = await getSql();

  if (!sql) {
    return { ok: false, reason: "missing-db" };
  }

  const businessName = String(formData.get("businessName") || "").trim();
  const requestedSlug = String(formData.get("slug") || "").trim();
  const slug = slugify(requestedSlug || businessName);

  if (!businessName || !slug) {
    return { ok: false, reason: "missing-name" };
  }

  const businessId = crypto.randomUUID();
  const sectionId = crypto.randomUUID();
  const menuItems = parseMenuItems(String(formData.get("menuItems") || ""));

  await sql`
    insert into businesses (
      id,
      slug,
      business_name,
      business_type,
      description,
      city,
      status_note,
      hours_summary,
      location_summary,
      address,
      ordering_url,
      review_url,
      instagram_url,
      phone,
      hero_image_url,
      is_published,
      created_at,
      updated_at
    )
    values (
      ${businessId},
      ${slug},
      ${businessName},
      ${String(formData.get("businessType") || "Local business").trim()},
      ${String(formData.get("description") || "").trim() || null},
      ${String(formData.get("city") || "").trim() || null},
      ${String(formData.get("statusNote") || "").trim() || null},
      ${String(formData.get("hoursSummary") || "").trim() || null},
      ${String(formData.get("locationSummary") || "").trim() || null},
      ${String(formData.get("address") || "").trim() || null},
      ${String(formData.get("orderingUrl") || "").trim() || null},
      ${String(formData.get("reviewUrl") || "").trim() || null},
      ${String(formData.get("instagramUrl") || "").trim() || null},
      ${String(formData.get("phone") || "").trim() || null},
      ${String(formData.get("heroImageUrl") || "").trim() || "/assets/menu-photo-bowl.svg"},
      ${formData.get("isPublished") === "on"},
      now(),
      now()
    )
  `;

  await sql`
    insert into menu_sections (id, business_id, name, sort_order)
    values (${sectionId}, ${businessId}, ${String(formData.get("sectionName") || "Menu").trim()}, 0)
  `;

  for (const item of menuItems) {
    await sql`
      insert into menu_items (
        id,
        business_id,
        section_id,
        name,
        description,
        price,
        badge,
        sort_order
      )
      values (
        ${item.id},
        ${businessId},
        ${sectionId},
        ${item.name},
        ${item.description},
        ${item.price},
        ${item.badge},
        ${item.sortOrder}
      )
    `;
  }

  return { ok: true, slug };
}

export async function saveMenuItemQuestion(question: MenuItemQuestion) {
  const sql = await getSql();

  if (!sql) {
    console.info("DATABASE_URL not configured. Menu item question was not persisted.", question);
    return { persisted: false };
  }

  await sql`
    insert into menu_item_questions (
      id,
      created_at,
      business_slug,
      business_name,
      item_id,
      item_name,
      customer_name,
      customer_email,
      comment,
      source
    )
    values (
      ${crypto.randomUUID()},
      now(),
      ${question.businessSlug},
      ${question.businessName},
      ${question.itemId || null},
      ${question.itemName},
      ${question.customerName || null},
      ${question.customerEmail || null},
      ${question.comment},
      'public_menu'
    )
  `;

  return { persisted: true };
}
