import LoginForm from "@/components/login-form"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-600 mb-2">StudyBuddy</h1>
          <p className="text-gray-600">Your AI-powered study assistant</p>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}
