import ReactMarkdown from 'react-markdown';

export function ArticleBody({ content }: { content: string }) {
  return (
    <div className="articleBody">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
