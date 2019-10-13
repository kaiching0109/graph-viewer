import React, { useEffect, useState } from 'react'

const Menu = props => {
  // <nav className='menu__nav'>
  //     <ul className='menu__list'>
  //         <li className='menu__item'><a href='#' className='menu__link'><span>01</span>About Natous</a></li>
  //         <li className='menu__item'><a href='#' className='menu__link'><span>02</span>Your benfits</a></li>
  //         <li className='menu__item'><a href='#' className='menu__link'><span>03</span>Popular tours</a></li>
  //         <li className='menu__item'><a href='#' className='menu__link'><span>04</span>Stories</a></li>
  //         <li className='menu__item'><a href='#' className='menu__link'><span>05</span>Book now</a></li>
  //         </ul>
  // </nav>

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

      <div className='menu__container' style={{ opacity: toggled ? 1 : 0 }}>
        <ul class='menu__list'>
          <li class='menu__item'>
            <a href="#" class="menu__link"><span>01</span>About Natous</a>
          </li>
          <li class='menu__item'>
            <a href="#" class="menu__link"><span>01</span>About Natous</a>
          </li>
          <li class='menu__item'>
            <a href="#" class="menu__link"><span>01</span>About Natous</a>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Menu
