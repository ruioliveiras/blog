import React from 'react'
import styled from 'styled-components'

import GithubIcon from 'react-icons/lib/fa/github'
import InstagramIcon from 'react-icons/lib/fa/instagram'
import HomeIcon from 'react-icons/lib/fa/home'
import TwitterIcon from 'react-icons/lib/fa/twitter'
import FlickrIcon from  'react-icons/lib/fa/flickr'

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const Link = styled.a`
  display: inline-block;
  text-decoration: none;
  color: ${props => props.color || '#555'};
  transition: color 175ms ease-in-out, transform 175ms ease-in-out;
  :hover {
    transform: scale(1.1);
    color: ${props => props.hoverColor};
  }
`

const ExternalLink = props => {
  return (
    <Link target="_blank" rel="noopener" {...props}>
      {props.children}
    </Link>
  )
}

const Types = {
  git(props) {
    return (
      <ExternalLink
        hoverColor="#333333"
        href="https://github.com/ruioliveiras"
        {...props}
      >
        <GithubIcon size={32} />
      </ExternalLink>
    )
  },
  home(props) {
    return (
      <ExternalLink
        hoverColor="#fff"
        href="http://ruioliveiras.com"
        {...props}
      >
        <HomeIcon size={32} />
      </ExternalLink>
    )
  },
  instagram(props) {
    return (
      <ExternalLink
        hoverColor="#1da1f2"
        href="https://www.instagram.com/ruioliveiras/"
        {...props}
      >
        <InstagramIcon size={32} />
      </ExternalLink>
    )    
  },
  flickr(props) {
    return (
      <ExternalLink
        hoverColor="#1da1f2"
        href="https://www.flickr.com/photos/152270513@N04"
        {...props}
      >
        <FlickrIcon size={32} />
      </ExternalLink>
    )    
  }
}

export default function SocialButton({ type, ...rest }) {
  const Type = Types[type]
  return (
    <Container {...rest}>
      <Type {...rest} />
    </Container>
  )
}
