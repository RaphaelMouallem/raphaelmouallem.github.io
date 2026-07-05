import { motion, AnimatePresence } from 'framer-motion'
import { useContent } from '@/hooks/useContent'
import { ac, glass, MONO } from '@/pages/experience/styles/synthwave/ui/kit'

export default function FooterCard({ visible, isMobile }) {
  const { footer } = useContent()

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="footer"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{
            ...(isMobile ? glass(ac(0)) : {}),
            position: 'absolute',
            bottom: isMobile ? 75 : 40,
            left: isMobile ? 16 : '50%',
            right: isMobile ? 16 : 'auto',
            transform: isMobile ? 'none' : 'translateX(-50%)',
            textAlign: 'center',
            pointerEvents: 'none',
            width: isMobile ? 'auto' : 420,
            padding: 10,
          }}
        >
          <h2
            style={{
              fontFamily: MONO,
              fontSize: 'clamp(22px, 4vw, 30px)',
              fontWeight: 700,
              color: '#ffcc66',
              margin: '0 0 8px',
            }}
          >
            {footer.heading}
          </h2>
          <p
            style={{
              fontFamily: MONO,
              fontSize: 12,
              color: 'rgba(255,255,255,0.45)',
              margin: '0 0 24px',
              lineHeight: 1.6,
            }}
          >
            {footer.subheading}
          </p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 24,
              marginBottom: 20,
              flexWrap: 'wrap',
            }}
          >
            {footer.links.map((l, i) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontFamily: MONO,
                  fontSize: 11,
                  color: ac(i),
                  textDecoration: 'none',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  borderBottom: `1px solid ${ac(i)}44`,
                  paddingBottom: 2,
                  pointerEvents: 'all',
                }}
              >
                {l.label}
              </a>
            ))}
          </div>
          <p
            style={{
              fontFamily: MONO,
              fontSize: 9,
              color: 'rgba(255,255,255,0.2)',
              letterSpacing: '0.06em',
            }}
          >
            {footer.footer}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
