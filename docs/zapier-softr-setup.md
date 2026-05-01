# Zapier And Softr Setup

This is the first working setup around the custom Resonate site.

## Zapier Forms

Create two forms first:

1. New Customer Intake
2. Customer Uploads

## Form 1: New Customer Intake

Purpose:

Capture enough information to decide whether the customer is a fit and start the Airtable record.

Fields:

- Business name
- Your name
- Email
- Phone
- Business type
- City or service area
- Current website, Google, Facebook, Instagram, or booking link
- What do customers usually ask before booking, buying, or visiting?
- What do you want this page to help with?
- Which package are you interested in?
- Anything else Resonate should know?

Automation:

Trigger:

- New Zapier Form submission

Actions:

1. Create Airtable record in `Intake Requests`.
2. Create or update Airtable `Contacts`.
3. Create Airtable `Businesses` record with Status `Lead`.
4. Create Airtable `Tasks` record named `Review new intake`.
5. Send notification email to Resonate.

## Form 2: Customer Uploads

Purpose:

Let customers upload messy real-world files without forcing them to understand your internal structure.

Fields:

- Business name
- Contact email
- What are you uploading?
  - Logo
  - Menu or service list
  - Photos
  - Brand examples
  - Other
- File upload
- Notes about these files
- If photos are attached, what should we know about them?

Automation:

Trigger:

- New upload form submission

Actions:

1. Find matching Business in Airtable by business name or email.
2. Create Airtable `Assets` record.
3. Set Review Status to `New`.
4. Create task named `Review uploaded assets`.
5. Send notification email to Resonate.

Professional note:

Do not ask customers to perfectly name photos. Ask for notes, then let Resonate classify and match the assets.

## Softr Portal

Create a Softr app named:

`Resonate Customer Portal`

Connect it to the Airtable base:

`Resonate Business Pages`

## Softr Pages

### Login

Purpose:

Customers log in using their email.

### My Business

Shows:

- Business name
- Status
- Public page URL
- Owner dashboard URL
- Plan
- What Resonate is waiting on

### Upload Logo & Photos

Shows:

- Upload form connected to Airtable Assets
- Plain instructions:
  - Upload your logo if you have one.
  - Upload useful photos of your work, products, space, truck, team, or before/after examples.
  - You do not need to rename files perfectly. Resonate will review and place them.

### Menu Or Services

Shows:

- Existing Menu / Service Items linked to their business
- Form for adding a new item/service
- Fields for name, section, price, description, and notes

### Brand Preferences

Shows:

- Desired feel
- Colors they like
- Colors to avoid
- Websites or businesses they like
- Words to use
- Words to avoid

### Review My Page

Shows:

- Public Page URL
- Customer review checklist
- Button or form to request changes

### Support / Request Changes

Shows:

- Change request form
- Examples:
  - Update hours
  - Add a service
  - Replace a photo
  - Fix wording
  - Change booking link

## Softr Permission Rule

Each customer should only see records tied to their email/contact.

Minimum viable setup:

- Contacts table has Email.
- Contacts table links to Business.
- Softr logged-in user email filters visible records.

Do not use one shared customer login for real customers.

## What Not To Build Yet

Do not build these in custom code until the workflow is proven:

- Native mobile app
- Full customer auth system
- Direct file storage
- Complex role permissions
- Automated photo matching
- Full Google/Facebook/Clover sync

Build the workflow manually first. Automate the parts that repeat.

