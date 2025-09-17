import React from 'react';
import { useParams } from 'react-router-dom';

const ChallengeDetails = () => {
  const { id } = useParams();
  return (
    <div className="challenge-details">
      <h2>Challenge Details - {id}</h2>
      <p>Challenge description and code editor will go here.</p>
    </div>
  );
};

export default ChallengeDetails;
