const fs = require('fs');
const path = require('path');

// Read the RegisterStudent.tsx file
const filePath = path.join(__dirname, '../src/pages/RegisterStudent.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace all <Input with <ValidatedInput (except InputOTP which should stay as is)
content = content.replace(/<Input\s/g, '<ValidatedInput ');

// Write back
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Replaced all Input components with ValidatedInput in RegisterStudent.tsx');
