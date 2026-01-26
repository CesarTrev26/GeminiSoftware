# Gemini Backend Utility Scripts

**Consolidated script for all backend maintenance, optimization and admin tasks.**

All previous separate scripts have been unified into:
- `scripts.js` - Original image optimization and verification commands
- `scripts-consolidated.js` - Extended version with all admin utilities

## Quick Start

```bash
# Show all available commands
node scripts-consolidated.js help

# Common tasks
node scripts-consolidated.js optimize-images
node scripts-consolidated.js check-projects
node scripts-consolidated.js reset-admin
```

## 📸 Image Management Commands

### `optimize-images`
Convert PNG/JPG images to WebP format in `uploads/projects/`.
- Uses Sharp library with 85% quality
- Preserves original files
- Shows size savings for each conversion

**Example:**
```bash
node scripts-consolidated.js optimize-images
```

### `update-db-images`
Update database records to use WebP URLs.
- Updates Project thumbnail and images fields
- Only modifies if WebP file exists
- Shows which projects are updated

**Example:**
```bash
node scripts-consolidated.js update-db-images
```

## 🔍 Data Verification Commands

### `check-projects`
Display all projects with comprehensive details.
- ID, slug, category, featured status
- Thumbnail and images array count
- Results, technologies count
- Creation date

**Example:**
```bash
node scripts-consolidated.js check-projects
```

### `check-services`
Display all services with their metadata.
- ID, slug, icon, color
- Order position, featured status
- Features count, creation date

**Example:**
```bash
node scripts-consolidated.js check-services
```

## 📊 Content Update Commands (API)

### `update-project-metrics`
Update project results array via API.
- Logs in to API with admin credentials
- Updates results for 8 featured projects
- Shows which projects were updated

**Example:**
```bash
node scripts-consolidated.js update-project-metrics
```

**Environment Variables:**
- `ADMIN_EMAIL` - Admin email (default: admin@geminisoftware.mx)
- `ADMIN_PASSWORD` - Admin password
- `API_URL` - API base URL (default: https://gemini-backend.fly.dev/api)

## 🛠️ Database Update Commands (Direct)

### `update-services`
Batch update service icons and colors.
- Updates 6 predefined services
- Sets icon names (Monitor, ShoppingCart, Code, etc.)
- Assigns brand colors (#00D3FF, #7C3AED, etc.)

**Example:**
```bash
node scripts-consolidated.js update-services
```

### `reset-admin`
Reset or create admin user.
- Checks if admin exists
- Updates password if found
- Creates new admin if not found
- Lists all users in database

**Example:**
```bash
node scripts-consolidated.js reset-admin
```

**Environment Variables:**
- `ADMIN_EMAIL` - Admin email (default: admin@geminisoftware.mx)
- `ADMIN_PASSWORD` - Admin password (default: GeminiAdmin2024!)

## Available Scripts Summary

| Command | Description | Type |
|---------|-------------|------|
| `optimize-images` | Convert images to WebP | File |
| `update-db-images` | Update DB image paths | DB |
| `check-projects` | List all projects | Info |
| `check-services` | List all services | Info |
| `update-project-metrics` | Update project results | API |
| `update-services` | Update service metadata | DB |
| `reset-admin` | Reset admin password | DB |
| `help` | Show help message | Info |

## Migration Notes

The following files have been consolidated into `scripts-consolidated.js`:
- ~~`update-project-metrics.js`~~ → `update-project-metrics` command
- ~~`update-projects-content.js`~~ → Removed (one-time migration)
- ~~`update-services.js`~~ → `update-services` command
- ~~`reset-admin.js`~~ → `reset-admin` command

The original `scripts.js` remains for backward compatibility with image optimization commands
node scripts.js check-projects
```

### `check-services`
Displays all services with their information.
- Shows service details (slug, category, order)
- Lists icon information

**Example:**
```bash
node scripts.js check-services
```

## Typical Workflow

When new PNG images are uploaded:

1. **Optimize images to WebP:**
   ```bash
   npm run script:optimize
   ```

2. **Update database URLs:**
   ```bash
   npm run script:update-db
   ```

3. **Verify the changes:**
   ```bash
   npm run script:check
   ```

## Requirements

- Node.js
- Sharp (for image optimization)
- Prisma Client (for database operations)

All dependencies are already included in `package.json`.
