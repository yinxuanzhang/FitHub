import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { use, useEffect,useState } from "react";
//三种模式，登录，登出，loading，刷新时整个页面会进入loading状态，验证token后根据结果进入登录或登出状态
//如果没有checking状态，页面会闪烁一下，因为初始状态是未认证的，所以需要添加checking状态来控制页面显示
export  default  function ProtectedRoute() {
  const { isAuthenticated,validateToken } = useAuth();
  const location = useLocation();
  const[checking,setChecking]=useState(!isAuthenticated);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if(!isAuthenticated && token){
      validateToken(token).finally(() => setChecking(false));
    }else{
      setChecking(false);
    }
  },[]);
      
    if(checking){
      return <div>Loading...</div>;
    }
  
  
  if(!isAuthenticated){
  
  return <Navigate to="/login" state={{ from: location }} replace />;

}



  return <Outlet />;
}   


  

