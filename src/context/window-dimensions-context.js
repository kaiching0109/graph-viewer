import React, { createContext, useState, useEffect } from 'react'

export const WindowDimensionsContext = createContext({ width: null, height: null })

export default ({ children }) => {
  const [dimensions, setDimensions] = useState({
    width: null,
    height: null
  })
  useEffect(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    })
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    window.addEventListener('resize', handleResize)
    return () => { window.removeEventListener('resize', handleResize) }
  }, [])
  return (
    <WindowDimensionsContext.Provider value={dimensions}>
      {children}
    </WindowDimensionsContext.Provider>
  )
}

// export default WindowDimensionsContext
// export default WindowDimensionsProvider
