import React from "react";
import { BrowserRouter as Router, Route, IndexRoute, browserHistory } from "react-router-dom";
import App from "./components/app/App.js";
import Movies from "./components/movies/Movies.js";
import Movie from "./components/movie/Movie.js";

module.exports = (
    <Router history={browserHistory}>
        <Route path="/" element={<App />}>
            <IndexRoute element={<Movies />} />
            <Route path="movies" element={<Movies />}>
                <Route path=":id" element={<Movie />} />
            </Route>
        </Route>
    </Router>
)