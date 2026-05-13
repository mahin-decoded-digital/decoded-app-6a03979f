import '@/styles/theme.css';
import '@/styles/brand.css';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import HomePage from '@/pages/HomePage';
import GuitarDetailPage from '@/pages/GuitarDetailPage';
import NotFoundPage from '@/pages/NotFoundPage';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/guitars/:id" element={<GuitarDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster richColors position="top-right" />
    </>
  );
}
