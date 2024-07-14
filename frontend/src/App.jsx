import { Button, Container, Box } from "@chakra-ui/react"
import { Navigate, Route, Routes,useLocation } from "react-router-dom"
import HomePage from "./pages/HomePage.jsx"
import Footer from "./components/Footer.jsx"
import ChatPage from "./pages/ChatPage.jsx"
import FindPage from "./pages/FindPage.jsx"
import UserProfile from "./pages/UserProfile.jsx"
import Notification from "./pages/Notification.jsx"
import AuthPage from "./pages/AuthPage.jsx"
import { useRecoilValue } from "recoil"
import userAtom from "./atom/userAtom.js"
import Settings from "./pages/Settings.jsx"

function App() {
  const user = useRecoilValue(userAtom)
  const {pathname} = useLocation()
  return (
    <Box position={"relative"} w={"full"}>
      <Container maxW={{ base: "100%", md: "900px" }}>
        <Routes>
          <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to='/' />} />
          <Route path="/" element={user ? <HomePage /> : <Navigate to='/auth' />} />
          <Route path='chat/:username' element={<ChatPage />} />
          <Route path="/find" element={<FindPage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/update" element={<Notification />} />
          <Route path="/setting" element={<Settings />} />
        </Routes>
       
      </Container>
      {pathname === '/' && user && <Footer /> }
      {pathname === '/find' && user && <Footer /> }
      {pathname === '/profile' && user && <Footer /> }
      {pathname === '/update' && user && <Footer /> }
      
    </Box>
  )
}

export default App
