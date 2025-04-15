import {
  createBrowserRouter, createRoutesFromElements, 
  Route, RouterProvider 
} from 'react-router-dom';
import './App.css';
import SignUpPage from './pages/SignUpPage';
import LogInPage from './pages/LogInPage';
import MainLayout from './layout/MainLayout';
import ServerErrorPage from './pages/ServerErrorPage';
import UserProfilePage from './pages/UserProfilePage';
import EditUserProfilePage from './pages/EditUserProfilePage';
import CreatePostPage from './pages/CreatePostPage';
import WeekieTalkiePage from './pages/WeekieTalkiePage';
import PostDetailsPage from './pages/PostDetailsPage';
import MyPostsPage from './pages/MyPostsPage';
import NotFoundErrorPage from './pages/NotFoundErrorPage';
import PopularPostsPage from './pages/PopularPostsPage';
import InteractedPostsPage from './pages/InteractedPostsPage';
import NewestPostsPage from './pages/NewestPostsPage';

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route index element={<LogInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/serverError" element={<ServerErrorPage />} />
        <Route path="/" element={<MainLayout />}>
          <Route path="/weekieTalkie" element={<WeekieTalkiePage />} />
          <Route path="/weekieTalkie/newest" element={<NewestPostsPage />} />
          <Route path="/weekieTalkie/my/posts" element={<MyPostsPage />} />
          <Route path="/weekieTalkie/popular" element={<PopularPostsPage />} />
          <Route path="/weekieTalkie/my/interacted" element={<InteractedPostsPage />} />
          <Route path="/users/profile/:userId" element={<UserProfilePage />} />
          <Route path="/users/my/settings" element={<EditUserProfilePage />} />
          <Route path="/posts/add" element={<CreatePostPage />} />
          <Route path="/posts/details/:postId" element={<PostDetailsPage />} />
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