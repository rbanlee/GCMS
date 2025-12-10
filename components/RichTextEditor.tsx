import React, { useEffect, useRef } from 'react';
import { Bold, Italic, List, ListOrdered, Undo, Redo } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  label?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, label }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // Sync content when value changes externally (e.g. switching language tabs)
  useEffect(() => {
    if (contentRef.current && contentRef.current.innerHTML !== value) {
      contentRef.current.innerHTML = value;
    }
  }, [value]);

  const exec = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (contentRef.current) {
      onChange(contentRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (contentRef.current) {
      onChange(contentRef.current.innerHTML);
    }
  };

  const ToolbarButton = ({ icon: Icon, command, arg, title }: any) => (
    <button
      type="button"
      onClick={() => exec(command, arg)}
      className="p-1.5 text-gray-600 hover:bg-gray-200 rounded transition-colors"
      title={title}
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div className="border border-gray-300 rounded-md overflow-hidden bg-white shadow-sm focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500">
        {/* Toolbar */}
        <div className="flex items-center gap-1 p-2 bg-gray-50 border-b border-gray-200">
          <ToolbarButton icon={Bold} command="bold" title="Bold" />
          <ToolbarButton icon={Italic} command="italic" title="Italic" />
          <div className="w-px h-4 bg-gray-300 mx-1" />
          <ToolbarButton icon={List} command="insertUnorderedList" title="Bullet List" />
          <ToolbarButton icon={ListOrdered} command="insertOrderedList" title="Numbered List" />
          <div className="w-px h-4 bg-gray-300 mx-1" />
          <ToolbarButton icon={Undo} command="undo" title="Undo" />
          <ToolbarButton icon={Redo} command="redo" title="Redo" />
        </div>

        {/* Editor Area */}
        <div
          ref={contentRef}
          contentEditable
          onInput={handleInput}
          className="p-3 min-h-[150px] outline-none text-sm prose prose-sm max-w-none"
          style={{ minHeight: '150px' }}
        />
      </div>
      <p className="mt-1 text-xs text-gray-500">
        Rich text enabled. Format your product description using the toolbar.
      </p>
    </div>
  );
};

export default RichTextEditor;