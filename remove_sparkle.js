const fs = require('fs');

const files = [
  'src/components/FormObjectives.tsx',
  'src/components/FormAssessment.tsx',
  'src/components/FormDailyActivities.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // Remove import
  content = content.replace(/import\s+\{\s*AiSparkleButton\s*\}\s+from\s+['"]\.\/AiSparkleButton['"];?\n/g, '');
  
  // Remove component usage. It spans multiple lines.
  // <AiSparkleButton[\s\S]*?\/>
  content = content.replace(/<AiSparkleButton[\s\S]*?\/>/g, '');
  
  fs.writeFileSync(file, content);
  console.log('Processed', file);
});
