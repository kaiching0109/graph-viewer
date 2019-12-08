/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"
import { Menu } from './Module'

// import Header from "./header"
// import "./layout.css"

const menuItems = [
  {
    title: 'LAB01',
    link: 'lab01'
  },
  {
    title: 'LAB02',
    link: 'lab02'
  },
  {
    title: 'LAB05',
    link: 'lab05'
  }
]

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <div className='layout'>
      <Menu items={menuItems} />
      <div className='col-sm'>
        <header className='heading'>{data.site.siteMetadata.title}</header>
      </div>
      <main>{children}</main>
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
