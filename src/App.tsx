import { Routes, Route } from 'react-router-dom'
import SigninForm from './_auth/forms/SigninForm'
import SignupForm from './_auth/forms/SignupForm'
import Home from './_root/pages/Home'
import AuthLayout from './_auth/AuthLayout'
import RootLayout from './_root/RootLayout'
import './globals.css'
import { Toaster } from './components/ui/toaster'
import DailyNews from './_root/pages/DailyNews'
import CreatePost from './_root/pages/CreatePost'
import PostDetails from './_root/pages/PostDetails'
function App() {

  return (
    <main className="flex h-screen">
      <Routes>
        {/* public route  */}
        <Route element={<AuthLayout />} >
          <Route path='sign-in' element={<SigninForm />} />
          <Route path='sign-up' element={<SignupForm />} />
        </Route>
        {/* privite route  */}
        <Route element={<RootLayout />} >

          <Route index element={<Home />} />
          <Route path='daily-news' element={<DailyNews />} />
          <Route path='create-post' element={<CreatePost />} />
          <Route path="/posts/:id" element={<PostDetails />} />
        </Route>
      </Routes>
      <Toaster />
    </main>
  )
}

export default App
