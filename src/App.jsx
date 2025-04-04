import {
  createBrowserRouter, createRoutesFromElements, 
  Route, RouterProvider 
} from 'react-router-dom';
import './App.css';
import SignUpPage from './pages/SignUpPage';
import LogInPage from './pages/LogInPage';
import HomePage from './pages/HomePage';
import MainLayout from './layout/MainLayout';
import ServerErrorPage from './pages/ServerErrorPage';
import UserProfilePage from './pages/UserProfilePage';
import EditUserProfilePage from './pages/EditUserProfilePage';
import CreatePostPage from './pages/CreatePostPage';
import WeekieTalkiePage from './pages/WeekieTalkiePage';
import PostDetailsPage from './pages/PostDetailsPage';
import MyPostsPage from './pages/MyPostsPage';
import NewsPage from './pages/NewsPage';
import NotFoundErrorPage from './pages/NotFoundErrorPage';

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route index element={<LogInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/serverError" element={<ServerErrorPage />} />
        <Route path="/" element={<MainLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/weekieTalkie" element={<WeekieTalkiePage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/my/posts" element={<MyPostsPage />} />
          <Route path="/users/profile/:userId" element={<UserProfilePage />} />
          <Route path="/my/settings" element={<EditUserProfilePage />} />
          <Route path="/createPost" element={<CreatePostPage />} />
          <Route path="/details/posts/:postId" element={<PostDetailsPage />} />
        </Route>
        <Route path="*" element={<NotFoundErrorPage />} />
      </>
    )
  );

  return (
    <RouterProvider router={router}/>
  )
}

export default App;