export default function PaperCard({ children, style, ...props }) {
  return (
    <div style={{ ...styles.card, ...style }} {...props}>
      {children}
    </div>
  )
}

const styles = {
  card: {
    background: 'var(--paper-soft)',
    border: '1px solid var(--border)',
    borderRadius: 2,
    padding: '28px 30px',
  },
}
