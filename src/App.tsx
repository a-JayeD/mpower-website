import { lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { I18nProvider } from '@/lib/i18n';
import { SettingsProvider } from '@/hooks/useSettings';
import { Layout } from '@/components/layout/Layout';
import HomePage from '@/pages/HomePage';

// Every page except Home is split into its own small file and loaded on demand.
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const CoursesPage = lazy(() => import('@/pages/CoursesPage'));
const CourseDetailPage = lazy(() => import('@/pages/CourseDetailPage'));
const InstructorsPage = lazy(() => import('@/pages/InstructorsPage'));
const GalleryPage = lazy(() => import('@/pages/GalleryPage'));
const AlbumPage = lazy(() => import('@/pages/AlbumPage'));
const UpdatesPage = lazy(() => import('@/pages/UpdatesPage'));
const UpdateDetailPage = lazy(() => import('@/pages/UpdateDetailPage'));
const SuccessStoriesPage = lazy(() => import('@/pages/SuccessStoriesPage'));
const FaqPage = lazy(() => import('@/pages/FaqPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

export default function App() {
  return (
    <I18nProvider>
      <SettingsProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="courses" element={<CoursesPage />} />
              <Route path="courses/:slug" element={<CourseDetailPage />} />
              <Route path="instructors" element={<InstructorsPage />} />
              <Route path="gallery" element={<GalleryPage />} />
              <Route path="gallery/:slug" element={<AlbumPage />} />
              <Route path="updates" element={<UpdatesPage />} />
              <Route path="updates/:slug" element={<UpdateDetailPage />} />
              <Route path="success-stories" element={<SuccessStoriesPage />} />
              <Route path="faq" element={<FaqPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="privacy" element={<PrivacyPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SettingsProvider>
    </I18nProvider>
  );
}
