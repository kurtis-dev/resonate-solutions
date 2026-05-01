# Resonate No-Code Onboarding Stack

This is the working setup for using Softr, Airtable, and Zapier Forms around the custom Resonate website.

## Product Boundary

Resonate should keep the public customer pages custom.

Use no-code tools for the operational plumbing:

- Customer intake
- Customer file uploads
- Internal review
- Customer portal access
- Notifications
- Task handoffs
- Early automation tests

Do not rebuild a full client portal, upload manager, task board, or automation engine inside the app until customer demand proves which pieces need to be custom.

## Stack Roles

### Custom Next.js Site

Owns:

- Public business pages at `/m/[slug]`
- Resonate marketing pages
- Resonate internal admin pages
- Lightweight owner dashboard prototype
- Final published customer-facing content
- API endpoints that receive structured data later

### Airtable

Owns the operating database for onboarding and review:

- Leads
- Businesses
- Contacts
- Brand preferences
- Uploaded assets
- Menu or service items
- Page build status
- Internal tasks
- Review notes

### Softr

Owns the customer portal experience at first:

- Customer login
- Customer profile
- Intake status
- Upload pages
- Review forms
- Simple customer dashboard
- Permissioned views so each customer only sees their business

### Zapier Forms / Zapier

Owns fast forms and handoffs:

- New lead form
- Customer onboarding form
- Upload request form
- New submission notifications
- Task creation
- Airtable record creation
- Later: webhook calls into the custom app

## Airtable Base

Create one base named:

`Resonate Business Pages`

### Table: Businesses

Fields:

- Business ID: formula or autonumber-backed ID
- Business Name: single line text
- Slug: single line text
- Business Type: single select
- Status: single select
  - Lead
  - Intake started
  - Waiting on customer
  - Ready for build
  - In build
  - Customer review
  - Published
  - Active monthly
  - Paused
- Plan: single select
  - Starter
  - Plus
  - Custom Buildout
- Service Area / City: single line text
- Public Page URL: URL
- Owner Dashboard URL: URL
- Primary Contact: linked record to Contacts
- Brand Direction: long text
- Customer Notes: long text
- Internal Notes: long text
- Last Customer Update: date
- Created Time: created time

### Table: Contacts

Fields:

- Contact Name: single line text
- Email: email
- Phone: phone
- Role: single select
  - Owner
  - Manager
  - Staff
- Business: linked record to Businesses
- Portal Access: checkbox
- Notes: long text

### Table: Intake Requests

Fields:

- Submitted At: created time
- Business Name: single line text
- Contact Name: single line text
- Email: email
- Phone: phone
- Business Type: single select
- City / Service Area: single line text
- Current Website or Social Link: URL
- Main Need: long text
- Package Interest: single select
- Notes: long text
- Source: single select
  - Website
  - Zapier Form
  - Softr Portal
  - Manual
- Converted Business: linked record to Businesses

### Table: Brand Preferences

Fields:

- Business: linked record to Businesses
- Desired Feel: multiple select
  - Clean
  - Bold
  - Friendly
  - Luxury
  - Rugged
  - Playful
  - Minimal
  - Premium
- Colors They Like: long text
- Colors To Avoid: long text
- Websites They Like: long text
- Words To Use: long text
- Words To Avoid: long text
- Logo Available: checkbox
- Brand Review Status: single select
  - Missing
  - Submitted
  - Needs cleanup
  - Approved

### Table: Assets

Fields:

- Business: linked record to Businesses
- Asset File: attachment
- Asset Type: single select
  - Logo
  - Hero photo
  - Gallery photo
  - Item photo
  - Before/after
  - Menu upload
  - Service list upload
  - Other
- Suggested Use: single line text
- Matched Item or Service: linked record to Menu / Service Items
- Customer Caption: single line text
- Internal Notes: long text
- Review Status: single select
  - New
  - Needs identification
  - Approved
  - Rejected
  - Needs better photo
- Usable For Page: checkbox

Do not rely on filenames. Most customer uploads will have names like `IMG_4827.jpeg`.

### Table: Menu / Service Items

Fields:

- Business: linked record to Businesses
- Section: single line text
- Item / Service Name: single line text
- Price: single line text
- Description: long text
- Badge: single line text
- Image: linked record to Assets
- Published: checkbox
- Sort Order: number
- Review Status: single select
  - Draft
  - Needs customer review
  - Approved
  - Published

### Table: Tasks

Fields:

- Business: linked record to Businesses
- Task Name: single line text
- Task Type: single select
  - Intake
  - Brand
  - Menu cleanup
  - Photo matching
  - Build
  - Customer review
  - Publish
  - Support
- Assigned To: collaborator
- Due Date: date
- Status: single select
  - To do
  - Doing
  - Waiting
  - Done
- Notes: long text

## Softr Portal

Create a Softr app named:

`Resonate Customer Portal`

Recommended pages:

- Login
- My Business
- Upload Logo & Photos
- Menu or Services
- Brand Preferences
- Review My Page
- Support / Request Changes

### Permission Rule

Each customer should only see records linked to their email/contact.

Professional note: do not use one shared password for real customers. The shared basic password is only acceptable for the current prototype.

## Zapier Automations

### Automation 1: New Website Intake

Trigger:

- New form submission from Zapier Forms, or later a webhook from `/api/intake`

Actions:

- Create Airtable Intake Request
- Create or update Contact
- Create Business record with status `Lead`
- Send email/slack notification to Resonate
- Create task: `Review new intake`

### Automation 2: Customer Upload Submitted

Trigger:

- New Airtable Asset record, or Softr form submission

Actions:

- Set Asset Review Status to `New`
- Notify Resonate
- Create task: `Match uploaded assets`

### Automation 3: Intake Complete

Trigger:

- Business status changes to `Ready for build`

Actions:

- Create build tasks
- Generate internal checklist
- Notify Resonate

### Automation 4: Published Page

Trigger:

- Business status changes to `Published`

Actions:

- Email customer the public page URL
- Email customer the owner dashboard URL
- Create follow-up task for first monthly check-in

## Customer Intake Fields

Ask customers for:

- Business name
- Owner/contact name
- Email
- Phone
- Business type
- City or service area
- Current website, Google profile, Facebook, Instagram, or booking link
- What customers usually ask before booking or buying
- Services, menu, packages, or prices
- Hours
- Service area or location notes
- Booking/order/quote/review links
- Logo upload
- Existing menu/service list upload
- 5-15 useful photos
- Brand colors they like
- Colors or styles they do not want
- 2-3 websites or businesses whose style they like
- Notes about tone or personality

## Photo Matching Workflow

Do not ask customers to rename photos perfectly.

Better workflow:

1. Customer uploads photos.
2. Photos land in Airtable Assets.
3. Resonate reviews thumbnails.
4. Resonate assigns each asset to logo, hero photo, gallery, item photo, before/after, or unused.
5. Item photos are linked to Menu / Service Items.
6. Customer reviews the page preview.

Optional later AI assist:

- Suggest image category
- Suggest likely item/service match
- Generate alt text
- Flag low-quality photos

Human review should remain required before publishing.

## What To Build Custom Next

### Keep Custom Now

- Public page rendering
- Published business content
- QR/customer-ready page experience
- Final owner dashboard after workflow is proven

### Use No-Code Now

- Customer login
- Uploads
- Intake forms
- Internal review status
- Asset review
- Task management
- Notifications

### Build Custom Later

- True customer accounts
- Direct file uploads into Resonate
- Structured weekly hours database
- Google/Facebook/Clover sync
- App-store mobile apps

## First Milestone

Goal:

Prove one real customer onboarding flow without building unnecessary software.

Definition of done:

- Airtable base exists with the tables above.
- Softr customer portal has login and upload pages.
- Zapier creates Airtable records from a new intake form.
- One customer can submit details and photos.
- Resonate can review the data and build the public page.
- Customer can review the published public page.

