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
  activeMenuKey?: string | null;
  brandTheme?: "default" | "mellow-moose";
  description?: string | null;
  city?: string | null;
  statusNote?: string | null;
  popupBanner?: string | null;
  hoursSummary?: string | null;
  locationSummary?: string | null;
  address?: string | null;
  orderingUrl?: string | null;
  reviewUrl?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  phone?: string | null;
  heroImageUrl?: string | null;
  isPublished: boolean;
  sections: MenuSection[];
  items: MenuItem[];
  menuVariants?: MenuVariant[];
};

export type MenuVariant = {
  key: string;
  label: string;
  banner?: string | null;
  orderUrl?: string | null;
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

const mellowMooseBurgers: MenuBusiness = {
  id: "mellow-moose-burgers",
  slug: "mellow-moose-burgers",
  businessName: "Mellow Moose Burgers",
  businessType: "Smash burger restaurant",
  activeMenuKey: "mellow-moose",
  brandTheme: "mellow-moose",
  description: "Smashed fresh beef burgers, loaded fries, salads, kids meals, and rotating specials from Griffin's Food Court in Siloam Springs.",
  city: "Siloam Springs, AR",
  statusNote: "Best of Siloam Springs 2026 Winner: Burger / Local",
  popupBanner: null,
  hoursSummary: "Tue-Fri 11 AM-2 PM & 4-8 PM; Sat 11 AM-5 PM",
  locationSummary: "Griffin's Food Court",
  address: "825 S Mt Olive, Siloam Springs, AR 72761",
  orderingUrl: "https://www.clover.com/online-ordering/dos-gordos-tacos-siloam-springs",
  reviewUrl: "https://www.google.com/search?q=Mellow+Moose+Burgers+reviews",
  facebookUrl: "https://www.facebook.com/profile.php?id=61556196630616",
  instagramUrl: null,
  phone: "(479) 305-2800",
  heroImageUrl: "/assets/mellow-moose-logo.jpg",
  isPublished: true,
  sections: [
    { id: "moose-burgers", name: "Burgers", sortOrder: 0 },
    { id: "moose-fries", name: "Fries", sortOrder: 1 },
    { id: "moose-salads", name: "Salads", sortOrder: 2 },
    { id: "moose-kids", name: "Kid's Menu", sortOrder: 3 },
    { id: "moose-extras", name: "Sides & Extras", sortOrder: 4 },
    { id: "moose-specials", name: "Rotating specials", sortOrder: 5 }
  ],
  items: [
    {
      id: "moose-1",
      sectionId: "moose-burgers",
      name: "The OG Smashburger",
      description: "Beef patty, grilled onions, American cheese, burger sauce, and pickles on a toasted bun.",
      price: "$9.99 / $12.99 with fries",
      imageUrl: "/assets/mellow-moose-og-smashburger.jpg",
      badge: "Local favorite",
      isSoldOut: false,
      sortOrder: 0
    },
    {
      id: "moose-2",
      sectionId: "moose-fries",
      name: "Blazing Moose Fries",
      description: "Fries, nacho cheese sauce, grilled onions, grilled peppers, beef patty, chopped bacon, Smokeshow sauce, and ranch.",
      price: "$13.99",
      imageUrl: "/assets/mellow-moose-blazing-fries.jpg",
      badge: "Best seller",
      isSoldOut: false,
      sortOrder: 1
    },
    {
      id: "moose-3",
      sectionId: "moose-burgers",
      name: "Mellow Moose Cheeseburger",
      description: "Beef patty, cheddar cheese, lettuce, tomato, red onion, pickles, mayonnaise, and mustard on a toasted bun.",
      price: "$8.99 / $11.99 with fries",
      imageUrl: null,
      badge: "Classic",
      isSoldOut: false,
      sortOrder: 2
    },
    {
      id: "moose-4",
      sectionId: "moose-burgers",
      name: "Mellow Moose Bacon Cheeseburger",
      description: "The classic Mellow Moose Cheeseburger with bacon.",
      price: "$9.99 / $12.99 with fries",
      imageUrl: null,
      badge: "Bacon",
      isSoldOut: false,
      sortOrder: 3
    },
    {
      id: "moose-5",
      sectionId: "moose-burgers",
      name: "Bleu Sky Burger",
      description: "Beef patty, bleu cheese crumbles, bacon, grilled onion, lettuce, tomato, mayonnaise, and mustard on a toasted bun.",
      price: "$11.99 / $14.99 with fries",
      imageUrl: null,
      badge: "Bold",
      isSoldOut: false,
      sortOrder: 4
    },
    {
      id: "moose-6",
      sectionId: "moose-burgers",
      name: "Hearty Shroom and Cheese Burger",
      description: "Beef patty, cheese, mushroom brown gravy, and mayonnaise on a toasted bun.",
      price: "$11.99 / $14.99 with fries",
      imageUrl: "/assets/mellow-moose-hearty-shroom.jpg",
      badge: null,
      isSoldOut: false,
      sortOrder: 5
    },
    {
      id: "moose-7",
      sectionId: "moose-burgers",
      name: "Return of the Schmac Burger",
      description: "Beef patty, American cheese, schmac sauce, red onion, lettuce, and pickles on a toasted bun.",
      price: "$9.99 / $12.99 with fries",
      imageUrl: null,
      badge: null,
      isSoldOut: false,
      sortOrder: 6
    },
    {
      id: "moose-8",
      sectionId: "moose-burgers",
      name: "Burn, Burn, Burger",
      description: "Beef patty, cheddar cheese, bacon, Smokeshow sauce, grilled peppers, red onion, lettuce, tomato, pickles, mayonnaise, and mustard on a toasted bun.",
      price: "$11.99 / $14.99 with fries",
      imageUrl: null,
      badge: "Spicy",
      isSoldOut: false,
      sortOrder: 7
    },
    {
      id: "moose-9",
      sectionId: "moose-burgers",
      name: "Grilled Chicken Sandwich",
      description: "Grilled chicken breast, bacon, cheddar cheese, lettuce, tomato, red onion, pickles, and mayonnaise on a toasted bun.",
      price: "$9.99 / $12.99 with fries",
      imageUrl: null,
      badge: null,
      isSoldOut: false,
      sortOrder: 8
    },
    {
      id: "moose-10",
      sectionId: "moose-fries",
      name: "Side of Fries",
      description: "Crispy fries served on the side.",
      price: "$3.99",
      imageUrl: null,
      badge: null,
      isSoldOut: false,
      sortOrder: 9
    },
    {
      id: "moose-11",
      sectionId: "moose-fries",
      name: "Cheese Fries",
      description: "Fries with nacho cheese sauce.",
      price: "$5.99",
      imageUrl: null,
      badge: null,
      isSoldOut: false,
      sortOrder: 10
    },
    {
      id: "moose-12",
      sectionId: "moose-fries",
      name: "Loaded Fries",
      description: "Fries, nacho cheese sauce, bacon, and ranch.",
      price: "$7.99",
      imageUrl: null,
      badge: null,
      isSoldOut: false,
      sortOrder: 11
    },
    {
      id: "moose-13",
      sectionId: "moose-fries",
      name: "Moose Fries",
      description: "Fries, nacho cheese sauce, grilled onion, beef patty, pickles, and burger sauce.",
      price: "$11.99",
      imageUrl: null,
      badge: "Loaded",
      isSoldOut: false,
      sortOrder: 12
    },
    {
      id: "moose-14",
      sectionId: "moose-salads",
      name: "Side Salad",
      description: "Lettuce, sliced tomato, red onion, shredded cheese, and choice of dressing.",
      price: "$3.99",
      imageUrl: null,
      badge: null,
      isSoldOut: false,
      sortOrder: 13
    },
    {
      id: "moose-15",
      sectionId: "moose-salads",
      name: "Grilled Chicken or Patty Salad",
      description: "Choice of grilled chicken breast or beef patty on lettuce with sliced tomato, red onion, shredded cheese, and choice of dressing.",
      price: "$10.99",
      imageUrl: null,
      badge: null,
      isSoldOut: false,
      sortOrder: 14
    },
    {
      id: "moose-16",
      sectionId: "moose-kids",
      name: "Lil Moose Cheeseburger",
      description: "Beef patty, American cheese, ketchup, and pickle on a toasted bun. Choice of fries or fruit cup.",
      price: "$6.99",
      imageUrl: null,
      badge: "Kid's meal",
      isSoldOut: false,
      sortOrder: 15
    },
    {
      id: "moose-17",
      sectionId: "moose-kids",
      name: "Chicken Nuggets",
      description: "Chicken nuggets served with choice of fries or fruit cup.",
      price: "$6.99",
      imageUrl: null,
      badge: "Kid's meal",
      isSoldOut: false,
      sortOrder: 16
    },
    {
      id: "moose-18",
      sectionId: "moose-extras",
      name: "Sauce or Dressing",
      description: "House Ranch, Schmac Sauce, Burger Sauce, or Balsamic Vinaigrette.",
      price: "$0.79",
      imageUrl: null,
      badge: null,
      isSoldOut: false,
      sortOrder: 17
    },
    {
      id: "moose-19",
      sectionId: "moose-extras",
      name: "Add-ons",
      description: "Extra cheese, fresh jalapeno, grilled onions, grilled peppers, bleu cheese crumbles, bacon, or extra patty.",
      price: "$0.79-$2.99",
      imageUrl: null,
      badge: "Customize",
      isSoldOut: false,
      sortOrder: 18
    },
    {
      id: "moose-20",
      sectionId: "moose-extras",
      name: "Drinks and Fruit Cup",
      description: "Water or juice, soda, and fruit cup options.",
      price: "$1-$2",
      imageUrl: null,
      badge: null,
      isSoldOut: false,
      sortOrder: 19
    },
    {
      id: "moose-21",
      sectionId: "moose-specials",
      name: "Jalapeno Ranch Bacon Cheeseburger",
      description: "A photographed Mellow Moose special with bacon, jalapeno, cheese, and creamy ranch-style sauce.",
      price: null,
      imageUrl: "/assets/mellow-moose-jalapeno-ranch-bacon.jpg",
      badge: "Rotating special",
      isSoldOut: false,
      sortOrder: 20
    },
    {
      id: "moose-22",
      sectionId: "moose-specials",
      name: "Moose Slammer Jammer",
      description: "A sweet-heat photographed special with jam, bacon, jalapeno, and melted cheese.",
      price: null,
      imageUrl: "/assets/mellow-moose-slammer-jammer.jpg",
      badge: "Rotating special",
      isSoldOut: false,
      sortOrder: 21
    },
    {
      id: "moose-23",
      sectionId: "moose-specials",
      name: "The Cowboy",
      description: "A saucy photographed special stacked with bacon, jalapenos, and barbecue-style flavor.",
      price: null,
      imageUrl: "/assets/mellow-moose-cowboy.jpg",
      badge: "Rotating special",
      isSoldOut: false,
      sortOrder: 22
    },
    {
      id: "moose-24",
      sectionId: "moose-specials",
      name: "Torta Burger",
      description: "A photographed throwback-style burger with Dos Gordos energy and Mellow Moose smash burger attitude.",
      price: null,
      imageUrl: "/assets/mellow-moose-torta-burger.jpg",
      badge: "Rotating special",
      isSoldOut: false,
      sortOrder: 23
    }
  ],
  menuVariants: [
    {
      key: "mellow-moose",
      label: "Mellow Moose Burgers",
      banner: null,
      orderUrl: "https://www.clover.com/online-ordering/dos-gordos-tacos-siloam-springs",
      sections: [],
      items: []
    },
    {
      key: "dos-gordos",
      label: "Dos Gordos popup",
      banner: "Dos Gordos popup is active at Mellow Moose today.",
      orderUrl: "https://www.clover.com/online-ordering/dos-gordos-tacos-siloam-springs",
      sections: [{ id: "dos-gordos-menu", name: "Dos Gordos Popup Menu", sortOrder: 0 }],
      items: [
        {
          id: "dos-gordos-popup-menu",
          sectionId: "dos-gordos-menu",
          name: "Dos Gordos Popup Menu",
          description: "The throwback popup menu takes over this page when the owner activates Dos Gordos day.",
          price: null,
          imageUrl: "/assets/mellow-moose-dos-gordos-menu.jpg",
          badge: "Popup mode",
          isSoldOut: false,
          sortOrder: 0
        }
      ]
    }
  ]
};

const demoBusinesses = [mellowMooseBurgers];

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
    activeMenuKey: text(row, "active_menu_key"),
    brandTheme: text(row, "brand_theme") === "mellow-moose" ? "mellow-moose" : "default",
    description: text(row, "description"),
    city: text(row, "city"),
    statusNote: text(row, "status_note"),
    popupBanner: text(row, "popup_banner"),
    hoursSummary: text(row, "hours_summary"),
    locationSummary: text(row, "location_summary"),
    address: text(row, "address"),
    orderingUrl: text(row, "ordering_url"),
    reviewUrl: text(row, "review_url"),
    facebookUrl: text(row, "facebook_url"),
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
    })),
    menuVariants: []
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
      active_menu_key,
      brand_theme,
      description,
      city,
      status_note,
      popup_banner,
      hours_summary,
      location_summary,
      address,
      ordering_url,
      review_url,
      facebook_url,
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
      ${String(formData.get("activeMenuKey") || "main").trim()},
      ${String(formData.get("brandTheme") || "default").trim()},
      ${String(formData.get("description") || "").trim() || null},
      ${String(formData.get("city") || "").trim() || null},
      ${String(formData.get("statusNote") || "").trim() || null},
      ${String(formData.get("popupBanner") || "").trim() || null},
      ${String(formData.get("hoursSummary") || "").trim() || null},
      ${String(formData.get("locationSummary") || "").trim() || null},
      ${String(formData.get("address") || "").trim() || null},
      ${String(formData.get("orderingUrl") || "").trim() || null},
      ${String(formData.get("reviewUrl") || "").trim() || null},
      ${String(formData.get("facebookUrl") || "").trim() || null},
      ${String(formData.get("instagramUrl") || "").trim() || null},
      ${String(formData.get("phone") || "").trim() || null},
      ${String(formData.get("heroImageUrl") || "").trim() || "/assets/resonate-logo-flat.png"},
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

export async function updateMenuMode(formData: FormData) {
  const sql = await getSql();

  if (!sql) {
    return { ok: false, reason: "missing-db" };
  }

  const slug = String(formData.get("slug") || "").trim();
  const activeMenuKey = String(formData.get("activeMenuKey") || "main").trim();
  const popupBanner = String(formData.get("popupBanner") || "").trim();

  if (!slug) {
    return { ok: false, reason: "missing-slug" };
  }

  await sql`
    update businesses
    set active_menu_key = ${activeMenuKey},
        popup_banner = ${popupBanner || null},
        updated_at = now()
    where slug = ${slug}
  `;

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
