import ReactMarkdown from 'react-markdown';
import { Container, Skeleton } from '@mantine/core';
import { TypeAnimation } from 'react-type-animation';

interface ResponsePageProps {
  llmResponse: string | null;
}

export const ResponsePage: React.FC<ResponsePageProps> = ({ llmResponse }) => {
  return (
    <Container size="md" h="70vh" style={{ overflow: 'auto' }}>
      {llmResponse ? (
        <MarkdownRenderer markdownString={llmResponse}></MarkdownRenderer>
      ) : (
        <>
          <TypeAnimation
            sequence={[
              // Same substring at the start will only be typed out once, initially
              'Thinking...',
              4000, // wait 1s before replacing "Mice" with "Hamsters"
              'This will take me a moment...',
              4000,
              'Are you excited for your trip?',
              4000,
              'Almost there...',
              4000,
            ]}
            wrapper="span"
            speed={50}
            style={{ fontSize: '2em', display: 'inline-block' }}
            repeat={Infinity}
          />
          <Skeleton height={50} mt={20} radius="xl" />
          <Skeleton height={50} mt={20} radius="xl" />
          <Skeleton height={50} mt={20} radius="xl" />
          <Skeleton height={50} mt={20} radius="xl" />
          <Skeleton height={50} mt={20} radius="xl" />
          <Skeleton height={50} mt={20} radius="xl" />
          <Skeleton height={50} mt={20} radius="xl" />
          <Skeleton height={50} mt={20} radius="xl" />
        </>
      )}
    </Container>
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
