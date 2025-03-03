  import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"

export function SignupPage() {
  const navigate = useNavigate()
  const { signup, isLoading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    try {
      await signup(email, password)
      navigate("/dashboard", { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign up")
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex items-start justify-center space-x-12">
          {/* Left Side - Signup Form */}
          <div className="w-[440px] ml-12">
            <div className="mb-8 flex space-x-8">
              <Link 
                to="/login" 
                className="text-gray-400 hover:text-gray-300 transition-colors pb-4"
              >
                Login
              </Link>
              <button 
                className="text-blue-500 font-medium relative pb-4 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-blue-500" 
                aria-current="page"
              >
                Sign Up
              </button>
            </div>

            <div className="bg-gray-800 rounded-3xl p-8 shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-3 text-sm text-red-400 bg-red-900/50 rounded-xl border border-red-500/20" role="alert">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm text-gray-300 font-medium mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none">
                        <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2m20 0l-10 7L2 6m20 0v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-700 border border-gray-600 
                      text-white placeholder-gray-400 focus:outline-none focus:ring-1 
                      focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Enter your email"
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="new-password" className="block text-sm text-gray-300 font-medium mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none">
                        <path d="M12 17v-2m-9 4V9c0-1.1.9-2 2-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2zm5-12V5a4 4 0 118 0v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <input
                      id="new-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-700 border border-gray-600 
                      text-white placeholder-gray-400 focus:outline-none focus:ring-1 
                      focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Create a password"
                      required
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirm-password" className="block text-sm text-gray-300 font-medium mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none">
                        <path d="M12 17v-2m-9 4V9c0-1.1.9-2 2-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2zm5-12V5a4 4 0 118 0v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-700 border border-gray-600 
                      text-white placeholder-gray-400 focus:outline-none focus:ring-1 
                      focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Confirm your password"
                      required
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl
                  transition-all duration-200 font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </button>
              </form>
            </div>
          </div>

          {/* Right Side - Features */}
          <div className="w-[440px] mt-[72px] mr-12 bg-gray-800/60 backdrop-blur-lg rounded-3xl p-8 shadow-[0_4px_12px_rgba(0,0,0,0.2)] border border-gray-700/50">
            <h2 className="text-2xl font-bold text-white mb-8">Welcome to SmartCity AI</h2>
            <p className="text-gray-300 mb-8">
              Experience the future of urban living with our cutting-edge AI-powered platform that transforms city management and citizen services.
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="none">
                    <path d="M9 19v-6a2 2 0 012-2h2a2 2 0 012 2v6M3 12l9-9 9 9m-2-3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">AI-Powered Analytics</h3>
                  <p className="text-gray-400">Real-time insights for better urban planning</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-500" viewBox="0 0 24 24" fill="none">
                    <path d="M12 22s8-4 8-10V6l-8-4-8 4v6c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Environmental Monitoring</h3>
                  <p className="text-gray-400">IoT-based environmental quality tracking</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-500" viewBox="0 0 24 24" fill="none">
                    <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Smart Security</h3>
                  <p className="text-gray-400">Advanced surveillance and safety measures</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}