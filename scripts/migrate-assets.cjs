const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const email = process.env.VITE_TEST_USER_EMAIL;
const password = process.env.VITE_TEST_USER_PASSWORD;

const supabase = createClient(supabaseUrl, supabaseKey);

const ASSETS_DIR = path.join(__dirname, '../public/assets');
const BUCKET_NAME = 'monetizator';

async function migrate() {
  console.log('🚀 Starting asset migration to Supabase Storage...');

  // Sign in to become authenticated
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) {
    console.error('❌ Auth error:', authError.message);
    return;
  }

  console.log('✅ Authenticated as:', authData.user.email);

  if (!fs.existsSync(ASSETS_DIR)) {
    console.error('❌ Assets directory not found:', ASSETS_DIR);
    return;
  }

  const files = fs.readdirSync(ASSETS_DIR).filter(file => {
    const stat = fs.statSync(path.join(ASSETS_DIR, file));
    return !stat.isDirectory();
  });

  console.log(`Found ${files.length} files to migrate.`);

  for (const file of files) {
    const filePath = path.join(ASSETS_DIR, file);
    const fileBuffer = fs.readFileSync(filePath);
    
    // Sanitize filename
    const sanitizedName = file.replace(/[^\x00-\x7F]/g, "_").replace(/\s+/g, "_");
    
    console.log(`Uploading ${file} as ${sanitizedName}...`);

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(sanitizedName, fileBuffer, {
        upsert: true,
        contentType: getContentType(file)
      });

    if (error) {
      console.error(`❌ Error uploading ${file}:`, error.message);
    } else {
      const { data: { publicUrl } } = supabase.storage.from(BUCKET_NAME).getPublicUrl(sanitizedName);
      console.log(`✅ Success: ${publicUrl}`);
    }
  }

  console.log('✨ Migration complete!');
}

function getContentType(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  switch (ext) {
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.png': return 'image/png';
    case '.gif': return 'image/gif';
    case '.svg': return 'image/svg+xml';
    default: return 'application/octet-stream';
  }
}

migrate();
