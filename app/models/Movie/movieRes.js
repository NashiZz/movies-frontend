export class movieRes {
    constructor(idmovie, title, overview, release_date, poster_path, background_path, rating, genres,) {
        this.idmovie = idmovie;
        this.title = title;
        this.overview = overview;
        this.release_date = release_date;
        this.poster_path = poster_path;
        this.background_path = background_path;
        this.rating = rating;
        this.genres = genres || [];
    }

    getPosterUrl() {
        return `https://image.tmdb.org/t/p/w500${this.poster_path}`;
    }

    getBackdropUrl() {
        return `https://image.tmdb.org/t/p/w1280${this.background_path}`;
    }

    getGenreNames() {
        return this.genres.map((genre) => genre.name).join(", ") || "ไม่ระบุ";;  
    }
}
