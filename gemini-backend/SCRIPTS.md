# Gemini Backend Utility Scripts

Single consolidated script for all backend maintenance tasks.

## Usage

### Using Node directly:
```bash
node scripts.js [command]
```

### Using npm scripts:
```bash
npm run script:help        # Show all available commands
npm run script:optimize    # Convert PNG images to WebP
npm run script:update-db   # Update database to use WebP URLs
npm run script:check       # Check all projects and images
```

## Available Commands

### `optimize-images`
Converts all PNG images in `uploads/projects/` to WebP format.
- Uses Sharp with 85% quality and effort level 6
- Preserves original PNG files
- Shows size savings for each image

**Example:**
```bash
node scripts.js optimize-images
```

### `update-db-images`
Updates database `ProjectImage` records to use WebP URLs instead of PNG.
- Only updates if corresponding WebP file exists
- Shows which images are being updated

**Example:**
```bash
node scripts.js update-db-images
```

### `check-projects`
Displays all projects with their image information.
- Shows project details (category, published status, featured)
- Lists thumbnail and gallery images
- Indicates which images are WebP vs PNG

**Example:**
```bash
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
