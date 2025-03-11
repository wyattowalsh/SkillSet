import React, { useState } from 'react';

interface UploadFormProps {
  setError: (error: string) => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ setError }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files ? event.target.files[0] : null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      setError('Please select a file.');
      return;
    }

    try {
      const fileContent = await file.text();
      const jsonData = JSON.parse(fileContent);

      // Validate JSON Resume
      if (!jsonData.basics || !jsonData.work || !jsonData.skills) {
        setError('Invalid JSON Resume format.');
        return;
      }

      setError('');
      // Process the JSON Resume data
      console.log('JSON Resume data:', jsonData);
    } catch (error) {
      setError('Error reading or parsing the file.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center">
      <p>
        Submit your{' '}
        <a href="https://jsonresume.org/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
          JSONResume
        </a>{' '}
        here for skillset visualization:
      </p>
      <input type="file" accept=".json" onChange={handleFileChange} className="mb-4" />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Visualize
      </button>
    </form>
  );
};

export default UploadForm;
