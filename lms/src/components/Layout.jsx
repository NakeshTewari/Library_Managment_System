
import Navbar from "./Navbar";
import SubNavbar from "./SubNavbar";
import Sidebar from "./Sidebar";

const Layout = ({children}) => {
   
   return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <div className="p-6">
          {children}   
        </div>
      </div>
    </div>
  )
}

export default Layout
