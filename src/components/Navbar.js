// import { Link } from "react-router-dom";
// import Login from "../pages/Login";
// import Register from "../pages/CreateClinic";
// import { useContext } from "react";
// import AuthContext from "../context/AuthContext";
// // import "../App.css";

// const Navbar = ({ title = "Admin" }) => {
//   const { user, setUser } = useContext(AuthContext);

//   return (
//     <nav
//       className="navbar navbar-expand bg-dark"
//       data-bs-theme="dark"
//       // style={{ height: "", width: "500px" }}
//     >
//       <div className="container-fluid ">
//         <Link to="/">
//           <a className="navbar-brand">{title}</a>
//         </Link>

//         <div className="collapse navbar-collapse" id="navbarColor02">
//           <ul className="navbar-nav ms-auto ">
//             <li className="nav-item">
//               <Link to="/">
//                 <a className="nav-link">Login</a>
//               </Link>
//             </li>
//             <li className="nav-item">
//               <Link to="/create-clinic">
//                 <a className="nav-link">Add Clinic</a>
//               </Link>

//               {/* <button className="btn btn-danger">Logout</button> */}
//             </li>
//             <li>
//               <Link to="/create-admin">
//                 <a className="nav-link">Add Admin</a>
//               </Link>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
