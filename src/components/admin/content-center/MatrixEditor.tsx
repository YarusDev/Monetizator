import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { EditorSidebar } from './matrix-editor/EditorSidebar';
import { EditorForm } from './matrix-editor/EditorForm';
import { Layout } from 'lucide-react';
import { sanitizeFileName } from '../../../lib/storage';

interface MatrixEditorProps {
  blocks: any[];
  onUpdate: () => void;
}

export function MatrixEditor({ blocks: externalBlocks, onUpdate }: MatrixEditorProps) {
  const [blocks, setBlocks] = useState<any[]>(externalBlocks);
  const [contacts, setContacts] = useState<any[]>([]);
  const [editingBlock, setEditingBlock] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setBlocks(externalBlocks);
  }, [externalBlocks]);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    const { data } = await supabase.from('m_contacts').select('*').order('order_index', { ascending: true });
    if (data) setContacts(data);
  };

  const handleSelectBlock = (block: any) => {
    let content = block.content || {};
    if (typeof content === 'string') {
      try {
        content = JSON.parse(content);
      } catch (e) {
        console.error('Failed to parse block content', e);
        content = {};
      }
    }
    setEditingBlock({ ...block, content });
  };

  const handleAddBlock = async () => {
    const newBlock = {
      block_key: 'new_block',
      title: 'Новый блок',
      content: {},
      order_index: blocks.length
    };
    const { data, error } = await supabase.from('m_content_blocks').insert(newBlock).select().single();
    if (error) console.error(error);
    else {
      onUpdate();
      setEditingBlock(data);
    }
  };

  const handleDeleteBlock = async (id: string) => {
    const { error } = await supabase.from('m_content_blocks').delete().eq('id', id);
    if (!error) {
      onUpdate();
      if (editingBlock?.id === id) setEditingBlock(null);
    }
  };

  const handleUploadImage = async (file: File, _path: string): Promise<string | null> => {
    setIsUploading(true);
    try {
      const sanitizedName = sanitizeFileName(file.name);
      const fileName = `${Date.now()}-${sanitizedName}`;
      const { error } = await supabase.storage.from('monetizator').upload(fileName, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('monetizator').getPublicUrl(fileName);
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!editingBlock) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('m_content_blocks')
        .update({
          title: editingBlock.title,
          block_key: editingBlock.block_key,
          content: editingBlock.content
        })
        .eq('id', editingBlock.id);

      if (error) throw error;
      onUpdate();
    } catch (error) {
      console.error('Error saving block:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex bg-black/40 rounded-[3rem] border border-white/5 backdrop-blur-xl">
      <EditorSidebar 
        blocks={blocks}
        editingBlock={editingBlock}
        onSelectBlock={handleSelectBlock}
        onAddBlock={handleAddBlock}
        onDeleteBlock={handleDeleteBlock}
        isSaving={isSaving}
        onSave={handleSave}
      />

      {editingBlock ? (
        <EditorForm 
          editingBlock={editingBlock}
          allBlocks={blocks}
          contacts={contacts}
          onUpdateBlock={(updates) => setEditingBlock({ ...editingBlock, ...updates })}
          onSave={handleSave}
          onUpload={handleUploadImage}
          isUploading={isUploading}
        />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-600 bg-black/20">
          <div className="w-24 h-24 rounded-[2.5rem] bg-white/5 flex items-center justify-center mb-6 border border-white/5">
            <Layout className="opacity-20" size={40} />
          </div>
          <h2 className="text-sm font-black text-white/40 uppercase tracking-[0.3em]">Выберите блок</h2>
          <p className="text-[10px] text-slate-700 font-bold uppercase tracking-widest mt-2">для начала редактирования</p>
        </div>
      )}
    </div>
  );
}
