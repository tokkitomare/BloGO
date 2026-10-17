import { Route, Routes, BrowserRouter } from "react-router-dom";
import * as Pages from "./pages";
import { AuthProvider } from "./contexts/AuthContext";
const { Tests,
  Home, Login, UserProfile, 
  NotFound, Layout, Post, 
  PostView, Groups, GroupManage, GroupCreate,
  GroupAbout, GroupHome,
} = Pages;

export default function App() {
  return (
     <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={ <Layout/> }>
              <Route index element={ <Home/> } />
              <Route path="post/:id" element={<PostView />} />
              <Route path="groups/search" element={<Groups />} />

              <Route element={<Pages.GuestsOnly />}>
                <Route path="login" element={<Login />} />
              </Route>

              <Route element={<Pages.RequireAuth />}>
                <Route path="profile/:id" element={<UserProfile />} />
                <Route path="post" element={<Post />} />
                <Route path="groups/create" element={<GroupCreate />} />
                <Route path="groups/manage" element={<GroupManage />} />
                <Route path="group/about/:id" element={<GroupAbout />} />
                <Route path="group/:id" element={<GroupHome />} />
              </Route>

              {/* TIRAR ISTO ANTES DE SUBIR PRA PRODUÇÃO */}
              <Route path="/testssecret" element={ <Tests/> }/>

              <Route path="*" element={ <NotFound/> }/>
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}
