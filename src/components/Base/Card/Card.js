import React from 'react'
// import './Card.scss'
import { Container, Row } from 'react-bootstrap'

const Card = ({ children, title }) => {
  return (
    <Container>
      <Row>
        <div className='card-custom u-center-text'>
          {title && (<div className='card-custom__heading'>{title}</div>)}
          <div className='card-custom__body'>
            {children}
          </div>
        </div>
      </Row>
    </Container>
  )
}

export default Card
