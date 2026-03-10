# Laboratory — Quality Management System

ISO 17025:2017 compliant digital lab records, hosted on GitHub Pages.

## Forms

| File | Form | Code |
|------|------|------|
| `index.html` | Homepage / Portal | — |
| `media-opening-record.html` | Media Opening Record | QC-MOR-001 |
| `reference-strain-record.html` | Reference Strain Record | QC-RSR-001 |
| `equipment-log.html` | Equipment Monitoring Log | QC-EQL-001 |
| `media-records-viewer.html` | Lab Records Viewer | — |

## Backend

`Code.gs` is the Google Apps Script backend. It is **not served by GitHub Pages** — paste it into [script.google.com](https://script.google.com) and deploy as a Web App.

**Deploy settings:**
- Execute as: **Me**
- Who has access: **Anyone**

## Setup

1. Upload all `.html` files and `README.md` to your GitHub repository
2. Go to **Settings → Pages → Source: main branch → / (root)**
3. Your site will be live at `https://yourusername.github.io/repository-name`
4. Paste your Apps Script Web App URL into each HTML file where it says `APPS_SCRIPT_URL`

## Record ID Format

`MOR-20260310-0003`
- `MOR/RSR/EQL` — form type
- `YYYYMMDD` — date of creation
- `0003` — sequential number, **resets every month**
