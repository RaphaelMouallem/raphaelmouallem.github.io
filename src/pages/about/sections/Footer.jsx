import { useContent } from '@/hooks/useContent'
import Section from '../components/Section'
import SeigaihaField from '../assets/SeigaihaField'
import { useIsMobile } from '@/ui/components/utils'

export default function Footer() {
  const { footer } = useContent()
  const footerBottom = useIsMobile(641)

  return (
    <div style={{ position: 'relative' }}>
      <SeigaihaField />
      <Section id="footer" style={styles.section}>
        <div style={styles.top}>
          <h2 style={styles.heading}>{footer.heading}</h2>
          <p style={styles.subheading}>{footer.subheading}</p>
        </div>

        <div style={styles.columns}>
          <div style={styles.column}>
            <p style={styles.columnLabel}>Sections</p>
            {footer.sections.map((l) => (
              <a key={l.label} href={l.href} data-cursor="hover" className="footer-link">
                {l.label}
              </a>
            ))}
          </div>
          <div style={styles.column}>
            <p style={styles.columnLabel}>Connect</p>
            {footer.social.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                data-cursor="hover"
                className="footer-link"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: footerBottom ? 'column' : 'row',
            alignItems: footerBottom ? 'center' : 'flex-start',
            justifyContent: footerBottom ? 'center' : 'space-between',
            textAlign: footerBottom ? 'center' : 'left',
            gap: 16,
            paddingTop: 24,
            borderTop: '1px solid var(--ink-faint)',
          }}
        >
          <p style={styles.copyright}>{footer.footer}</p>
          <span style={styles.hanko}>RM</span>
        </div>
      </Section>
    </div>
  )
}

const styles = {
  section: {
    margin: '0 auto',
    padding: '8vh 9vh 5vh',
  },
  top: {
    marginBottom: 20,
  },
  heading: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.8rem',
    fontWeight: 800,
    margin: '0 0 8px',
    textTransform: 'uppercase',
    color: 'var(--accent)',
  },
  subheading: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.95rem',
    color: 'var(--ink-soft)',
    margin: 0,
  },
  columns: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 64,
    marginBottom: 48,
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  columnLabel: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.7rem',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'var(--accent)',
    margin: '0 0 4px',
  },
  link: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.9rem',
    color: 'var(--ink-soft)',
    textDecoration: 'none',
    display: 'inline-block',
    borderRadius: '999px',
    padding: '0px 10px',
    width: 'fit-content',
  },
  hanko: {
    width: 46,
    height: 46,
    flexShrink: 0,
    border: '1.5px solid var(--accent)',
    borderRadius: 4,
    background: 'var(--accent-soft)',
    color: 'var(--accent)',
    fontFamily: 'var(--font-display)',
    fontSize: '0.85rem',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    writingMode: 'vertical-rl',
    transform: 'rotate(-6deg)',
    lineHeight: 1,
  },
  copyright: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.8rem',
    color: 'var(--ink-soft)',
    margin: 0,
  },
}
