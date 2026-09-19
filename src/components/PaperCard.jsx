import { twMerge } from 'tailwind-merge'

export default function PaperCard({ children, className = '', ...props }) {
  return (
    <div
      className={twMerge('bg-paper-soft border border-border rounded-[2px] px-[30px] py-7', className)}
      {...props}
    >
      {children}
    </div>
  )
}
