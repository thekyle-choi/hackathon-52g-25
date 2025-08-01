'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MENU_CONFIG } from '@/lib/menuConfig'

const allMenuItems = [
  { id: 'main', label: '해커톤 소개', href: '#main', isInternal: true },
  { id: 'guide', label: '사전 학습 가이드', href: '/guide', isInternal: false },
  { id: 'reference', label: '쇼케이스', href: '/reference', isInternal: false },
  { id: 'plai-event', label: 'PLAI Event', href: '/plai-event', isInternal: false },
  { id: 'podcast', label: '팟캐스트', href: 'https://www.podbbang.com/channels/1793063', isInternal: false, isPodcast: true },
  { id: 'faq', label: 'FAQ', href: '#faq', isInternal: true }
]

// 조건부로 메뉴 아이템 필터링
const menuItems = allMenuItems.filter(item => {
  switch(item.id) {
    case 'main': return MENU_CONFIG.SHOW_MAIN
    case 'guide': return MENU_CONFIG.SHOW_GUIDE
    case 'reference': return MENU_CONFIG.SHOW_SHOWCASE
    case 'plai-event': return MENU_CONFIG.SHOW_PLAI_EVENT
    case 'podcast': return MENU_CONFIG.SHOW_PODCAST
    case 'faq': return MENU_CONFIG.SHOW_FAQ
    default: return true
  }
})

interface NavigationProps {
  isMainPage?: boolean
}

export default function Navigation({ isMainPage = false }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  
  // Determine initial active section
  const getInitialSection = () => {
    if (pathname === '/guide') return 'guide'
    if (pathname === '/reference') return 'reference'
    if (pathname === '/plai-event') return 'plai-event'
    return 'main'
  }
  
  const [activeSection, setActiveSection] = useState(getInitialSection())
  
  // Update active section when pathname changes
  useEffect(() => {
    let newSection = 'main'
    if (pathname === '/guide') newSection = 'guide'
    else if (pathname === '/reference') newSection = 'reference'
    else if (pathname === '/plai-event') newSection = 'plai-event'
    
    setActiveSection(newSection)
  }, [pathname])
  
  // Handle scroll to section on main page load
  useEffect(() => {
    if (pathname === '/') {
      const scrollToSection = sessionStorage.getItem('scrollToSection')
      if (scrollToSection) {
        sessionStorage.removeItem('scrollToSection')
        
        // Wait for page to load before scrolling
        setTimeout(() => {
          if (scrollToSection === 'main') {
            window.scrollTo({ top: 0, behavior: 'instant' })
          } else if (scrollToSection === 'faq') {
            const faqElement = document.getElementById('faq')
            if (faqElement) {
              faqElement.scrollIntoView({ behavior: 'instant', block: 'start' })
            }
          } else {
            const element = document.getElementById(scrollToSection)
            if (element) {
              const offsetTop = element.offsetTop - 80
              window.scrollTo({ top: offsetTop, behavior: 'instant' })
            }
          }
          
          // Update active section immediately
          setActiveSection(scrollToSection)
        }, 100)
      }
    }
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
      
      // Only run scroll spy on main page
      if (pathname === '/') {
        const currentSection = getCurrentSection()
        setActiveSection(currentSection)
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname])
  
  const getCurrentSection = () => {
    const scrollPosition = window.scrollY
    const windowHeight = window.innerHeight
    
    // If we're at the very top of the page, return 'main'
    if (scrollPosition < 100) {
      return 'main'
    }
    
    // Find FAQ section position
    const faqElement = document.getElementById('faq')
    if (faqElement) {
      const faqRect = faqElement.getBoundingClientRect()
      const faqTop = faqRect.top
      const faqBottom = faqRect.bottom
      
      // If FAQ section is in view (at least 30% visible), make it active
      if (faqTop < windowHeight * 0.7 && faqBottom > windowHeight * 0.3) {
        return 'faq'
      }
    }
    
    // For all other cases, return 'main'
    // This ensures that when scrolling up from FAQ, it goes to 'main'
    return 'main'
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  const handleMenuClick = (item: typeof menuItems[0]) => {
    // 팟캐스트 메뉴인 경우 새 창에서 열기
    if (item.isPodcast) {
      window.open(item.href, '_blank')
      setIsOpen(false)
      return
    }
    
    // Only handle internal links
    if (!item.isInternal) return
    
    const targetId = item.href.replace('#', '')
    
    // If we're not on the main page, navigate to main page first
    if (pathname !== '/') {
      // Store the target section in sessionStorage
      sessionStorage.setItem('scrollToSection', targetId)
      window.location.href = '/'
      return
    }
    
    // We're on the main page - handle scrolling
    setIsOpen(false)
    setActiveSection(targetId)
    
    // Navigate to section - both with instant behavior
    if (item.href === '#main') {
      window.scrollTo({ top: 0, behavior: 'instant' })
    } else if (item.href === '#faq') {
      // Instant navigation to FAQ section
      const faqElement = document.getElementById('faq')
      if (faqElement) {
        faqElement.scrollIntoView({ behavior: 'instant', block: 'start' })
      }
    }
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={`fixed top-12 right-8 z-[60] hidden md:block transition-all duration-300`}>
        <div className={`${scrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-white/70 backdrop-blur-sm'} rounded-full p-1.5 transition-all duration-300`}>
          <ul className="flex items-center gap-0.5">
            {menuItems.map((item) => (
              <li key={item.id}>
                {item.isPodcast ? (
                  // 팟캐스트 버튼 (글자색으로만 구별)
                  <button
                    onClick={() => handleMenuClick(item)}
                    className="block px-5 py-2.5 text-sm font-bold transition-colors duration-150 rounded-full relative cursor-pointer text-purple-600 hover:text-purple-700"
                  >
                    <div className="flex items-center gap-2">
                      {/* 라이브 인디케이터 */}
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [1, 0.7, 1]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="w-1.5 h-1.5 bg-purple-500 rounded-full"
                      />
                      <span>{item.label}</span>
                    </div>
                  </button>
                ) : item.isInternal ? (
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault()
                      handleMenuClick(item)
                    }}
                    className={`block px-5 py-2.5 text-sm font-medium transition-colors duration-150 rounded-full relative cursor-pointer ${
                      activeSection === item.id
                        ? 'text-white' 
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    {activeSection === item.id && (
                      <div className="absolute inset-0 bg-gray-900 rounded-full" />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    prefetch={true}
                    className={`block px-5 py-2.5 text-sm font-medium transition-colors duration-150 rounded-full relative ${
                      activeSection === item.id
                        ? 'text-white' 
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    {activeSection === item.id && (
                      <div className="absolute inset-0 bg-gray-900 rounded-full" />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed ${isMainPage ? 'top-10' : 'top-6'} right-6 z-[60] p-2.5 rounded-full md:hidden transition-all duration-300 ${
          scrolled 
            ? 'bg-white/90 backdrop-blur-md shadow-lg' 
            : 'bg-white/70 backdrop-blur-sm'
        }`}
      >
        <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] md:hidden"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-white shadow-2xl z-[60] md:hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">메뉴</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Menu Items */}
              <nav className="p-4">
                <ul className="space-y-2">
                  {menuItems.map((item) => (
                    <li key={item.id}>
                      {item.isPodcast ? (
                        // 모바일 팟캐스트 버튼
                        <button
                          onClick={() => handleMenuClick(item)}
                          className="w-full flex items-center gap-3 px-4 py-3 font-bold rounded-lg transition-colors text-purple-600 hover:bg-purple-50 hover:text-purple-700"
                        >
                          <motion.div
                            animate={{
                              scale: [1, 1.2, 1],
                              opacity: [1, 0.7, 1]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            className="w-2 h-2 bg-purple-500 rounded-full"
                          />
                          {item.label}
                        </button>
                      ) : item.isInternal ? (
                        <a
                          href={item.href}
                          onClick={(e) => {
                            e.preventDefault()
                            handleMenuClick(item)
                          }}
                          className={`block px-4 py-3 font-medium rounded-lg transition-colors ${
                            activeSection === item.id
                              ? 'bg-gray-900 text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {item.label}
                        </a>
                      ) : (
                        <Link
                          href={item.href}
                          prefetch={true}
                          onClick={() => setIsOpen(false)}
                          className={`block px-4 py-3 font-medium rounded-lg transition-colors ${
                            activeSection === item.id
                              ? 'bg-gray-900 text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {item.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
