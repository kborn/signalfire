import ReactMarkdown from 'react-markdown';

export function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="markdownContent">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
