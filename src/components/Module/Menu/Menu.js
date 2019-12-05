import React, { useEffect, useState } from 'react'

const Menu = ({ items }) => {

  const [toggled, setToggled] = useState(false)

  const handleButtonToggle = () => setToggled(!toggled)

  return (
    <div className='menu'>
      <div
        className='menu__button'
        onClick={handleButtonToggle}
        style={{ backgroundColor: toggled ? 'transparent' : 'black' }}
      >
        <span className='menu__icon'>&nbsp;</span>
      </div>

      <div className='menu__background'>&nbsp;</div>

      <div className='menu__container' style={ toggled ? ({ 'opacity' : 1, 'zIndex': 1 }) : ({ 'opacity' : 0, 'zIndex' : -1 })}>
        <ul class='menu__list'>
          {items.map(({ title, link }, i) => {
            return (
              <li className='menu__item' key={i}>
                <a href={`http://localhost:8000/${link}`} className='menu__link'>
                  <span>{i}</span>
                  {title}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default Menu
