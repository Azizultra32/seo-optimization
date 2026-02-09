import React from "react"

const MotionComponent = ({ children, className, ...props }: any) => {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  )
}

export const motion = {
  div: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
  h1: ({ children, className, ...props }: any) => (
    <h1 className={className} {...props}>
      {children}
    </h1>
  ),
  p: ({ children, className, ...props }: any) => (
    <p className={className} {...props}>
      {children}
    </p>
  ),
  button: ({ children, className, ...props }: any) => (
    <button className={className} {...props}>
      {children}
    </button>
  ),
  video: React.forwardRef(({ children, className, ...props }: any, ref: any) => (
    <video ref={ref} className={className} {...props}>
      {children}
    </video>
  )),
}
