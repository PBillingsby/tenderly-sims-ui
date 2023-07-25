interface ButtonProps {
  children: React.ReactNode,
  onClick?: () => void,
  type?: "button" | "submit" | "reset" | undefined
}
export const Button = ({ children, onClick, type }: ButtonProps) => {
  return (
    <button onClick={onClick} type={type} className="hover:bg-white text-red-700 font-semibold hover:text-red-400 py-2 px-4 border border-red-500 rounded">
      {children}
    </button>
  )
}