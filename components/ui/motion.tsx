import React from "react"

const MOTION_PROPS = new Set([
  "initial",
  "animate",
  "exit",
  "transition",
  "variants",
  "whileHover",
  "whileTap",
  "whileFocus",
  "whileDrag",
  "whileInView",
  "viewport",
  "drag",
  "dragConstraints",
  "dragElastic",
  "dragMomentum",
  "dragTransition",
  "layout",
  "layoutId",
  "onAnimationStart",
  "onAnimationComplete",
  "onDragStart",
  "onDragEnd",
  "onDrag",
  "custom",
  "inherit",
  "style",
])

function filterMotionProps(props: Record<string, any>) {
  const clean: Record<string, any> = {}
  for (const key in props) {
    if (!MOTION_PROPS.has(key)) {
      clean[key] = props[key]
    }
  }
  return clean
}

function createMotionElement(Tag: string) {
  const Component = React.forwardRef(
    ({ children, className, ...rest }: any, ref: any) => {
      const domProps = filterMotionProps(rest)
      return React.createElement(Tag, { ref, className, ...domProps }, children)
    }
  )
  Component.displayName = `motion.${Tag}`
  return Component
}

export const motion = {
  div: createMotionElement("div"),
  h1: createMotionElement("h1"),
  h2: createMotionElement("h2"),
  h3: createMotionElement("h3"),
  p: createMotionElement("p"),
  span: createMotionElement("span"),
  a: createMotionElement("a"),
  button: createMotionElement("button"),
  section: createMotionElement("section"),
  article: createMotionElement("article"),
  nav: createMotionElement("nav"),
  ul: createMotionElement("ul"),
  li: createMotionElement("li"),
  img: createMotionElement("img"),
  video: createMotionElement("video"),
}
