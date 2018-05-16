import React, { Component } from 'react';
import {fetcher, Icons} from 'cude-cms'

const getIcon = (name) => {
  switch (name) {
    case "instagram":
      return <Icons.Instagram height={30} width={30} />
    case "facebook":
      return <Icons.Facebook height={30} width={30} />
    case "snapchat":
      return <Icons.Snapchat height={30} width={30} />
    case "twitter":
      return <Icons.Twitter height={30} width={30} />
    case "youtube":
      return null;
    default:
      return null;
  }
}

class Socials extends Component {
  render() {
    const { data } = this.props;
    const { results } = data;
    
    const {social} = !!results ? results.find(c => c.name === "Social") : {};
    const renderSocials = !!social ?  Object.entries(social) : [];

    return (
      <div className="relative dropdown-wrapper">
        <div
          className="absolute dropdown"
        >
            {
              renderSocials.map(s => {
                if(!s[1]) return null
                return (
                  <a href={s[1]} target="_blank" rel="noopener noreferrer">
                    {getIcon(s[0])}
                  </a>
              )})
            }
           
        </div>
        <p className="text-black">
            FOLLOW
        </p>

      </div>
    )
  }
};

export default fetcher(Socials, '/api/configuration');