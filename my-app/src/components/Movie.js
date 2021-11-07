import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "./Movie.module.css";

function Movie({ id, title, year, summary, genres, coverImage }) {
    return (
        <div className={styles.movie}>
            <img className={styles.movie_image} src={coverImage} alt={title} />
            <div>
                <h2 className={styles.movie_title}>
                    <Link to={`/movies/${id}`}>{title}</Link>
                </h2>
                <h3 className={styles.movie_year}>{year}</h3>
                <p className={styles.movie_summary}>{summary.length > 235 ? `${summary.slice(0, 235)}...` : summary}</p>
                <ul className={styles.movie_genres}>
                    {genres.map((genre) => (
                        <li key={genre}>{genre}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

Movie.propTypes = {
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    genres: PropTypes.arrayOf(PropTypes.string).isRequired,
    coverImage: PropTypes.string.isRequired,
};

export default Movie;