import './LoadingSpinner.css'

type LoadingSpinnerProps = {
  size?: 'small' | 'medium' | 'large'
  message?: string
}

export default function LoadingSpinner({ size = 'medium', message }: LoadingSpinnerProps) {
  return (
    <div className={`loading-spinner loading-spinner--${size}`}>
      <div className="loading-spinner__icon">
        <div className="loading-spinner__circle"></div>
      </div>
      {message && <p className="loading-spinner__message">{message}</p>}
    </div>
  )
}
