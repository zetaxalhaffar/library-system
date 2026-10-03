import { GooeyToaster } from 'goey-toast'
import { Route, Routes } from 'react-router'
import { Navbar } from './components/layout/navbar'
import { BooksPage } from './pages/books/BooksPage'
import { NotFoundPage } from './pages/error/NotFoundPage'
import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route index element={<BooksPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <GooeyToaster position="top-right" closeButton />
    </>
  )
}

export default App
