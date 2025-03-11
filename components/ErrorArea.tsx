import React from 'react';

interface ErrorAreaProps {
  error: string;
}

const ErrorArea: React.FC<ErrorAreaProps> = ({ error }) => {
  return (
    <div className="text-red-500 text-center mt-4">
      {error && <p>{error}</p>}
    </div>
  );
};

export default ErrorArea;
