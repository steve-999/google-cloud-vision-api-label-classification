import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import Footer from './components/footer';
import Home from './components/home';
import Gallery from './components/gallery';
import SingleFile from './components/singleFile';
import FileNotFound from './components/fileNotFound';
import './App.css';

function App() {

  return (
    <div className="App">
      <BrowserRouter>
          <Navbar />
          <main>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/gallery" exact component={Gallery} />
                <Route path="/gallery/:fname" component={SingleFile} />
                <Route path="*" component={FileNotFound} />
            </Switch>
          </main>      
          <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
