# Airtable Base Setup

Use this to create the first Airtable base for Resonate Business Pages.

Base name:

`Resonate Business Pages`

## Build Order

Create tables in this order:

1. Businesses
2. Contacts
3. Intake Requests
4. Brand Preferences
5. Menu / Service Items
6. Assets
7. Tasks

Create the plain text/select/date fields first. Add linked-record fields after the related tables exist.

## Businesses

Purpose:

This is the main customer account record. One business can have contacts, assets, menu/service items, tasks, and brand preferences.

Fields:

| Field | Type | Notes |
|---|---|---|
| Business Name | Single line text | Primary field |
| Slug | Single line text | Example: `mellow-moose-burgers` |
| Business Type | Single select | Food, Lawn care, Cleaning, Car detailing, Beauty, Wellness, Other |
| Status | Single select | Lead, Intake started, Waiting on customer, Ready for build, In build, Customer review, Published, Active monthly, Paused |
| Plan | Single select | Starter, Plus, Custom Buildout |
| Service Area / City | Single line text | City, region, or service area |
| Public Page URL | URL | Final `/m/[slug]` link |
| Owner Dashboard URL | URL | Final `/dashboard/[slug]` link or Softr portal page |
| Primary Contact | Link to Contacts | Add after Contacts table exists |
| Brand Direction | Long text | Plain-language brand notes |
| Customer Notes | Long text | Customer-facing preferences and notes |
| Internal Notes | Long text | Private Resonate notes |
| Last Customer Update | Date | Last change/request from the business |
| Created Time | Created time | Airtable-created timestamp |

## Contacts

Purpose:

People connected to each business.

Fields:

| Field | Type | Notes |
|---|---|---|
| Contact Name | Single line text | Primary field |
| Email | Email | Used for Softr permissions |
| Phone | Phone number | Optional |
| Role | Single select | Owner, Manager, Staff |
| Business | Link to Businesses | Required for portal filtering |
| Portal Access | Checkbox | Whether they should access the customer portal |
| Notes | Long text | Internal notes |

## Intake Requests

Purpose:

Raw lead/intake submissions before they become an active customer page.

Fields:

| Field | Type | Notes |
|---|---|---|
| Request Name | Formula | Example formula: `{Business Name} & " - " & DATETIME_FORMAT({Submitted At}, 'M/D/YYYY')` |
| Submitted At | Created time | Airtable-created timestamp |
| Business Name | Single line text | Required |
| Contact Name | Single line text | Required |
| Email | Email | Required |
| Phone | Phone number | Optional |
| Business Type | Single select | Same choices as Businesses |
| City / Service Area | Single line text | Required |
| Current Website or Social Link | URL | Website, Google, Facebook, Instagram, etc. |
| Main Need | Long text | What they need help with |
| Package Interest | Single select | Free Review, Starter, Plus, Custom Buildout, Not sure |
| Notes | Long text | Extra context |
| Source | Single select | Website, Zapier Form, Softr Portal, Manual |
| Converted Business | Link to Businesses | Filled once promoted |

## Brand Preferences

Purpose:

Captures how the page should feel before visual work starts.

Fields:

| Field | Type | Notes |
|---|---|---|
| Brand Preference Name | Formula | Example: `{Business} & " brand"` |
| Business | Link to Businesses | Required |
| Desired Feel | Multiple select | Clean, Bold, Friendly, Luxury, Rugged, Playful, Minimal, Premium |
| Colors They Like | Long text | Customer words are fine |
| Colors To Avoid | Long text | Important for avoiding bad first drafts |
| Websites They Like | Long text | Links or names |
| Words To Use | Long text | Phrases that sound like them |
| Words To Avoid | Long text | Words they dislike |
| Logo Available | Checkbox | Whether usable logo exists |
| Brand Review Status | Single select | Missing, Submitted, Needs cleanup, Approved |

## Menu / Service Items

Purpose:

Structured services, menu items, packages, or offers.

Fields:

| Field | Type | Notes |
|---|---|---|
| Item / Service Name | Single line text | Primary field |
| Business | Link to Businesses | Required |
| Section | Single line text | Examples: Burgers, Deep cleans, Lawn services |
| Price | Single line text | Keep flexible: `$9.99`, `Starting at $150`, `Quote required` |
| Description | Long text | Customer-facing description |
| Badge | Single line text | Popular, Best seller, Seasonal, New client |
| Image | Link to Assets | Add after Assets table exists |
| Published | Checkbox | Whether it should show on public page |
| Sort Order | Number | Manual order |
| Review Status | Single select | Draft, Needs customer review, Approved, Published |

## Assets

Purpose:

All customer uploads and manually collected page assets.

Fields:

| Field | Type | Notes |
|---|---|---|
| Asset Name | Single line text | Primary field; do not depend on customer filenames |
| Business | Link to Businesses | Required |
| Asset File | Attachment | Logo, photos, menu uploads |
| Asset Type | Single select | Logo, Hero photo, Gallery photo, Item photo, Before/after, Menu upload, Service list upload, Other |
| Suggested Use | Single line text | Example: “Hero image” or “Blazing Moose Fries” |
| Matched Item or Service | Link to Menu / Service Items | Human-confirmed match |
| Customer Caption | Single line text | Optional |
| Internal Notes | Long text | Resonate-only notes |
| Review Status | Single select | New, Needs identification, Approved, Rejected, Needs better photo |
| Usable For Page | Checkbox | Final quality flag |

Professional rule:

Do not rely on customer file names. Most uploads will be named `IMG_4827.jpeg`, `image0.jpeg`, or `Screenshot.png`.

## Tasks

Purpose:

Internal Resonate work queue.

Fields:

| Field | Type | Notes |
|---|---|---|
| Task Name | Single line text | Primary field |
| Business | Link to Businesses | Optional for general tasks, required for customer work |
| Task Type | Single select | Intake, Brand, Menu cleanup, Photo matching, Build, Customer review, Publish, Support |
| Assigned To | Collaborator | Optional |
| Due Date | Date | Optional |
| Status | Single select | To do, Doing, Waiting, Done |
| Notes | Long text | Internal detail |

## First Views To Create

Businesses:

- Active Customers: filter Status is Published or Active monthly
- Leads: filter Status is Lead or Intake started
- Waiting on Customer: filter Status is Waiting on customer
- Build Queue: filter Status is Ready for build or In build

Assets:

- New Uploads: filter Review Status is New
- Needs Identification: filter Review Status is Needs identification
- Approved Assets: filter Review Status is Approved

Tasks:

- My Open Tasks: filter Status is not Done
- Build Tasks: filter Task Type is Build or Photo matching or Menu cleanup

