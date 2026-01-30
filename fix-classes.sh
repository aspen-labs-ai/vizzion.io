#!/bin/bash

# Fix components to use proper Tailwind classes instead of CSS variables

cd "$(dirname "$0")/components"

for file in *.tsx; do
  echo "Fixing $file..."
  
  # Background colors
  sed -i 's/bg-\[var(--color-accent)\]/bg-accent/g' "$file"
  sed -i 's/bg-\[var(--color-primary)\]/bg-primary/g' "$file"
  sed -i 's/bg-\[var(--color-gray-50)\]/bg-gray-50/g' "$file"
  sed -i 's/bg-\[var(--color-gray-100)\]/bg-gray-100/g' "$file"
  sed -i 's/bg-\[var(--color-gray-200)\]/bg-gray-200/g' "$file"
  sed -i 's/bg-\[var(--color-accent-light)\]/bg-accent\/10/g' "$file"
  
  # Text colors
  sed -i 's/text-\[var(--color-accent)\]/text-accent/g' "$file"
  sed -i 's/text-\[var(--color-primary)\]/text-primary/g' "$file"
  sed -i 's/text-\[var(--color-text-secondary)\]/text-gray-700/g' "$file"
  sed -i 's/text-\[var(--color-text-muted)\]/text-gray-600/g' "$file"
  
  # Border colors
  sed -i 's/border-\[var(--color-accent)\]/border-accent/g' "$file"
  sed -i 's/border-\[var(--color-border)\]/border-gray-200/g' "$file"
  
  # Hover states
  sed -i 's/hover:bg-\[var(--color-accent-hover)\]/hover:bg-accent-hover/g' "$file"
  sed -i 's/hover:bg-\[var(--color-primary-light)\]/hover:bg-primary-light/g' "$file"
  sed -i 's/hover:border-\[var(--color-accent)\]/hover:border-accent/g' "$file"
  
  # Shadows
  sed -i 's/shadow-\[var(--shadow-md)\]/shadow-md/g' "$file"
  sed -i 's/shadow-\[var(--shadow-lg)\]/shadow-lg/g' "$file"
  sed -i 's/shadow-\[var(--shadow-xl)\]/shadow-xl/g' "$file"
  
  # Transitions
  sed -i 's/duration-\[var(--transition-base)\]/duration-250/g' "$file"
  
  # Conditional classes
  sed -i "s/'bg-\[var(--color-accent)\]'/'bg-accent'/g" "$file"
  sed -i "s/'bg-\[var(--color-gray-300)\]'/'bg-gray-300'/g" "$file"
done

echo "Done!"
