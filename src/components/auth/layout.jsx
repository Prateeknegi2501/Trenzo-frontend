import { Outlet } from "react-router-dom";
import video from "../../assets/Video.mp4";

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full">
      <div className="relative hidden lg:flex items-center justify-center bg-black w-1/2 px-12">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="relative max-w-md space-y-6 text-center text-white z-10">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Welcome to TRENZO
          </h1>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
