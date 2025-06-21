export const Card = ({ children, className }: any) => (
    <div className={`rounded-lg border p-6 shadow ${className}`}>{children}</div>
  )
  
  export const CardHeader = ({ children, className }: any) => (
    <div className={`mb-4 ${className}`}>{children}</div>
  )
  
  export const CardTitle = ({ children, className }: any) => (
    <h2 className={`text-xl font-semibold ${className}`}>{children}</h2>
  )
  
  export const CardDescription = ({ children, className }: any) => (
    <p className={`text-sm text-gray-400 ${className}`}>{children}</p>
  )
  
  export const CardContent = ({ children, className }: any) => (
    <div className={`space-y-4 ${className}`}>{children}</div>
  )
  