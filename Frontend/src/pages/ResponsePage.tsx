import ReactMarkdown from 'react-markdown';
import { Loader } from '@mantine/core';

interface ResponsePageProps {
  llmResponse: string | null;
}

export const ResponsePage: React.FC<ResponsePageProps> = ({ llmResponse }) => {
  return (
    <>
      {llmResponse ? (
        <MarkdownRenderer markdownString={llmResponse}></MarkdownRenderer>
      ) : (
        <Loader />
      )}
    </>
  );
};

interface MarkdownRenderer {
  markdownString: string;
}
const MarkdownRenderer: React.FC<MarkdownRenderer> = ({ markdownString }) => {
  return (
    <div>
      <ReactMarkdown>{markdownString}</ReactMarkdown>
    </div>
  );
};
