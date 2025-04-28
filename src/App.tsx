import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Timer from './pages/timer';

const App: React.FC = () => {
    return (
        <div className="h-dvh w-dvw flex items-center justify-center">
            <Router>
                <Routes>
                    <Route path="/" element={<Timer />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
        </div>
    )
}

export default App
