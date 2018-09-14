import React from 'react';

const CountriesSummary = ({countries}) => (
  <ol className="countries-summary row">
      {countries.map(c => (
        <li key={c.id}>
          <span>{c.emoji}</span> 
          <span>{c.name}</span>,
        </li>
      ))}
  </ol>
);

export default CountriesSummary;