import DOMPurify from 'dompurify';

const CleanHTML = ({ dirtyHTML }: { dirtyHTML: string }) => {
  const cleanHTML = DOMPurify.sanitize(dirtyHTML);
  return <div dangerouslySetInnerHTML={{ __html: cleanHTML }} />;
};

export default CleanHTML;