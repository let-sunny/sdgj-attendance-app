import React from 'react';
import Header from './components/Header';
import Calendar from './components/Calendar';
import FirebaseContext from "./context/FirebaseContext";

function App() {
    return (
        <FirebaseContext.Consumer>
            {firebase =>
                <div className="App">
                    <header>
                        <Header firebase={ firebase }/>
                    </header>
                    <main>
                        <Calendar />
                    </main>
                </div>
            }
        </FirebaseContext.Consumer>
    );
}

export default App;
