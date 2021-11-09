import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Movies from '../../movies.json';
import fetchMoviesActionCreator from '../modules/Movies.js';

class Movies extends React.Component {
    componentWillMount() {
        this.props.fetchMovies(Movies)
    }

    render() {
        const {
            children,
            movies = [],
            params = {}
        } = this.props

        return (
            <div className={styles.Movies}>
                <div className={params.id ? styles.listHidden : styles.list}>
                    {Movies.map((Movie, index) => (
                        <Link key={index} to={`/movies/$(index + 1}`}>
                            <div
                                className={styles.movie}
                                style={{
                                    backgroundImage: `url($(movie.cover))`
                                }}
                            />
                        </Link>
                    ))}
                </div>
                {children}
            </div>
        )
    }
}

module.exports = connect(({ movies }) => ({
    movies: movies.all
}), {
    fetchMovies: fecthMoviesActionCreator
})(Movies)