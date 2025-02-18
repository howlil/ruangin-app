import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function AnimatedListItem({
  children,
  position
}) {
  const animations = {
    initial: { y: -50, opacity: 0 },
    animate: { 
      y: position * 100, 
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

export const AnimatedListTimeline = React.memo(({
  children,
  className,
  delay = 3000,
  ...props
}) => {
  const childrenArray = useMemo(() => React.Children.toArray(children), [children]);
  
  // Calculate total number of groups
  const totalGroups = Math.ceil(childrenArray.length / 4);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentGroupIndex(prev => (prev + 1) % totalGroups);
    }, delay);

    return () => clearTimeout(timeout);
  }, [currentGroupIndex, delay, totalGroups]);

  // Get current group of 4 items
  const currentItems = useMemo(() => {
    const startIndex = currentGroupIndex * 4;
    const items = [];
    
    for (let i = 0; i < 4; i++) {
      const index = startIndex + i;
      if (index < childrenArray.length) {
        items.push({
          item: childrenArray[index],
          position: i,
          key: childrenArray[index].key
        });
      }
    }
    
    return items;
  }, [currentGroupIndex, childrenArray]);

  return (
    <div className="flex flex-col items-center relative h-[450px]" {...props}>
      <AnimatePresence mode="popLayout">
        {currentItems.map(({ item, position, key }) => (
          <AnimatedListItem 
            key={key} 
            position={position}
          >
            {item}
          </AnimatedListItem>
        ))}
      </AnimatePresence>
    </div>
  );
});

AnimatedListTimeline.displayName = "AnimatedListTimeline";

export default AnimatedListTimeline;