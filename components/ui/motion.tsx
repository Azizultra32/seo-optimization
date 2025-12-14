import React from "react"

const MotionComponent = ({ children, className, ...props }: any) => {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  )
}

export const motion = {
  div: ({ children, className, style, ...props }: any) => (
    <div className={className} style={style} {...props}>
      {children}
    </div>
  ),
  span: ({ children, className, style, ...props }: any) => (
    <span className={className} style={style} {...props}>
      {children}
    </span>
  ),
  h1: ({ children, className, style, ...props }: any) => (
    <h1 className={className} style={style} {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, className, style, ...props }: any) => (
    <h2 className={className} style={style} {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, className, style, ...props }: any) => (
    <h3 className={className} style={style} {...props}>
      {children}
    </h3>
  ),
  p: ({ children, className, style, ...props }: any) => (
    <p className={className} style={style} {...props}>
      {children}
    </p>
  ),
  button: ({ children, className, style, ...props }: any) => (
    <button className={className} style={style} {...props}>
      {children}
    </button>
  ),
  a: ({ children, className, style, ...props }: any) => (
    <a className={className} style={style} {...props}>
      {children}
    </a>
  ),
  video: React.forwardRef(({ children, className, style, ...props }: any, ref: any) => (
    <video ref={ref} className={className} style={style} {...props}>
      {children}
    </video>
  )),
}
