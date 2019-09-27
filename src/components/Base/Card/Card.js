import React from 'react'
// import './Card.scss'
import { Container, Row } from 'react-bootstrap'

const Card = ({ children, header, footer }) => {
  return (
    <Container>
      <Row>
        <div className='card-custom u-center-text'>
          {header && (<div className='card-custom__heading'>{header}</div>)}
          <div className='card-custom__body'>
            {children}
          </div>
          {footer && (<div className='card-custom__footer'>{footer}</div>)}
        </div>
      </Row>
    </Container>
  )
}

export default Card
