import React from 'react'
// import './Card.scss'
import { Container, Row } from 'react-bootstrap'

const Card = ({ children, header, footer, overrideStyle }) => {
  return (
    <Container>
      <Row>
        <div className='card-custom u-center-text'>
          {header && (<div className='card-custom__heading'>{header}</div>)}
          <div className='card-custom__body' style={overrideStyle ? overrideStyle.cardBody : null}>
            {children}
          </div>
          {footer && (<div className='card-custom__footer'>{footer}</div>)}
        </div>
      </Row>
    </Container>
  )
}

export default Card
