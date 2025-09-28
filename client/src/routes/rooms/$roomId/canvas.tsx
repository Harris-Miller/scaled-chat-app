import '@mdxeditor/editor/style.css';
import {
  headingsPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin,
  thematicBreakPlugin,
} from '@mdxeditor/editor';
import { Box } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

const CanvasComponent = () => {
  const [markdown, setMarkdown] = useState('# Hello world');
  return (
    <Box sx={{ flexGrow: 2, overflow: 'auto' }}>
      <MDXEditor
        className="dark-theme"
        markdown={markdown}
        onChange={md => {
          setMarkdown(md);
        }}
        plugins={[headingsPlugin(), listsPlugin(), quotePlugin(), thematicBreakPlugin(), markdownShortcutPlugin()]}
      />
    </Box>
  );
};

export const Route = createFileRoute('/rooms/$roomId/canvas')({
  component: CanvasComponent,
});
