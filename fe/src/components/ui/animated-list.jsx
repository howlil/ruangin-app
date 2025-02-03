"use client";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";

export function AnimatedListItem({
  children,
  position
}) {
  const animations = {
    initial: { y: -50, opacity: 0 },
    animate: { 
      y: position * 90, 
      opacity: 1 
    },
    exit: { y: 400, opacity: 0 },
    transition: { type: "spring", stiffness: 350, damping: 40 },
  };

  return (
    <motion.div 
      {...animations} 
      className="mx-auto w-full absolute top-0"
    >
      {children}
    </motion.div>
  );
}

export const AnimatedList = React.memo(({
  children,
  className,
  delay = 3000,
  ...props
}) => {
  const [activeIndices, setActiveIndices] = useState([0]);
  const childrenArray = useMemo(() => React.Children.toArray(children), [children]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setActiveIndices(prev => {
        const nextIndex = (prev[0] + 1) % childrenArray.length;
        return [nextIndex, ...prev].slice(0, childrenArray.length);
      });
    }, delay);

    return () => clearTimeout(timeout);
  }, [activeIndices, delay, childrenArray.length]);

  return (
    <div className="flex flex-col items-center relative h-96" {...props}>
      <AnimatePresence mode="popLayout">
        {activeIndices.map((itemIndex, position) => (
          <AnimatedListItem 
            key={childrenArray[itemIndex].key} 
            position={position}
          >
            {childrenArray[itemIndex]}
          </AnimatedListItem>
        ))}
      </AnimatePresence>
    </div>
  );
});

AnimatedList.displayName = "AnimatedList";

export default AnimatedList;