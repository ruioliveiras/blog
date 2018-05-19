import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import styled from 'styled-components'

import loadWebFonts from '../services/web-fonts'

import Content from '../components/Content'
import Footer from '../components/Footer'
import Header from '../components/Header'

import '../css/base.css'

const Root = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

export default class Template extends React.Component {
  static propTypes = {
    children: PropTypes.func
  }

  componentDidMount() {
    loadWebFonts()
  }

  render() {
    const { children, location } = this.props
    const isPost =
      location.pathname !== '/' && !location.pathname.match(/^\/blog\/?$/)

    return (
      <Root>
        <Helmet
          title="Rui Oliveiras - Blog"
          meta={[
            {
              name: 'description',
              content:
                'My personal blog, backend developer and architecture, Rui Oliveira'
            },
            {
              name: 'keywords',
              content:
                'rui, oliveira, scala, java, jvm, architecture, software'
            }
          ]}
        />
        <Header isPost={isPost} />
        <Content isPost={isPost} Footer={Footer}>
          {children()}
        </Content>
      </Root>
    )
  }
}
