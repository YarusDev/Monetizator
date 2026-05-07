export const sanitizeFileName = (fileName: string): string => {
  const parts = fileName.split('.');
  const extension = parts.length > 1 ? parts.pop() : '';
  const name = parts.join('.');
  
  const sanitized = name
    .replace(/[^\x00-\x7F]/g, '') // Remove non-ASCII (e.g. Cyrillic)
    .replace(/[^a-z0-9]/gi, '_') // Replace special chars with _
    .replace(/_+/g, '_')         // Collapse underscores
    .replace(/^_|_$/g, '');      // Trim underscores
    
  const finalName = sanitized || 'file';
  return extension ? `${finalName}.${extension}` : finalName;
};
