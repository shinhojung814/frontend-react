import { handleActions } from 'redux-actions';
import FETCH_MOVIES from 'movies/FETCH-MOVIES';
import FETCH_MOVIE from 'movies.FETCH_MOVIE';

const initialState = {
    movies: [],
    movie: {}
}

module.exports = {
    fetchMovieActionCreator: (index) => ({
        type: FETCH_MOVIE,
        index
    }),
    fetchMoviesActionCreator: (Movies) => ({
        type: FETCH_MOVIES,
        Movies
    }),
    reducer: handleActions({
        [FETCH_MOVIES]: (state, action) => ({
            ...state,
            all: action.movies
        }),
        [FETCH_MOVIE]: (state, action) => ({
            ...state,
            current: state.all[action.index - 1]
        })
    }, initialState)
}