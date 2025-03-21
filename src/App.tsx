import Quiz from "./components/Quiz";

import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

const App = () => {
    return (
        <div className="min-h-screen bg-gray-100 opacity-95 p-4">
            <h1 className="text-2xl font-bold mb-4">Mini Quiz App</h1>
            <Quiz />
        </div>
    );
};

export default App;
