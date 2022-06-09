import { Navigate, Route, Routes } from "react-router-dom";

const MainApp = () => {
    
    return (
        <Routes>
            <Route path="/" element={
                <Navigate to="/app/dashboard" />
            } />
            <Route path="/home" element={
                <Navigate to="/app/dashboard" />
            } />
            <Route path="/channels/:channelId" element={
                <div>
                    
                </div>
            } />
        </Routes>
    );
};

export default MainApp;
