import { Settings } from 'lucide-react';
import { TextField, TextAreaField, ImageField, SectionHeader } from './BaseFields';
import { BLOCK_SCHEMAS } from '../schemas';

interface GenericSettingsProps {
  block: any;
  onChange: (content: any) => void;
  onUpload?: (f: File, p: string) => Promise<string | null>;
  isUploading?: boolean;
}

export const GenericSettings = ({ block, onChange, onUpload, isUploading }: GenericSettingsProps) => {
  const content = block.content || {};
  const schema = BLOCK_SCHEMAS[block.block_key as keyof typeof BLOCK_SCHEMAS] || { fields: [] };
  
  const handleUpdate = (key: string, val: any) => {
    onChange({ ...content, [key]: val });
  };

  // Combine keys from schema and existing keys in content
  const schemaKeys = schema.fields.map(f => f.key);
  const existingKeys = Object.keys(content);
  const allKeys = Array.from(new Set([...schemaKeys, ...existingKeys]));

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <SectionHeader 
        title={`Блок: ${block.block_key}`} 
        subtitle="Редактирование параметров блока"
        icon={Settings}
      />

      <div className="space-y-8">
        {allKeys.map(key => {
          const fieldDef = schema.fields.find(f => f.key === key);
          const label = fieldDef?.label || key;
          const value = content[key];

          if (key.toLowerCase().includes('image')) {
            return (
              <ImageField 
                key={key}
                label={label}
                value={value}
                onChange={(v) => handleUpdate(key, v)}
                onUpload={onUpload}
                isUploading={isUploading}
              />
            );
          }

          if (typeof value === 'string' && value.length > 50) {
            return (
              <TextAreaField 
                key={key}
                label={label}
                value={value}
                onChange={(v) => handleUpdate(key, v)}
              />
            );
          }

          return (
            <TextField 
              key={key}
              label={label}
              value={value}
              onChange={(v) => handleUpdate(key, v)}
            />
          );
        })}
      </div>
    </div>
  );
};
