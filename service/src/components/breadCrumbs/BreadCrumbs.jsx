import React from 'react'
import {motion} from 'framer-motion';
import {useLocation, Link} from 'react-router'
import { FaGreaterThan } from "react-icons/fa6";

function BreadCrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);
  return (
    <div className='w-full bg-white'>
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='w-[90vw] md:w-[50vw] mx-auto py-4 flex items-center'
        >
          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
        
            return (
                <motion.div
                    key={name}
                    className="flex items-center"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Link
                        to={routeTo}
                        className={`text-base hover:text-black transition-colors ${isLast ? 'font-semibold text-black' : 'text-gray-600'}`}
                    >
                        {name}
                    </Link>
                    {!isLast && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <FaGreaterThan className='mx-3 text-gray-300 text-sm'/>
                        </motion.div>
                    )}
                </motion.div>
            );
          })}
        </motion.div>
    </div>
  )
}

export default BreadCrumbs
