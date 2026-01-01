import React from 'react'

const Title = ({title , subtitle, align}) => {
  return (
    <div className={`flex flex-col justify-center ${align === 'center' ? 'items-center text-center' : 'items-start text-left'}`}>
      <h1 className='font-medium text-3xl md:text-[35px]'>{title}</h1>
      <p className='text-sm md:text-base text-gray-500/90 mt-2 max-w-156'>{subtitle}</p>
    </div>
  )
}

export default Title
