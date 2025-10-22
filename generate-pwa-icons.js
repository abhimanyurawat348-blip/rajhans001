import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

console.log('RHPS PWA Icon Setup');
console.log('=====================');

// Define icon sizes needed for PWA
const sizes = [48, 72, 96, 128, 144, 152, 192, 384, 512];

console.log('Current PWA icon configuration:');
console.log('- Using app-icon-final.svg as the primary icon');
console.log('- This SVG icon will scale to all required sizes');
console.log('- SVG icons provide the best quality and smallest file size');

// Update manifest to include all sizes
const manifestPath = join(process.cwd(), 'public', 'manifest.webmanifest');

try {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  
  // Clear existing icons and add SVG for all sizes
  manifest.icons = sizes.map(size => ({
    src: '/app-icon-final.svg',
    sizes: `${size}x${size}`,
    type: 'image/svg+xml'
  }));
  
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('✅ Updated manifest.webmanifest with all icon sizes');
  
  console.log('\nFor maximum compatibility, you can also generate PNG icons:');
  console.log('1. Use an online SVG to PNG converter');
  console.log('2. Convert app-icon-final.svg to PNG format for each size');
  console.log('3. Place the PNG files in the public/icons/ directory');
  console.log('4. Update the manifest to include both SVG and PNG icons');
  
  console.log('\n✅ RHPS PWA icon setup completed!');
  console.log('The app is now configured to use app-icon-final.svg as the PWA icon.');
  
} catch (error) {
  console.error('❌ Error updating manifest:', error);
}