const fs = require('fs');
const zlib = require('zlib');

// Simple zip extraction without external dependencies
const AdmZip = require('adm-zip');
const zip = new AdmZip('/data/projects-images.zip');
zip.extractAllTo('/data/uploads/projects/', true);
console.log('Extraction complete');
