import React from 'react'
import {motion} from 'framer-motion'
import logo from '../../assets/timelens.png'
function Header() {
  return (
    <motion.nav
        className="px-10  py-1 shadow-2xl rounded-3xl bg-white z-10"
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.img src={logo} className="h-20" alt="logo" />
      </motion.nav>
  )
}

export default Header
